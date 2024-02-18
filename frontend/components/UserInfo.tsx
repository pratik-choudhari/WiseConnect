import { Flex, Stack, Text } from "@mantine/core";

type UserInfoProps = {
  username: string;
  fullname: string;
};

export function UserInfo({ username, fullname }: UserInfoProps) {
  return (
    <Flex align={"center"} mb={"sm"}>
      <img
        width="70px"
        height="70px"
        src="https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE="
      />
      <Stack ml="sm">
        <Text size="lg" fw={700}>
          {fullname}
        </Text>

        <Text size="sm" style={{ marginTop: "-20px" }}>
          {username}
        </Text>
      </Stack>
    </Flex>
  );
}
