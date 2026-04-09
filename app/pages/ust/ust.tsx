import { useForm } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeInputContainer, DecDeInputFieldset } from "~/components/containers/DecDeInputContainers";
import { createEspeakWasmPhonemizer } from "./espeak-wasm";
import { convertUSTText, convertUSTTextAsync, decodeUSTBuffer, type ConversionResult } from "./converter";

interface USTForm {
  noteOffset: number;
  useEspeak: boolean;
  stripLongSilences: boolean;
}

const USTPage = () => {
  const [status, setStatus] = useState({ message: "Ready.", isError: false });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [fileInfo, setFileInfo] = useState({ name: "", encoding: "" });
  const [output, setOutput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phonemizerRef = useRef(createEspeakWasmPhonemizer());

  const { register, handleSubmit } = useForm<USTForm>({
    defaultValues: {
      noteOffset: 0,
      useEspeak: false,
      stripLongSilences: false,
    },
  });

  const handleConvert = useCallback(
    async (data: USTForm) => {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setStatus({ message: "Select a .ust file first.", isError: true });
        return;
      }

      setStatus({
        message: data.useEspeak ? "Converting (loading espeak-ng WASM)..." : "Converting...",
        isError: false,
      });

      try {
        const arrayBuffer = await file.arrayBuffer();
        const { text, encoding } = decodeUSTBuffer(arrayBuffer);
        setFileInfo({ name: file.name, encoding });
        
        let res: ConversionResult;
        const options = {
          stripLongSilences: data.stripLongSilences,
          maxSilenceMs: 5000,
        };

        if (data.useEspeak) {
          try {
            res = await convertUSTTextAsync(text, data.noteOffset, {
              ...options,
              phonemizer: phonemizerRef.current,
            });
          } catch (err) {
            console.error(err);
            res = convertUSTText(text, data.noteOffset, options);
          }
        } else {
          res = convertUSTText(text, data.noteOffset, options);
        }

        setResult(res);
        setOutput(res.fullOutput);
        setStatus({
          message: data.useEspeak ? "Conversion complete (espeak-ng WASM enabled)." : "Conversion complete.",
          isError: false,
        });
      } catch (err) {
        console.error(err);
        setResult(null);
        setOutput("");
        setStatus({ message: `Conversion failed: ${String(err)}`, isError: true });
      }
    },
    [],
  );

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setStatus({ message: "Output copied to clipboard.", isError: false });
    } catch (err) {
      setStatus({ message: `Clipboard copy failed: ${String(err)}`, isError: true });
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const sourceName = fileInputRef.current?.files?.[0]?.name ?? "converted";
    a.href = url;
    a.download = `${sourceName.replace(/\.ust$/i, "")}.dectalk.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus({ message: "Output downloaded.", isError: false });
  };

  const openInBytesizedfox = () => {
    if (!output) return;
    const target = `https://bytesizedfox.dev/#text=${encodeURIComponent(output)}`;
    window.open(target, "_blank", "noopener,noreferrer");
    setStatus({ message: "Opened bytesizedfox.dev in a new tab.", isError: false });
  };

  return (
    <SiteWrapper>
      <DecDeBox>
        <h1>UST to DECtalk Converter</h1>
        <p>Convert UTAU Sequence Text (.ust) files to DECtalk phoneme commands.</p>

        <form onSubmit={handleSubmit(handleConvert)}>
          <div className="decde-ust--row">
            <DecDeInputContainer>
              <label htmlFor="ustFile">UST file</label>
              <input id="ustFile" type="file" accept=".ust,.txt" ref={fileInputRef} />
            </DecDeInputContainer>

            <DecDeInputContainer>
              <label htmlFor="noteOffset">Note offset</label>
              <input id="noteOffset" type="number" step="1" {...register("noteOffset", { valueAsNumber: true })} />
            </DecDeInputContainer>

            <button type="submit" className="decde-input--button">Convert</button>
            <button type="button" className="decde-input--button" onClick={copyOutput} disabled={!output}>
              Copy Output
            </button>
          </div>

          <div className="decde-ust--row">
            <button type="button" className="decde-input--button" onClick={downloadOutput} disabled={!output}>
              Download Output
            </button>
            <button
              type="button"
              className="decde-input--button"
              onClick={openInBytesizedfox}
              disabled={!output}
            >
              Open in bytesizedfox.dev
            </button>
          </div>

          <DecDeInputFieldset legend="Options">
            <DecDeInputContainer>
              <label>
                <input type="checkbox" {...register("useEspeak")} />
                Enable espeak-ng WASM phonemizer for English lyrics
              </label>
              <div className="decde-input--hint">
                This may take a moment to load on first use.
              </div>
            </DecDeInputContainer>

            <DecDeInputContainer>
              <label>
                <input type="checkbox" {...register("stripLongSilences")} />
                Strip long silences (&gt; 5 seconds)
              </label>
            </DecDeInputContainer>
          </DecDeInputFieldset>
        </form>

        <div className="decde-ust--status" data-state={status.isError ? "error" : "ok"}>
          {status.message}
        </div>

        <DecDeInputContainer>
          <label htmlFor="output">Converted output</label>
          <textarea
            id="output"
            className="decde-ust--output"
            readOnly
            value={output}
            placeholder="[:phone on] ..."
          />
        </DecDeInputContainer>

        <DecDeInputContainer>
          <label>Conversion details</label>
          <div className="decde-ust--details">
            {result ? (
              <>
                File: {fileInfo.name} | Decoded as: {fileInfo.encoding}
                {"\n"}
                Detected notation: {result.notationType}
                {"\n"}
                Notes: {result.notesCount} | Tempo: {result.tempo}
                {"\n"}
                Notation scores - Japanese: {result.notationCounts.japanese}, X-SAMPA: {result.notationCounts.xsampa}, English: {result.notationCounts.english}, IPA: {result.notationCounts.ipa}
                {"\n"}
                {result.stripLongSilencesEnabled
                  ? `Long silence stripping: enabled (>5000 ms), removed ${result.strippedSilences} silence note(s)`
                  : "Long silence stripping: disabled"}
                {"\n"}
                {result.espeakAvailable ? "English phonemizer: enabled (espeak-ng WASM)" : "English phonemizer: disabled"}
                {result.unknownLyrics.length > 0 && (
                  <>
                    {"\n"}
                    Unknown lyrics ({result.unknownLyrics.length}): {result.unknownLyrics.join(", ")}
                  </>
                )}
                {result.unknownIPA.length > 0 && (
                  <>
                    {"\n"}
                    Unknown IPA chars ({result.unknownIPA.length}): {result.unknownIPA.join(", ")}
                  </>
                )}
              </>
            ) : (
              "No conversion performed yet."
            )}
          </div>
        </DecDeInputContainer>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { USTPage };
