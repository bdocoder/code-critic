import { Badge, Heading, Text } from "@radix-ui/themes";

export default function IssueHeader({ issue, showDescription = false }) {
  return (
    <>
      <div className="flex items-center mt-4 mb-1 space-x-2">
        <Heading size="5">{issue.title}</Heading>
        <Badge
          color={issue.status === "open" ? "yellow" : "green"}
          className="capitalize"
        >
          {issue.status}
        </Badge>
      </div>
      {showDescription && issue.description && (
        <Text as="p">{issue.description}</Text>
      )}
    </>
  );
}
