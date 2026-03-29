import { DecDeBox } from "~/components/containers/DecDeSection";
import { SiteWrapper } from "~/components/site/SiteWrapper";
import { DISCORD_INVITE } from "~/data/links";

interface ICriticalErrorPage {
  message: string;
  stack?: string;
}

const CriticalErrorPage = ({ message, stack }: ICriticalErrorPage) => {
  return (
    <SiteWrapper>
      <DecDeBox>
        <h1>Sorry, there is a problem with the service</h1>
        <p>Try again later.</p>
        <p>
          <a href={DISCORD_INVITE}>Contact the community maintainers</a> if you continue to face issues with the web
          site.
        </p>
        <details>
          <summary>Detailed error summary</summary>
	  <p>{message}</p>
          <pre>{stack}</pre>
        </details>
      </DecDeBox>
    </SiteWrapper>
  );
};

export { CriticalErrorPage };
