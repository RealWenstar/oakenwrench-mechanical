import type { ReactNode } from "react";

export function V2MobileShell({ children }: { children: ReactNode }) {
  return (
    <section
      className="v2-mobile-shell"
      data-experience="v2"
      data-layout="mobile-only"
      style={{
        width: "100%",
        maxWidth: "430px",
        aspectRatio: "9 / 16",
        marginInline: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </section>
  );
}
