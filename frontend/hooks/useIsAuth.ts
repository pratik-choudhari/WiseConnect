import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const router = useRouter();
  let userId: string | null;
  if (typeof window !== "undefined") {
    console.log("this runs");
    // Perform localStorage action
    userId = localStorage.getItem("key");
  }
  useEffect(() => {
    console.log("localStorage: ", userId);
    if (!userId) {
      router.push("/login");
    }

    if (userId) {
      router.push("/");
    }
  }, [router, userId!]);
};
