import { MantineColorsTuple, createTheme } from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#ffede3",
  "#ffdbcc",
  "#ffb49b",
  "#fe8c66",
  "#fc6939",
  "#fc531b",
  "#fc470b",
  "#e13800",
  "#c92f00",
  "#b02400",
];

export const theme = createTheme({
  primaryColor: "myColor",
  colors: {
    myColor,
  },
});
