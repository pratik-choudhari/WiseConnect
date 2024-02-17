import { Button, Flex, Input, PasswordInput, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Register as RegisterIllustration } from "../illustrations/Register";
import { useFormik } from "formik";
import { useState } from "react";

export default function Register() {
  const [birthday, setBirthday] = useState<Date | null>(new Date());

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values, { setErrors }) => {
      const { password, confirmPassword } = values;
      //   const { birthday } = values;
      const yyyy = birthday!.getFullYear() + "";
      let mm = birthday!.getMonth() + 1 + "";
      let dd = birthday!.getDate() + "";

      if (Number(dd) < 10) dd = "0" + dd;
      if (Number(mm) < 10) mm = "0" + mm;

      const formattedBirthday = dd + "/" + mm + "/" + yyyy;

      if (confirmPassword !== password) {
        setErrors({
          password: "Passwords don't match",
          confirmPassword: "Passwords don't match",
        });
        return;
      }

      console.log(formattedBirthday);
      console.log(values);
    },
  });

  return (
    <Flex style={{ height: "100vh" }} align={"center"} justify={"center"}>
      <Flex align={"center"}>
        <RegisterIllustration
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
            Create a new account!
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Input.Wrapper label="Full Name">
                <Input
                  placeholder="John Doe"
                  w={350}
                  id="fullname"
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  required
                />
              </Input.Wrapper>

              <Input.Wrapper label="Username">
                <Input
                  placeholder="johndoe99"
                  w={350}
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </Input.Wrapper>

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

              <DateInput
                name="birthday"
                value={birthday}
                onChange={setBirthday}
                label="Birthday"
                placeholder="17 Feb, 2024"
              />

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

              <PasswordInput
                label="Confirm Password"
                placeholder="********"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                    ? formik.errors.confirmPassword
                    : null
                }
              />
              <Button type="submit">Register</Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Flex>
  );
}
