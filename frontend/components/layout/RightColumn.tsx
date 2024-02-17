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
          border: "2px blue solid",
        }}
      >
        {children}
      </div>
    </div>
  );
}
