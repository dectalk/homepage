import classNames from "classnames";
import type { ReactNode } from "react";

const DecDeInputFieldset = ({
  children,
  legend,
  className,
}: {
  children: ReactNode;
  legend?: ReactNode;
  className?: string;
}) => (
  <fieldset className={classNames("decde-input--fieldset", className)}>
    {legend && <legend>{legend}</legend>}
    {children}
  </fieldset>
);

const DecDeInputContainer = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={classNames("decde-input--container", className)}>{children}</div>
);

export { DecDeInputFieldset, DecDeInputContainer };
