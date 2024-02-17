import React from "react";

export function MainGridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingLeft: "4rem" /* 64px */,
        paddingRight: "4rem",
        display: "flex",
        alignItems: "center",
        border: "2px red solid",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "235px 640px 325px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
