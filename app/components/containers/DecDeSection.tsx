import classNames from "classnames";
import type { ReactNode } from "react";

const DecDeBox = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={classNames("decde-box", className)}>{children}</div>
);

export { DecDeBox };
