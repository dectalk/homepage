import { useEffect, useRef, useState } from "react";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeWidthContainer } from "~/components/containers/DecDeWidthContainer";
import { SiteFooter } from "~/components/site/SiteFooter";
import { SiteHeader } from "~/components/site/SiteHeader";
import { useGameBoy } from "~/hooks/useGameBoy";
import dectalk from "./DECtalkMiniV3.gba";

const GameBoyPage = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gameboy = useGameBoy(ref);

  const [downloadURL, setDownloadURL] = useState("");

  useEffect(() => {
    if (gameboy) {
      const load = async () => {
        const req = await fetch(dectalk);
        const blob = await req.blob();
        const file = new File([blob], "dectalk.gba");
        setDownloadURL(URL.createObjectURL(file));

        gameboy.uploadRom(file, () => {
          gameboy.loadGame(gameboy.filePaths().gamePath + "/dectalk.gba");
        });
      };
      load();
    }
  }, [ref, gameboy]);

  return (
    <div>
      <main>
        <DecDeWidthContainer>
          <SiteHeader />
          <DecDeBox>
            <h1 style={{width: "100%", textAlign: "center"}}>Gameboy advance demo!</h1>
            <div style={{margin: "auto", width: "300px"}}>
                <canvas ref={ref} />
            </div>
            <a href={downloadURL} >Download ROM here!</a>
            <h3>Controls:</h3>
            <span>Arrow keys -&gt; D-Pad</span><br></br>
            <span>x -&gt; A</span><br></br>
            <span>backspace -&gt; SELECT</span><br></br>
            <span>enter -&gt; START</span><br></br>

            </DecDeBox>
          <SiteFooter />
        </DecDeWidthContainer>
      </main>
    </div>
  );
};

export { GameBoyPage };
