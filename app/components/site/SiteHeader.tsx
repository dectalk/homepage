import { DecDeBox } from "../containers/DecDeSection";
import { GoTo } from "../generic/GoTo";
import { SiteLogo } from "./SiteLogo";

interface ISiteHeader {
  forceAnchor?: boolean;
}

const SiteHeader = ({ forceAnchor }: ISiteHeader) => (
  <DecDeBox className="decde-site-header--box">
    <div className="decde-site-header--container">
      <div className="decde-site-header--left">
        <GoTo href="/" forceAnchor={forceAnchor}>
          <h1 className="decde-site-header--title">DECtalk Community</h1>
        </GoTo>
        <span className="decde-site-header--tagline">Awesome since 1984</span>
      </div>
      <div className="decde-site-header--right">
        <SiteLogo />
      </div>
    </div>
  </DecDeBox>
);

export { SiteHeader };
