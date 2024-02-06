import { Badge, Card, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";

/**
 *
 * @param {{issues: import("@prisma/client").Issue[], title: string}} props
 */
export default function IssueList({ issues, title }) {
  return (
    <div className="px-8 py-6">
      <Heading mb="6">{title}</Heading>
      {issues.length === 0 && <Text size="4">None so far.. </Text>}
      <div className="flex flex-col space-y-4 max-w-max">
        {issues.map(
          ({
            id,
            dateReported,
            description,
            status,
            projectId,
            title: issueTitle,
          }) => (
            <Link key={id} href={`/projects/${projectId}/${id}`} passHref>
              <Card>
                <div className="flex items-center space-x-3">
                  <Heading size="4">{issueTitle}</Heading>
                  <Badge
                    color={status === "open" ? "yellow" : "green"}
                    className="capitalize"
                  >
                    {status}
                  </Badge>
                  {status === "open" && (
                    <Text as="span" size="2">
                      since {dateReported.toDateString()}
                    </Text>
                  )}
                </div>
                <Text>{description}</Text>
              </Card>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
