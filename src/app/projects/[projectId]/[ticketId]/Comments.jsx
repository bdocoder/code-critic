import { addComment, deleteComment } from "@/actions/tickets";
import ActionButton from "@/components/ActionButton";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

/**
 *
 * @param {{comments: import("@prisma/client").Comment[], ticketId: string, userId: string, projectId: string}} props
 */
export default function CommentCard({
  comments,
  ticketId,
  userId,
  projectId,
  ...props
}) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm
          className="mb-6 space-y-4"
          action={addComment.bind(null, { ticketId, userId, projectId })}
        >
          <label htmlFor="comment" className="text-sm">
            Add a comment
          </label>
          <Textarea id="comment" name="comment" required />
          <SubmitButton>Add</SubmitButton>
        </ClientForm>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!comments.length && (
              <TableRow>
                <TableCell colSpan={4}>
                  <p className="text-center">No comments yet</p>
                </TableCell>
              </TableRow>
            )}
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className={userId === comment.userId && "font-bold"}>
                  {comment.user.name}
                </TableCell>
                <TableCell>
                  <pre className="break-all max-w-fit">{comment.content}</pre>
                </TableCell>
                <TableCell>
                  {Intl.DateTimeFormat("en", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(comment.createdAt)}
                </TableCell>
                <TableCell>
                  <ActionButton
                    variant="destructive"
                    action={deleteComment.bind(null, {
                      commentId: comment.id,
                      ticketId,
                      projectId,
                    })}
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
