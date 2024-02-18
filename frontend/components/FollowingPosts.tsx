import { useQuery, useQueryClient } from "@tanstack/react-query";
import superagent from "superagent";
import { backendAPI } from "../utils/constants";
import { PostCard } from "./PostCard";
import { useUserId } from "../stores/useUserId";
import { useState } from "react";
import { Button, Flex } from "@mantine/core";

export function FollowingPosts() {
  const userId = useUserId((state) => state.userId);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();
  const { data, isRefetching, refetch } = useQuery({
    queryKey: ["PostsQuery", { id: 2 }],
    enabled: userId && hasMore ? true : false,
    queryFn: () =>
      superagent
        .get(`${backendAPI}/post/feed?user_id=${userId}&offset=${offset}&tab=2`)
        .set("Accept", "application/json")
        .set("ngrok-skip-browser-warning", "69420")
        .then((res) => res.body.posts),
  });

  console.log(
    "URL",
    `${backendAPI}/post/feed?user_id=${userId}&offset=${offset}&tab=2`
  );
  console.log("followingPosts: ", data);

  return (
    <>
      {data ? (
        <>
          {data.map((post: any, index: any) => {
            console.log(post);
            return (
              <PostCard
                key={index}
                postId={post.post_id}
                fullname={post.full_name}
                username={post.username}
                text={post.text}
                fraud={post.fraud_detected}
                fraudType={post.fraud_type}
              />
            );
          })}
          {hasMore ? (
            <Flex justify={"center"}>
              <Button
                mt={"md"}
                mb={"md"}
                loading={isRefetching}
                loaderProps={{ type: "oval" }}
                onClick={() => {
                  setOffset((prev) => prev + 10);
                  refetch().then((res) => {
                    const oldData = queryClient.getQueryData([
                      "PostsQuery",
                      { id: 2 },
                    ]);
                    console.log("oldData", oldData);

                    queryClient.setQueryData(
                      ["PostsQuery", { id: 2 }],
                      [...(oldData as []), ...res.data]
                    );

                    if (res.data.length < 10) {
                      setHasMore(false);
                    }
                  });
                }}
              >
                Load More
              </Button>
            </Flex>
          ) : null}
        </>
      ) : null}
    </>
  );
}
