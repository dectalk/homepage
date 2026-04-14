import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeInputContainer, DecDeInputFieldset } from "~/components/containers/DecDeInputContainers";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { useLintalker, VOICES } from "./lintalkerHook";

interface InputForm {
  input: string;
  voice: number;
}

const LintalkerPage = () => {
  const { lintalker } = useLintalker();
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioLink, setAudioLink] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<InputForm>({
    defaultValues: {
      input: "",
      voice: 0,
    },
  });

  const onSubmit = useCallback(
    (data: InputForm) => {
      if (!lintalker) return;

      lintalker.setVoice(Number(data.voice));
      const buffer = lintalker.synthesize(data.input);

      const file = new File([buffer], "lintalker.wav", { type: "audio/wav" });
      const url = URL.createObjectURL(file);

      setAudioLink(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      setTimeout(() => {
        audioPlayer.current?.load();
        audioPlayer.current?.play();
      }, 0);
    },
    [lintalker],
  );

  return (
    <SiteWrapper>
      <noscript>
        <DecDeBox>
          <h1>You need to enable JavaScript to use this service</h1>
          <p>This service requires JavaScript as LinTalker runs fully within your web browser.</p>
        </DecDeBox>
      </noscript>
      <DecDeBox>
        <h1>LinTalker for Web</h1>
        <p>This is a version of LinTalker compiled into WebAssembly, which runs entirely within your web browser.</p>

        <h2>Synthesizer</h2>
        <form method="GET" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Text to synthesise</legend>
            <textarea {...register("input")} className="decde-lintalker--input" />
          </fieldset>
          <DecDeInputFieldset legend="Settings">
            <DecDeInputContainer>
              <label htmlFor="voice">Voice</label>
              <select {...register("voice")} id="voice">
                {VOICES.map((name, i) => (
                  <option key={i} value={i}>
                    {name}
                  </option>
                ))}
              </select>
            </DecDeInputContainer>
          </DecDeInputFieldset>
          <div>
            <button className="decde-input--button">{lintalker ? "Submit" : "Loading..."}</button>
          </div>
          <br />
          <div>
            {audioLink && (
              <audio ref={audioPlayer} controls>
                <source src={audioLink} type="audio/x-wav" />
              </audio>
            )}
          </div>
        </form>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { LintalkerPage };
