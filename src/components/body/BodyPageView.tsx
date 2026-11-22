"use client";
import { useSearchParams } from "next/navigation";
import { organs, type OrganId } from "@/content";
import { BodyMap } from "./BodyMap";

export function BodyPageView() {
  const params = useSearchParams();
  const o = params?.get("organ") as OrganId | null;
  const initial = o && organs.some((x) => x.id === o) ? o : undefined;
  return <BodyMap key={initial ?? "none"} initialOrgan={initial} />;
}
