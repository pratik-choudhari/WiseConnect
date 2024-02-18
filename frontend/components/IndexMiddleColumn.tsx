import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import superagent from "superagent";
import { useUserId } from "../stores/useUserId";
import { backendAPI } from "../utils/constants";
import { Flex, Tabs, rem, Text } from "@mantine/core";
import { IconSocial, IconUser, IconTrendingUp } from "@tabler/icons-react";
import { CreatePost } from "./CreatePost";
import { ForYouPosts } from "./ForYouPosts";
import { FollowingPosts } from "./FollowingPosts";

export function IndexMiddleColumn() {
  const queryClient = useQueryClient();
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

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Flex
      mt={"5.5px"}
      p={"1em"}
      direction={"column"}
      style={{ height: "100%" }}
    >
      <Text size="xl" fw={700}>
        Feed
      </Text>

      <div style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
        <CreatePost type="Input" />
      </div>

      <Tabs
        defaultValue={!data ? "trending" : "following"}
        onChange={() => {
          queryClient.invalidateQueries({ queryKey: ["PostsQuery"] });
        }}
      >
        <Tabs.List>
          {!data ? null : (
            <Tabs.Tab
              value="following"
              leftSection={<IconSocial style={iconStyle} />}
            >
              Following
            </Tabs.Tab>
          )}
          {!data ? null : (
            <Tabs.Tab
              value="for-you"
              leftSection={<IconUser style={iconStyle} />}
            >
              For you
            </Tabs.Tab>
          )}
          <Tabs.Tab
            value="trending"
            leftSection={<IconTrendingUp style={iconStyle} />}
          >
            Trending
          </Tabs.Tab>
        </Tabs.List>

        {!data ? null : (
          <Tabs.Panel value="following" p={"md"}>
            <FollowingPosts />
          </Tabs.Panel>
        )}

        {!data ? null : (
          <Tabs.Panel value="for-you" p={"md"}>
            <ForYouPosts />
          </Tabs.Panel>
        )}

        <Tabs.Panel value="trending" p={"md"}>
          <ForYouPosts />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
