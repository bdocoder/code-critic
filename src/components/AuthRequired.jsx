import { Typography } from "@mui/joy";

export default function AuthRequired() {
  return (
    <Typography m="auto" level="title-lg" color="danger">
      You should be authenticated to be able to view this page
    </Typography>
  );
}
