import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { DISCORD_INVITE } from "~/data/links";

const PageNotFoundPage = () => {
  return (
    <SiteWrapper>
      <DecDeBox>
        <h1>Sorry, there is a problem with the service</h1>
        <p>Try again later.</p>
        <p>
          <a href={DISCORD_INVITE}>Contact the community maintainers</a> if you continue to face issues with the web
          site.
        </p>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { PageNotFoundPage };
