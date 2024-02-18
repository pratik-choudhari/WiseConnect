import { Flex, Stack, Button, Text } from "@mantine/core";
import {
  IconHome,
  IconNotification,
  IconMessage,
  IconUser,
} from "@tabler/icons-react";
import { UserInfo } from "./UserInfo";
import { useQuery } from "@tanstack/react-query";
import superagent from "superagent";
import { backendAPI } from "../utils/constants";
import { useUserId } from "../stores/useUserId";
import { useRouter } from "next/router";

export function IndexLeftColumn() {
  const router = useRouter();
  const userId = useUserId((state) => state.userId);

  const { data } = useQuery({
    queryKey: ["UserQuery", { id: 1 }],
    enabled: userId ? true : false,
    queryFn: () =>
      superagent
        .get(`${backendAPI}/user/info?user_id=${userId}`)
        .set("Accept", "application/json")
        .set("ngrok-skip-browser-warning", "69420")
        .then((res) => res.body.user),
  });

  console.log("data: ", data);

  return (
    <Flex
      direction={"column"}
      justify={"space-between"}
      style={{ height: "100%" }}
    >
      <Stack>
        <Flex mt={"sm"}>
          <Text style={{ fontSize: "2vw" }} fw={700}>
            Wise
          </Text>
          <Text style={{ fontSize: "2vw" }} fw={700} c="myColor.4">
            Connect
          </Text>
        </Flex>

        <Stack mt={"lg"}>
          <Button
            variant="light"
            leftSection={<IconHome size={25} />}
            size="lg"
          >
            Home
          </Button>

          <Button
            variant="default"
            leftSection={<IconNotification size={25} />}
            style={{ border: "none" }}
            size="lg"
            onClick={() => {
              if (!data) {
                router.push("/login");
              }
            }}
          >
            Notifications
          </Button>

          <Button
            variant="default"
            leftSection={<IconMessage size={25} />}
            style={{ border: "none", float: "left" }}
            size="lg"
            onClick={() => {
              if (!data) {
                router.push("/login");
              }
            }}
          >
            Messages
          </Button>

          <Button
            variant="default"
            leftSection={<IconUser size={25} />}
            style={{ border: "none" }}
            size="lg"
            onClick={() => {
              if (!data) {
                router.push("/login");
              }
            }}
          >
            Profile
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (!data) {
                router.push("/login");
              }
            }}
          >
            Create Post
          </Button>
        </Stack>
      </Stack>

      {data ? (
        <div style={{ marginBottom: "2em" }}>
          <UserInfo username={data.username} fullname={data.full_name} />
        </div>
      ) : (
        <Button
          size="lg"
          variant="filled"
          style={{ marginBottom: "2em" }}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      )}
    </Flex>
  );
}
