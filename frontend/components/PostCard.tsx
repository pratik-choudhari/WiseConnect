import {
  ActionIcon,
  Card,
  Group,
  Menu,
  rem,
  Text,
  Flex,
  Stack,
  Button,
  Alert,
  Modal,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDots,
  IconTrash,
  IconReport,
  IconHeart,
  IconMessageCircle2,
  IconAlertCircleFilled,
} from "@tabler/icons-react";
import Linkify from "linkify-react";
import { useEffect } from "react";
import { useState } from "react";
import { useOutOfFocus } from "../stores/useOutOfFocus";
import { useMutation } from "@tanstack/react-query";
import router from "next/router";
import superagent from "superagent";
import { backendAPI } from "../utils/constants";
import { useUserId } from "../stores/useUserId";
import { useFormik } from "formik";

type PostCardProps = {
  postId: number;
  text: string;
  username: string;
  fullname: string;
  fraud: boolean;
  fraudType: 1 | 2 | null;
};

const images = [
  "https://vectorified.com/images/gender-neutral-icon-18.png",
  "https://vectorified.com/images/gender-neutral-user-icon-17.jpg",
  "https://www.pngkey.com/png/detail/523-5230875_this-icon-for-gender-neutral-user-is-an.png",
  "https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=",
];

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  const rn = Math.floor(Math.random() * (max - min + 1) + min);
  console.log("random", rn);
  return rn;
}

export function PostCard({
  postId,
  text,
  username,
  fullname,
  fraud,
  fraudType,
}: PostCardProps) {
  console.log(postId);
  const userId = useUserId((state) => state.userId);
  const outOfFocus = useOutOfFocus((state) => state.outOfFocus);
  const setOutOfFocus = useOutOfFocus((state) => state.setOutOfFocus);
  const [opened, { open, close }] = useDisclosure(false);

  const linkProps = {
    target: "_blank",
    onClick: (event: any) => {
      if (!fraud || (fraud && fraudType != 2)) {
        return;
      }

      if (
        !confirm("Could be a scam. Are you sure you want to leave this page?")
      ) {
        setOutOfFocus(true);
        event.preventDefault();
      }
    },
  };

  const reportPostMutation = useMutation({
    mutationFn: (data: {
      postId: number;
      userId: number;
      details: string | null;
    }) => {
      const { userId, postId, details } = data;

      return superagent
        .post(`${backendAPI}/post/report`)
        .send({
          user_id: userId,
          post_id: postId,
          details,
          flag_type: null,
        })
        .set("Accept", "application/json")
        .then((res) => res.body)
        .catch((error) => error.response.body);
    },
    onSuccess: (data) => {
      // success
      if (data.message === "OK") {
        console.log("report works");
      }
      // error
      if (data.message === "error") {
        console.log("report fail");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      details: "",
    },
    onSubmit: (values) => {
      const newUserId = userId as number;
      reportPostMutation.mutate({
        postId,
        userId: newUserId,
        details: values.details.length === 0 ? null : values.details,
      });
    },
  });

  //   // User has switched back to the tab
  //   const onFocus = () => {
  //     if (outOfFocus) {
  //       console.log("ascascascascascasc");
  //       open();
  //       setOutOfFocus(false);
  //     }
  //   };

  //   useEffect(() => {
  //     window.addEventListener("focus", onFocus);
  //     // Calls onFocus when the window first loads
  //     onFocus();
  //     // Specify how to clean up after this effect:
  //     return () => {
  //       window.removeEventListener("focus", onFocus);
  //     };
  //   }, []);

  return (
    <Card withBorder shadow="sm" radius="md" mt={"1em"}>
      <Card.Section inheritPadding py="xs">
        <Group justify="space-between">
          <Flex align={"center"}>
            <img
              width="50px"
              height="50px"
              src={images[randomIntFromInterval(0, 3)]}
            />
            <Stack ml="sm">
              <Text size="md" fw={400}>
                {fullname}
              </Text>

              <Text size="sm" style={{ marginTop: "-20px" }} c="dimmed">
                {username}
              </Text>
            </Stack>
          </Flex>

          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconReport style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => {
                  if (userId) {
                    open();
                  }
                }}
              >
                Report
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                color="red"
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      {fraud && fraudType === 1 ? (
        <div
          style={{
            color: "#FFC907",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <IconAlertCircleFilled size={25} />
          <Text ml={"xs"} size="sm">
            A link in this post was reported to be scam. This could be a scam
            post
          </Text>
        </div>
      ) : null}

      {fraud && fraudType === 2 ? (
        <Alert
          variant="light"
          color="red"
          title="Caution - High possibility of a scam"
          icon={<IconAlertCircleFilled />}
          mb={"md"}
          mt={"md"}
        >
          Our AI systems have flagged this post as scam and dangerous. Please
          proceed to interact with caution.
        </Alert>
      ) : null}

      <Text size="sm" fw={"normal"} mb={"md"}>
        <Linkify options={{ attributes: linkProps }}>{text}</Linkify>
      </Text>

      <Card.Section inheritPadding withBorder py="xs">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconHeart size={14} />}
            size="xs"
          >
            Like
          </Button>
          <Button
            variant="subtle"
            leftSection={<IconMessageCircle2 size={14} />}
            size="xs"
          >
            Comment
          </Button>
        </Group>
      </Card.Section>

      <Modal opened={opened} onClose={close} title="Report Post">
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            label="Please provide details (optional)"
            placeholder="more details..."
            variant="filled"
            name="details"
            id="details"
            value={formik.values.details}
            onChange={formik.handleChange}
          />
          <Button type="submit" mt="md">
            Report
          </Button>
        </form>
      </Modal>
    </Card>
  );
}
