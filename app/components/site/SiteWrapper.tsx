import type { ReactNode } from "react";
import { DecDeWidthContainer } from "../containers/DecDeWidthContainer";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SitePhaseBanner } from "./SitePhaseBanner";

interface ISiteWrapper {
  children?: ReactNode;
  forceAnchor?: boolean;
}

const SiteWrapper = ({ children, forceAnchor }: ISiteWrapper) => (
  <div>
    <a className="decde-assistive-only" href="#main-content">
      Skip to main content
    </a>
    <header>
      <DecDeWidthContainer>
        <SiteHeader forceAnchor={forceAnchor} />
        <SitePhaseBanner />
      </DecDeWidthContainer>
    </header>
    <main id="main-content">
      <DecDeWidthContainer>{children}</DecDeWidthContainer>
    </main>
    <footer>
      <DecDeWidthContainer>
        <SiteFooter />
      </DecDeWidthContainer>
    </footer>
  </div>
);

export { SiteWrapper };
