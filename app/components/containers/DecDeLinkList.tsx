import type { ReactNode } from "react";

const DecDeLinkList = ({ links }: { links: ReactNode[] }) => (
  <ul className="decde-link-list--container">
    {links.map((x, i) => (
      <li className="decde-link-list--item" key={i}>
        {x}
      </li>
    ))}
  </ul>
);

export { DecDeLinkList };
