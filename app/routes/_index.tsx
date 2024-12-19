import type {Project, Ticket} from "@prisma/client";
import type {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {useMemo} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {SidebarTrigger} from "~/components/ui/sidebar";
import {getUser} from "~/lib/auth.server";
import prisma from "~/lib/prisma.server";

export const meta: MetaFunction = () => [
  {title: "Code Critic"},
  {
    name: "description",
    content:
      "A ticket tracking app meant for practicing web development using React and NodeJS",
  },
];

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  const profiles = await prisma.memberProfile.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: {
        include: {
          _count: {select: {members: true}},
          tickets: true,
        },
      },
      assignedTickets: {
        where: {
          status: "open",
        },
      },
    },
  });
  return {user, profiles};
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const projectMap = useMemo(
    () =>
      data.profiles.reduce(
        (acc, curr) => {
          acc[curr.projectId] = {...curr.project};
          return acc;
        },
        {} as Record<string, Project>,
      ),
    [data.profiles],
  );
  const assignedTickets = useMemo(
    () =>
      data.profiles.reduce(
        (acc, curr) => {
          return [
            ...acc,
            ...curr.assignedTickets.map((ticket) => ({
              ...ticket,
              project: projectMap[ticket.projectId],
            })),
          ];
        },
        [] as (Ticket & {project: Project})[],
      ),
    [data.profiles, projectMap],
  );

  return (
    <div className="my-auto">
      <div className="flex justify-center items-center gap-2 mb-12">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl">Hello, {data.user.name}</h1>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-secondary lg:order-2">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>A summary of your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {data.profiles.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {data.profiles.map(({project}) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>member count: {project._count.members}</p>
                      <p>
                        open tickets:{" "}
                        {
                          project.tickets.filter(
                            (ticket) => ticket.status === "open",
                          ).length
                        }
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        to={`/projects/${project.id}`}
                        className="underline"
                      >
                        Open project
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-lg m-auto whitespace-break-spaces">
                You can create a project using the + button in the sidebar
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-secondary xl:col-span-2">
          <CardHeader>
            <CardTitle>Assigned Tickets</CardTitle>
            <CardDescription>
              A list of all tickets assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignedTickets.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {assignedTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardHeader>
                      <CardTitle>{ticket.title}</CardTitle>
                      <CardDescription className="truncate">
                        {ticket.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        reported on{" "}
                        {Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(ticket.reportDate)}
                      </p>
                      <Link
                        to={`/projects/${ticket.projectId}`}
                        className="underline"
                      >
                        Open project
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-lg m-auto whitespace-break-spaces">
                You have no assigned tickets for now.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
