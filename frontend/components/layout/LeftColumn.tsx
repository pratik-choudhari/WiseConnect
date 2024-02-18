import React from "react";

export function LeftColumn({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          height: "100%",
          width: "235px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
