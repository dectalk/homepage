import { DISCORD_INVITE, GITHUB_ORGANISATION, MAILING_LIST } from "~/data/links";
import { GoTo } from "../generic/GoTo";
import { DecDeLinkList } from "../containers/DecDeLinkList";

const SiteFooter = () => (
  <footer>
    <p>
      DECtalk Community was brought to you by the{" "}
      <i>
        <b>dectalk.de</b>/velopers
      </i>{" "}
      team
    </p>
    <DecDeLinkList
      links={[
        <GoTo href={GITHUB_ORGANISATION}>GitHub</GoTo>,
        <GoTo href={DISCORD_INVITE}>Discord</GoTo>,
        <GoTo href={MAILING_LIST}>Mailing List</GoTo>,
      ]}
    />
  </footer>
);

export { SiteFooter };
