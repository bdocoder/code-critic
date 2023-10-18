import { Text } from "@radix-ui/themes";

export default function AuthRequired() {
  return (
    <Text size="4" color="red" m="auto">
      You should be authenticated to be able to view this page
    </Text>
  );
}
