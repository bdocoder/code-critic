"use client";

const { extendTheme } = require("@mui/joy");

const theme = extendTheme({
  components: {
    JoyCard: {
      defaultProps: {
        variant: "plain",
      },
    },
  },
});

export default theme;
