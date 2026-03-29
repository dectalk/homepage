import mGBA, { type mGBAEmulator } from "@thenick775/mgba-wasm";
import { useEffect, useState, type RefObject } from "react";
import dectalkGba from "../assets/DECtalkMiniV3.gba";

const useGameBoy = (canvas: RefObject<HTMLCanvasElement | null>) => {
  const [emulator, setEmulator] = useState<mGBAEmulator | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (canvas.current && emulator === null) {
        const gba = await mGBA({ canvas: canvas.current });
        await gba.FSInit();

        const req = await fetch(dectalkGba);
        const blob = await req.blob();
        const file = new File([blob], "dectalk.gba");

        gba.uploadRom(file, () => {
          gba.loadGame(gba.filePaths().gamePath + "/dectalk.gba");
        });

        setEmulator(gba);
      }
    };

    initialize();
  }, [canvas]);

  return emulator;
};

export { useGameBoy };
