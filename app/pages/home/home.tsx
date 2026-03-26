import { useSearchParams } from "react-router-dom";
import { DecDeBox } from "~/components/containers/DecDeSection";
import { DecDeWidthContainer } from "~/components/containers/DecDeWidthContainer";
import { DecDeDescriptionList } from "~/components/generic/DecDeDescriptionList";
import { RawLink } from "~/components/generic/RawLink";
import { SiteFooter } from "~/components/SiteFooter";
import { SiteHeader } from "~/components/SiteHeader";
import { platforms } from "./platforms";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const isBaked = searchParams.has("baked");
  if (isBaked) return <p>beans</p>;

  return (
    <div>
      <main>
        <DecDeWidthContainer>
          <SiteHeader />
          <DecDeBox>
            <h2>Cool Links:</h2>
            <DecDeDescriptionList
              entries={[
                {
                  key: "github",
                  label: <a href="https://github.com/dectalk">Github</a>,
                  definition: "where our code lives",
                },
                {
                  key: "webdemo",
                  label: <a href="https://bytesizedfox.dev/">Web Demo</a>,
                  definition: "a fully web based version of dectalk",
                },
                {
                  key: "discord",
                  label: (
                    <a href="https://discordapp.com/invite/wHgdmf4">Discord</a>
                  ),
                  definition:
                    "where we hang out -- we apologise to those using screenreaders",
                },
                {
                  key: "manual",
                  label: <a href="http://dectalk.de/manual/">Manual</a>,
                  definition: "DECtalk for Windows Manual",
                },
              ]}
            />

            <h2>Fun DECtalk ports:</h2>
            <table className="decde-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Description</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((x) => (
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>{x.description}</td>
                    <td>
                      {x.link ? <RawLink target="_blank" href={x.link} /> : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a href="https://github.com/dectalk/DECtalkMini/releases/tag/latest">==&gt; Download Here &lt;==</a>
          </DecDeBox>
          <SiteFooter />
        </DecDeWidthContainer>
      </main>
    </div>
  );
};

export { HomePage };
