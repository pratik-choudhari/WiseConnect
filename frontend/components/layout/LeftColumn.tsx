import React from "react";

export function LeftColumn({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          height: "100%",
          width: "235px",
          border: "2px yellow solid",
        }}
      >
        {children}
      </div>
    </div>
  );
}
