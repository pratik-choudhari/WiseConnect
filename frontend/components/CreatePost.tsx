import {
  Button,
  Flex,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useUserId } from "../stores/useUserId";
import superagent from "superagent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backendAPI } from "../utils/constants";
import { useRouter } from "next/router";
import { useFormik } from "formik";

export function CreatePost({ type }: { type: "Input" | "Button" }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

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

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { text: string }) => {
      const { text } = data;
      const postData = {
        text,
        user_id: userId,
      };

      return superagent
        .post(`${backendAPI}/post/create`)
        .send(postData)
        .set("Accept", "application/json")
        .then((res) => res.body)
        .catch((error) => error.response.body);
    },
    onSuccess: (data) => {
      // success
      if (data.message === "OK") {
        console.log("POST IS CREATED");
        close();
      }
      // error
      if (data.message === "error") {
        formik.setErrors({ text: "Post could not be created" });
      }
    },
  });

  return (
    <>
      {type === "Input" ? (
        <TextInput
          placeholder="Share your moment..."
          onClick={() => {
            if (data) {
              open();
            } else {
              router.push("/login");
            }
          }}
          variant="filled"
        />
      ) : (
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            if (data) {
              open();
            } else {
              router.push("/login");
            }
          }}
        >
          Create Post
        </Button>
      )}
      <Modal opened={opened} onClose={close} title="Create Post" size={"lg"}>
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            resize="vertical"
            variant="filled"
            placeholder="Share your moment..."
            id="text"
            name="text"
            value={formik.values.text}
            onChange={formik.handleChange}
          />

          <Select
            mt={"md"}
            label="Privacy Setting"
            placeholder="Pick value"
            variant="filled"
            data={["Private", "Public", "Only for my followers"]}
          />

          <Flex mt={"md"} style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button type="submit">Post</Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}
