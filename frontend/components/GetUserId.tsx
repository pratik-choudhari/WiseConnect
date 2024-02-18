import { useEffect, useState } from "react";
import { useUserId } from "../stores/useUserId";

export function GetUserId({ children }: { children: React.ReactNode }) {
  let body = null;
  const userId = useUserId((state) => state.userId);
  const setUserId = useUserId((state) => state.setUserId);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    console.log("userId setting is happening");
    let userIdStorage = localStorage.getItem("userId");
    setUserId(userIdStorage ? parseInt(userIdStorage) : null);
    setChecked(true);
  }, []);

  if (userId) {
    body = children;
  } else if (!userId && checked) {
    body = children;
  }

  return <>{body}</>;
}
