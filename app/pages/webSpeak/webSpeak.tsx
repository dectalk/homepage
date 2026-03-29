import { useForm } from "react-hook-form";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { useDectalk } from "./dectalk";
import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router";

interface InputForm {
  phonemes: boolean;
  input: string;
  format: 1 | 0;
}

const WebSpeakPage = () => {
  const [searchParams] = useSearchParams();
  const { dectalk } = useDectalk();
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioLink, setAudioLink] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<InputForm>({
    defaultValues: {
      input: searchParams.get("input") ?? "",
      format: 1,
      phonemes: true,
    },
  });

  const onSubmit = useCallback(
    (data: InputForm) => {
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Text to synthesise</legend>
            <textarea {...register("input")} className="decde-webspeak--input" />
          </fieldset>
          <fieldset>
            <legend>Advanced Settings</legend>

            <div>
              <label htmlFor="format">Sample Rate</label>
              <select {...register("format")} id="format">
                <option value={1}>11 kHz</option>
                <option value={0}>8 kHz</option>
              </select>
            </div>
            <div>
              <label htmlFor="phonemes">Enable phonemes</label>
              <input type="checkbox" {...register("phonemes")} id="phonemes" />
            </div>
          </fieldset>
          <div>
            <button>{dectalk ? "Submit" : "Loading..."}</button>
          </div>
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
