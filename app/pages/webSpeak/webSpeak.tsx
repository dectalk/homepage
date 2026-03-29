import { useForm } from "react-hook-form";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { DECtalkTransformation, useDectalk } from "./dectalk";
import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { DecDeInputContainer, DecDeInputFieldset } from "~/components/containers/DecDeInputContainers";

interface InputForm {
  phonemes: boolean;
  input: string;
  format: DECtalkTransformation;
}

const WebSpeakPage = () => {
  const [searchParams] = useSearchParams();
  const { dectalk } = useDectalk();
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioLink, setAudioLink] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<InputForm>({
    defaultValues: {
      input: searchParams.get("input") ?? "",
      format: DECtalkTransformation.DEFAULT_11025,
      phonemes: true,
    },
  });

  const onSubmit = useCallback(
    (data: InputForm) => {
      searchParams.set("input", data.input);

      if (dectalk) {
        let input = "";
        if (data.phonemes) input += "[:phone on]\n";
        input += data.input;

        const buffer = dectalk.synthesize({
          input,
          format: data.format,
        });

        const blob = new Blob([buffer]);
        const link = URL.createObjectURL(blob);
        setAudioLink(link);

        audioPlayer.current?.load();
        audioPlayer.current?.play();
      }
    },
    [dectalk],
  );

  return (
    <SiteWrapper>
      <noscript>
        <DecDeBox>
          <h1>You need to enable JavaScript to use this service</h1>
          <p>This service requires JavaScript as DECtalk runs fully within your web browser.</p>
        </DecDeBox>
      </noscript>
      <DecDeBox>
        <h1>DECtalk for Web</h1>
        <p>This is a version of DECtalk compiled into WebAssembly, which runs entirely within your web browser.</p>

        <h2>Synthesizer</h2>
        <form method="GET" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Text to synthesise</legend>
            <textarea {...register("input")} className="decde-webspeak--input" />
          </fieldset>
          <DecDeInputFieldset legend="Advanced Settings">
            <DecDeInputContainer>
              <label htmlFor="format">Preset</label>

              <select {...register("format")} id="format">
                <option value={DECtalkTransformation.DEFAULT_11025}>11 kHz</option>
                <option value={DECtalkTransformation.DEFAULT_8000}>8 kHz</option>
                <option value={DECtalkTransformation.MOONBASE_ALPHA_44100}>Moonbase Alpha</option>
              </select>
            </DecDeInputContainer>
            <DecDeInputContainer>
              <label htmlFor="phonemes">Enable phonemes</label>
              <div className="decde-input--hint" id="phonemes-hint">
                This option configures whether <code>[:phone on]</code> is prefixed to your input, for singing.
              </div>
              <input type="checkbox" {...register("phonemes")} id="phonemes" aria-describedby="phonemes-hint" />
            </DecDeInputContainer>
          </DecDeInputFieldset>
          <div>
            <button className="decde-input--button">{dectalk ? "Submit" : "Loading..."}</button>
          </div>
          <br />
          <div>
            {audioLink && (
              <audio ref={audioPlayer} controls>
                {audioLink && <source src={audioLink} type="audio/x-wav" />}
              </audio>
            )}
          </div>
        </form>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { WebSpeakPage };
