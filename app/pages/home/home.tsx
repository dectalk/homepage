import { RawLink } from "~/components/RawLink";
import { platforms } from "./platforms";

const HomePage = () => {
  return (
    <div>
      <main>
        <h1>DECtalk Community</h1>
        <p>
          this website is under construction
          <br />
          check out our other fun pages while you wait
        </p>
        <dl>
          <dt>
            <a href="https://github.com/dectalk">github</a>
          </dt>
          <dd>where our code lives</dd>
          <dt>
            <a href="https://bytesizedfox.dev/">web speak window (still working out some bugs - Byte)</a>
          </dt>
          <dd>a fully web based version of dectalk</dd>
          <dt>
            <a href="https://discordapp.com/invite/wHgdmf4">discord</a>
          </dt>
          <dd>
            where we hang out -- we apologise for those using screenreaders
          </dd>
        </dl>

        <h2>fun things dectalk has been ported to</h2>
        <table border={1}>
          <thead>
            <tr>
              <td>Platform</td>
              <td>Description</td>
              <td>Link</td>
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
      </main>
      <footer>
        <hr />
        <p>
          <i>
            <b>dectalk.de</b>/ctalk
          </i>{" "}
          was brought to you by the{" "}
          <i>
            <b>dectalk.de</b>/velopers
          </i>{" "}
          team
        </p>
        <p>ByteSizedFox was here (baked beans)</p>
      </footer>
    </div>
  );
};

export { HomePage };
