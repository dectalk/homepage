import { useEffect, useRef, useState } from "react";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { useGameBoy } from "~/hooks/useGameBoy";
import dectalkGba from "./DECtalkMiniV3.gba";

const GameBoyPage = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gameboy = useGameBoy(ref);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (gameboy && !loaded) {
      const load = async () => {
        const req = await fetch(dectalkGba);
        const blob = await req.blob();
        const file = new File([blob], "dectalk.gba");

        gameboy.uploadRom(file, () => {
          const success = gameboy.loadGame(gameboy.filePaths().gamePath + "/dectalk.gba");
          if (success) setLoaded(true);
        });
      };
      load();
    }
  }, [ref, gameboy]);

  return (
    <SiteWrapper>
      <DecDeBox>
        <h1>Gameboy advance demo!</h1>
        <canvas ref={ref} />
        <a href={dectalkGba}>Download ROM here!</a>
        <h3>Controls:</h3>
        <span>Arrow keys -&gt; D-Pad</span>
        <br></br>
        <span>x -&gt; A</span>
        <br></br>
        <span>backspace -&gt; SELECT</span>
        <br></br>
        <span>enter -&gt; START</span>
        <br></br>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { GameBoyPage };
