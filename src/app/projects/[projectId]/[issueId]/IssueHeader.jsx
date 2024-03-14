import { Badge } from "@/components/ui/badge";

export default function IssueHeader({ issue, showDescription = false }) {
  return (
    <>
      <div className="flex items-center mt-4 mb-1 space-x-2">
        <h2 className="text-xl">{issue.title}</h2>
        <Badge
          variant={issue.status === "open" ? "destructive" : "outline"}
          className="capitalize"
        >
          {issue.status}
        </Badge>
      </div>
      {showDescription && issue.description && <p>{issue.description}</p>}
    </>
  );
}
