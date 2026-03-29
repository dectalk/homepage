import { HOMEPAGE_GITHUB_ISSUES } from "~/data/links";
import { GoTo } from "../generic/GoTo";

const SitePhaseBanner = () => {
  return (
    <div className="decde-box decde-site-phase-banner">
      <span className="decde-site-phase-banner--badge">Alpha</span>
      <span>
        This is a new website. Help us improve it and{" "}
        <GoTo newTab href={HOMEPAGE_GITHUB_ISSUES}>
          give your feedback (opens in a new tab)
        </GoTo>
        .
      </span>
    </div>
  );
};

export { SitePhaseBanner };
