import { Button, Flex, Input, PasswordInput, Stack, Text } from "@mantine/core";
import { useFormik } from "formik";
import { Login as LoginIllustration } from "../illustrations/Login";

export default function Login() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
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
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Flex>
  );
}
