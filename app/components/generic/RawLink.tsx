import type { HTMLProps } from "react";

const RawLink = (props: HTMLProps<HTMLAnchorElement>) => <a {...props}>{props.href}</a>;

export { RawLink };
