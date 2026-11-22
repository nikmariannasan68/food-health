import { forwardRef, type AnchorHTMLAttributes } from "react";
import { navigate } from "../router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; scroll?: boolean; replace?: boolean };

/** Замена next/link для превью: внутренние ссылки становятся hash-маршрутами. */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch: _p, scroll: _s, replace: _r, ...rest }, ref) {
  const internal = href.startsWith("/");
  const { onClick, ...other } = rest;
  return (
    <a
      ref={ref}
      href={internal ? "#" + href : href}
      {...other}
      onClick={(e) => {
        onClick?.(e);
        if (!internal || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
});

export default Link;
