import { DecDeBox } from "../containers/DecDeSection";
import { SiteLogo } from "./SiteLogo";
import { Link } from "react-router";

const SiteHeader = () => (
  <DecDeBox className="decde-site-header--box">
    <div className="decde-site-header--container">
      <div className="decde-site-header--left">
        <Link to="/">
          <h1 className="decde-site-header--title">DECtalk Community</h1>
        </Link>
        <span className="decde-site-header--tagline">Awesome since 1984</span>
      </div>
      <div className="decde-site-header--right">
        <SiteLogo />
      </div>
    </div>
  </DecDeBox>
);

export { SiteHeader };
