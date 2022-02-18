import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

// We want to respond with Prisma data retrieved from the database,
// but since StackBlitz cannot use Prisma, we will respond with dummy data.
const posts = [
  {
    id: 1,
    title: "This post come from trpc router!",
  },
  {
    id: 2,
    title: `Next, let's create a mutation!`,
  },
];

const appRouter = trpc
  .router()
  .query("posts", {
    // validate input with Zod
    input: z.object({ filter: z.string() }).nullish(),
    async resolve({ input }) {
      // if specify input.filter then we will find post matched by input.filter
      // else return all posts
      if (input?.filter == null || input.filter == "") {
        return posts;
      }
      return posts.filter((post) => post.title.includes(input.filter));
    },
  })
  .mutation("createPost", {
    // validate input with Zod
    input: z.object({
      title: z.string().min(5),
    }),
    async resolve({ input }) {
      // We want to create data into Database with Prisma,
      // but now we will respond dummy data.
      return { id: 9999, title: input.title };
    },
  });

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});