import { ActionIcon, Button, Flex, Stack, Text } from "@mantine/core";
import { LeftColumn } from "../components/layout/LeftColumn";
import { MainContentColumn } from "../components/layout/MainContentColumn";
import { MainGridLayout } from "../components/layout/MainGridLayout";
import { RightColumn } from "../components/layout/RightColumn";
import {
  IconHome,
  IconMessage,
  IconNotification,
  IconUser,
} from "@tabler/icons-react";
import { UserInfo } from "../components/UserInfo";

export default function IndexPage() {
  return (
    <MainGridLayout>
      <LeftColumn>
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
              >
                Notifications
              </Button>

              <Button
                variant="default"
                leftSection={<IconMessage size={25} />}
                style={{ border: "none", float: "left" }}
                size="lg"
              >
                Messages
              </Button>

              <Button
                variant="default"
                leftSection={<IconUser size={25} />}
                style={{ border: "none" }}
                size="lg"
              >
                Profile
              </Button>

              <Button size="lg" variant="outline">
                Create Post
              </Button>
            </Stack>
          </Stack>

          <UserInfo username="bob99" fullname="Bob Smith" />
        </Flex>
      </LeftColumn>

      <MainContentColumn>Middle</MainContentColumn>

      <RightColumn>Right</RightColumn>
    </MainGridLayout>
  );
}
