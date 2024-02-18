import React from "react";

export function RightColumn({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          position: "sticky",
          overflow: "hidden",
          height: "100%",
          width: "325px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
