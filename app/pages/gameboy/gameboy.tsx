import { useCallback, useEffect, useRef, useState } from "react";
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

    return () => {
      if (gameboy) {
        gameboy.quitMgba();
      }
    };
  }, [ref, gameboy]);

  const press = useCallback(
    (button: string) => () => {
      if (gameboy) {
        gameboy.buttonPress(button);
        setTimeout(() => {
          gameboy.buttonUnpress(button);
        }, 50);
      }
    },
    [gameboy],
  );

  return (
    <SiteWrapper>
      <DecDeBox>
        <canvas
          aria-description="A DECtalk program running in an emulator compatible with Nintendo Game Boy Advance games."
          className="decde-gameboy--screen"
          ref={ref}
        />

        <p className="decde-gameboy--download">
          <a href={dectalkGba}>Download ROM here!</a>
        </p>

        <div className="decde-gameboy--controls">
          <div className="decde-gameboy--dpad">
            <button onClick={press("Up")} className="decde-gameboy--button decde-gameboy--button-up">
              Up
            </button>
            <button onClick={press("Left")} className="decde-gameboy--button decde-gameboy--button-left">
              Left
            </button>
            <button onClick={press("Down")} className="decde-gameboy--button decde-gameboy--button-down">
              Down
            </button>
            <button onClick={press("Right")} className="decde-gameboy--button decde-gameboy--button-right">
              Right
            </button>
          </div>
          <div className="decde-gameboy--controlbuttons">
            <button onClick={press("Start")} className="decde-gameboy--button decde-gameboy--button-start">
              Start
              <br />
              <i>(Speak)</i>
            </button>
            <button onClick={press("Select")} className="decde-gameboy--button decde-gameboy--button-select">
              Select
              <br />
              <i>(Clear)</i>
            </button>
          </div>
          <div className="decde-gameboy--facebuttons">
            <button onClick={press("B")} className="decde-gameboy--button decde-gameboy--button-b">
              B
            </button>
            <button onClick={press("A")} className="decde-gameboy--button decde-gameboy--button-a">
              A
            </button>
          </div>
        </div>

        <h2>Keyboard Controls</h2>

        <table className="decde-table">
          <caption>Keybindings</caption>
          <thead>
            <tr>
              <th>Keyboard</th>
              <th>Game Boy Advance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Arrow keys</td>
              <td>D-Pad</td>
            </tr>
            <tr>
              <td>
                <kbd>X</kbd>
              </td>
              <td>
                <kbd>A</kbd>
              </td>
            </tr>
            <tr>
              <td>
                <kbd>Enter</kbd>
              </td>
              <td>
                <kbd>Start</kbd>
              </td>
            </tr>
            <tr>
              <td>
                <kbd>Backspace</kbd>
              </td>
              <td>
                <kbd>Select</kbd>
              </td>
            </tr>
          </tbody>
        </table>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { GameBoyPage };
