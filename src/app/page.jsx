import { Heading, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <div className="m-auto text-center">
      <Heading size="7" mb="2">
        Hi there!
      </Heading>
      <Text as="p" size="4">
        Use the sidebar to navigate the projects you are a member of
      </Text>
    </div>
  );
}
