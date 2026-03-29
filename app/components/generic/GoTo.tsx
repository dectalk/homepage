import classNames from "classnames";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface IGoTo {
  children?: ReactNode;
  className?: string;
  href: string;
  newTab?: boolean;
  forceAnchor?: boolean;
  download?: boolean | string;
}

const GoTo = ({ children, className, href, newTab, forceAnchor, download }: IGoTo) => {
  if (href.startsWith("http://") || href.startsWith("https://") || forceAnchor || newTab || download) {
    return (
      <a
        href={href}
        className={classNames("decde-goto", className)}
        target={newTab ? "_blank" : "_self"}
        download={typeof download === "string" ? download : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={classNames("decde-goto", className)} to={href}>
      {children}
    </Link>
  );
};

export { GoTo };
