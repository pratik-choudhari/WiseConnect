import {
  Button,
  CheckIcon,
  ColorSwatch,
  Flex,
  Group,
  Slider,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { useUserId } from "../stores/useUserId";
import { useRouter } from "next/router";

type TrendType = {
  fullname: string;
  username: string;
  img: string;
};

function UserCard({ fullname, username, img }: TrendType) {
  return (
    <Flex align={"center"}>
      <img width="50px" height="50px" src={img} />
      <Stack ml="sm">
        <Text size="md" fw={400}>
          {fullname}
        </Text>

        <Text size="sm" style={{ marginTop: "-20px" }} c="dimmed">
          {username}
        </Text>
      </Stack>
    </Flex>
  );
}

const trendingUsers: TrendType[] = [
  {
    fullname: "Elon Musk",
    username: "musk09",
    img: "https://i.ebayimg.com/images/g/MkoAAOSwI-RiQ8P-/s-l1200.webp",
  },
  {
    fullname: "Lionel Messi",
    username: "messiGoat",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSooCAMEvQS5rJ49FQ3EaSEy7SjPimbcB_rIEUO0gtySg&s",
  },
  {
    fullname: "Cristiano Ronaldo",
    username: "cr7",
    img: "https://ekcfbmsotzc.exactdn.com/en/blog/wp-content/uploads/2021/08/Soccer-Cristiano-Ronaldo.png?strip=all&lossy=1&ssl=1",
  },
];

export function IndexRightColumn() {
  const router = useRouter();
  const [checked, setChecked] = useState(true);
  const [color, setColor] = useState<"orange" | "green" | "pink" | "blue">(
    "orange"
  );
  const setUserId = useUserId((state) => state.setUserId);

  return (
    <Flex
      mt={"5.5px"}
      p={"1em"}
      direction={"column"}
      style={{ height: "100%" }}
    >
      <Flex direction={"column"}>
        <Stack>
          <Text size="xl" fw={700} mt={"45px"}>
            Change font size
          </Text>
          <Slider
            color="blue"
            marks={[
              { value: 20, label: "small" },
              { value: 50, label: "medium" },
              { value: 80, label: "large" },
            ]}
          />
        </Stack>

        <Stack>
          <Text size="xl" fw={700} mt={"45px"}>
            Change theme color
          </Text>
          <Group>
            <ColorSwatch
              component="button"
              color="#FC6939"
              onClick={() => {
                setChecked((c) => !c);
                setColor("orange");
              }}
              style={{ color: "#fff", cursor: "pointer" }}
            >
              {checked && color === "orange" ? (
                <CheckIcon style={{ width: rem(12), height: rem(12) }} />
              ) : null}
            </ColorSwatch>
            <ColorSwatch
              component="button"
              color="#009790"
              onClick={() => {
                setChecked((c) => !c);
                setColor("green");
              }}
              style={{ color: "#fff", cursor: "pointer" }}
            >
              {checked && color === "green" ? (
                <CheckIcon style={{ width: rem(12), height: rem(12) }} />
              ) : null}
            </ColorSwatch>
            <ColorSwatch
              component="button"
              color="#FF69B4"
              onClick={() => {
                setChecked((c) => !c);
                setColor("pink");
              }}
              style={{ color: "#fff", cursor: "pointer" }}
            >
              {checked && color === "pink" ? (
                <CheckIcon style={{ width: rem(12), height: rem(12) }} />
              ) : null}
            </ColorSwatch>
            <ColorSwatch
              component="button"
              color="#03396C"
              onClick={() => {
                setChecked((c) => !c);
                setColor("blue");
              }}
              style={{ color: "#fff", cursor: "pointer" }}
            >
              {checked && color === "blue" ? (
                <CheckIcon style={{ width: rem(12), height: rem(12) }} />
              ) : null}
            </ColorSwatch>
          </Group>
        </Stack>

        <Text size="xl" fw={700} mt={"45px"}>
          Trending Users 🚀
        </Text>

        <Stack mt={"md"}>
          {trendingUsers.map((user, index) => (
            <UserCard
              fullname={user.fullname}
              username={user.username}
              img={user.img}
              key={index}
            />
          ))}
        </Stack>

        <Button
          mt="xl"
          variant="light"
          onClick={() => {
            localStorage.removeItem("userId");
            setUserId(null);
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
}
