import { getUserId } from "@/utils/server";
import { Container, Typography } from "@mui/joy";

export default function Home() {
  const id = getUserId();

  return (
    <Container sx={{ margin: "auto", textAlign: "center" }}>
      <Typography level="h2" mb={1}>
        Hi there!
      </Typography>
      <Typography level="title-md">
        {id
          ? "Use the sidebar to navigate the projects you are a member of"
          : "Use the buttons above to authenticate or login with a demo account"}
      </Typography>
    </Container>
  );
}
