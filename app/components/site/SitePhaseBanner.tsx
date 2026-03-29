import { HOMEPAGE_GITHUB_ISSUES } from "~/data/links";

const SitePhaseBanner = () => {
  return (
    <div className="decde-box decde-site-phase-banner">
      <span className="decde-site-phase-banner--badge">Alpha</span>
      <span>
        This is a new website. Help us improve it and{" "}
        <a target="_blank" href={HOMEPAGE_GITHUB_ISSUES}>
          give your feedback (opens in a new tab)
        </a>
        .
      </span>
    </div>
  );
};

export { SitePhaseBanner };
