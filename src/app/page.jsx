import { getUserId } from "@/utils/server";
import { Heading, Text } from "@radix-ui/themes";

export default function Home() {
  const id = getUserId();

  return (
    <div className="m-auto text-center">
      <Heading size="7" mb="2">
        Hi there!
      </Heading>
      <Text as="p" size="4">
        {id
          ? "Use the sidebar to navigate the projects you are a member of"
          : "Use the navbar to authenticate or login with a demo account"}
      </Text>
    </div>
  );
}
