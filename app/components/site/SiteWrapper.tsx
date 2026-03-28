import type { ReactNode } from "react";
import { DecDeWidthContainer } from "../containers/DecDeWidthContainer";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const SiteWrapper = ({ children }: { children: ReactNode }) => (
  <div>
    <a className="decde-assistive-only" href="#main-content">
      Skip to main content
    </a>
    <header>
      <DecDeWidthContainer>
        <SiteHeader />
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
