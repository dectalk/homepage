import { DecDeBox } from "./containers/DecDeSection";

const SiteHeader = () => (
  <DecDeBox>
    <h1 className="decde-site-header--title">DECtalk Community</h1>
    <span className="decde-site-header--tagline">Awesome since 1984</span>
    <p className="decde-site-header--disclaimer">
      this website is under construction
      <br />
      check out our other fun pages while you wait
    </p>
  </DecDeBox>
);

export { SiteHeader };
