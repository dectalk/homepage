import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { DISCORD_INVITE } from "~/data/links";

const PageNotFoundPage = () => {
  return (
    <SiteWrapper>
      <DecDeBox>
        <h1>Page not found</h1>
        <p>If you typed the web address, check it is correct.</p>
        <p>If you pasted the web address, check you copied the entire address.</p>
        <p>
          If the web address is correct or you selected a link or button,{" "}
          <a href={DISCORD_INVITE}>Contact the community maintainers</a> if you continue to face issues with the web
          site.
        </p>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { PageNotFoundPage };
