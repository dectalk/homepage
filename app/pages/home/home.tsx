import { useSearchParams } from "react-router-dom";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeDescriptionList } from "~/components/generic/DecDeDescriptionList";
import { RawLink } from "~/components/generic/RawLink";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { platforms } from "./platforms";
import { GoTo } from "~/components/generic/GoTo";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const isBaked = searchParams.has("baked");
  if (isBaked) return <p>beans</p>;

  return (
    <SiteWrapper>
      <DecDeBox>
        <h2>Cool Links:</h2>
        <DecDeDescriptionList
          entries={[
            {
              key: "github",
              label: <GoTo href="https://github.com/dectalk">Github</GoTo>,
              definition: "where our code lives",
            },
            {
              key: "webdemo",
              label: <GoTo href="https://bytesizedfox.dev/">Web Demo</GoTo>,
              definition: "a fully web based version of dectalk",
            },
            {
              key: "gameboy-demo",
              label: (
                <GoTo forceAnchor href="/gameboy">
                  Game Boy Advance
                </GoTo>
              ),
              definition:
                "a fully GBA based version of dectalk... running in a fully web based version of a GBA emulator",
            },
            {
              key: "discord",
              label: <GoTo href="https://discordapp.com/invite/wHgdmf4">Discord</GoTo>,
              definition: "where we hang out -- we apologise to those using screenreaders",
            },
            {
              key: "manual",
              label: <GoTo href="http://dectalk.de/manual/">Manual</GoTo>,
              definition: "DECtalk for Windows Manual",
            },
          ]}
        />
        <GoTo href="https://github.com/dectalk/DECtalkMini/releases/tag/latest">==&gt; Download Here &lt;==</GoTo>

        <h2>Fun DECtalk ports:</h2>
        <table className="decde-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Description</th>
              <th className="decde-desktop-only">Link</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map(x => (
              <tr key={x.id}>
                <td>{x.link ? <a href={x.link}>{x.id}</a> : x.id}</td>
                <td>{x.description}</td>
                <td className="decde-desktop-only">
                  {x.link ? <RawLink className="decde-font-small" target="_blank" href={x.link} /> : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { HomePage };
