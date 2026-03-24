import { RawLink } from "~/components/RawLink";
import { platforms } from "./platforms";
import './style.css'; // load website style

const HomePage = () => {
  return (
    <div>
      <main>
        <div class="box">
          <h1>DECtalk Community</h1>
          <h3>Awesome since 1984</h3>
          
          <br></br>
          <p>
            this website is under construction
            <br />
            check out our other fun pages while you wait
          </p>

        </div>
          <br></br>
          <div class="box">

            <h2>Cool Links:</h2>
            <dl>
              <dt>
                <a href="https://github.com/dectalk">Github -&gt;</a>
              </dt>
              <dd>where our code lives</dd>
              <dt>
                <a href="https://bytesizedfox.dev/">Web Demo -&gt;</a>
              </dt>
              <dd>a fully web based version of dectalk</dd>
              <dt>
                <a href="https://discordapp.com/invite/wHgdmf4">Discord -&gt;</a>
              </dt>
              <dd>
                where we hang out -- we apologise for those using screenreaders
              </dd>
            </dl>

            <h2>Fun DECtalk ports:</h2>
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
            <br></br>
            <p>Downloads coming Soon :3</p>
          </div>

          <br></br>
          <footer>
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
        </footer>

        </main>
    </div>
  );
};

export { HomePage };
