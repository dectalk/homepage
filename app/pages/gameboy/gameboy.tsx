import { useEffect, useRef } from "react";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeWidthContainer } from "~/components/containers/DecDeWidthContainer";
import { SiteFooter } from "~/components/site/SiteFooter";
import { SiteHeader } from "~/components/site/SiteHeader";
import { useGameBoy } from "~/hooks/useGameBoy";
import dectalk from "./DECtalkMiniV3.gba";

const GameBoyPage = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const gameboy = useGameBoy(ref);

  useEffect(() => {
    if (gameboy) {
      const load = async () => {
        const req = await fetch(dectalk);
        const blob = await req.blob();
        const file = new File([blob], "dectalk.gba");

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
            <canvas ref={ref} />
          </DecDeBox>
          <SiteFooter />
        </DecDeWidthContainer>
      </main>
    </div>
  );
};

export { GameBoyPage };
