import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const router = useRouter();
  useEffect(() => {
    console.log("localStorage: ", localStorage.getItem("userId"));
    if (!localStorage.getItem("userId")) {
      router.push("/login");
    }

    if (localStorage.getItem("userId")) {
      router.push("/");
    }
  }, [router]);
};
