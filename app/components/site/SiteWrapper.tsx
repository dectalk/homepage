import type { ReactNode } from "react";
import { DecDeWidthContainer } from "../containers/DecDeWidthContainer";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const SiteWrapper = ({ children }: { children: ReactNode }) => (
  <div>
    <header>
      <DecDeWidthContainer>
        <SiteHeader />
      </DecDeWidthContainer>
    </header>
    <main>
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
