import { useMemo } from "react";
import { navigate, useLocation } from "../router";

export function usePathname() {
  return useLocation().path;
}

export function useSearchParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
  return { push: (h: string) => navigate(h), replace: (h: string) => navigate(h, true), back: () => history.back(), refresh: () => {}, prefetch: () => {} };
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}
