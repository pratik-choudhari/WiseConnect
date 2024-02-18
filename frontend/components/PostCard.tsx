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

type PostCardProps = {
  text: string;
  username: string;
  fullname: string;
  fraud: boolean;
  fraudType: 1 | 2 | null;
};

export function PostCard({
  text,
  username,
  fullname,
  fraud,
  fraudType,
}: PostCardProps) {
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
              src="https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE="
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
          style={{ color: "#C0B820", display: "flex", alignItems: "center" }}
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
    </Card>
  );
}
