import {
  Anchor,
  Button,
  Flex,
  Input,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useFormik } from "formik";
import { Login as LoginIllustration } from "../illustrations/Login";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import superagent from "superagent";
import { backendAPI } from "../utils/constants";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function Login() {
  // useIsAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      const { email, password } = data;

      return superagent
        .post(`${backendAPI}/user/login`)
        .send({
          email,
          password,
        })
        .set("Accept", "application/json")
        .then((res) => res.body)
        .catch((error) => error.response.body);
    },
    onSuccess: (data) => {
      // success
      if (data.message === "OK") {
        localStorage.setItem("userId", data.user_id);
        // cache it
        queryClient.setQueryData(["UserQuery", { id: 1 }], data.user);
        router.push("/");
      }
      // error
      if (data.message === "error") {
        formik.setErrors({
          email: "Invalid email",
          password: "Invalid password",
        });
      }
    },
  });

  return (
    <Flex style={{ height: "100vh" }} align={"center"} justify={"center"}>
      <Flex align={"center"}>
        <LoginIllustration
          height={"320"}
          width={"320"}
          style={{ marginRight: "8em" }}
        />
        <Stack>
          <Flex justify={"center"}>
            <Text style={{ fontSize: "2.5vw" }} fw={700}>
              Wise
            </Text>
            <Text style={{ fontSize: "2.5vw" }} fw={700} c="myColor.4">
              Connect
            </Text>
          </Flex>
          <Text fw={500} ta="center">
            Login into your account!
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Input.Wrapper label="Email">
                <Input
                  placeholder="johndoe99@gmail.com"
                  w={350}
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Input.Wrapper>

              <PasswordInput
                label="Password"
                placeholder="********"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                    ? formik.errors.password
                    : null
                }
              />

              <Button type="submit">Login</Button>

              <Flex justify={"center"}>
                New here?
                <NextLink href="/register" style={{ marginLeft: "0.5em" }}>
                  Register now!
                </NextLink>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Flex>
  );
}
