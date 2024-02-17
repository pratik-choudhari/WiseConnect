import React from "react";

export function MainContentColumn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "640px", height: "100vh", border: "2px green solid" }}>
      {children}
    </div>
  );
}
