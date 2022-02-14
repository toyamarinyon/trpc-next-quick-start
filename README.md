# tRPC Next.js Quick Starter

## 1. Defining a router

Let's walk through the steps of building a typesafe API with tRPC. To start, this API will only contain two endpoints:

```ts
getPosts(id?: string) => { id: string; title: string; }
createPost(data: {title:string}) => { id: string; title: string; }
```

### 1-1. Create a tRPC router

First we implement our tRPC router in `./pages/api/trpc/[trpc].ts`

```ts
// pages/api/trpc/[trpc].ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
const appRouter = trpc.router();

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
```

### 1-2. Add a query endpoint

Use the `.query()` method to add a query endpoint to the router. Arguments:

`.query(name: string, params: QueryParams)`

- `name: string`: The name of this endpoint
- `params.input`: Optional. This should be a function that validates/casts the _input_ of this endpoint and either returns a strongly typed value (if valid) or throws an error (if invalid). Alternatively you can pass a [Zod](https://github.com/colinhacks/zod), [Superstruct](https://github.com/ianstormtaylor/superstruct) or [Yup](https://github.com/jquense/yup) schema. Here we wil use `Zod`.
- `params.resolve`: This is the actual implementation of the endpoint. It's a function with a single `req` argument. The validated input is passed into `req.input` and the context is in `req.ctx` (more about context later!)

```ts
// pages/api/trpc/[trpc].ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

// We want to respond with Prisma data retrieved from the database,
// but since StackBlitz cannot use Prisma, we will respond with dummy data.
const posts = [
  {
    id: 1,
    title: "hello!",
  },
  {
    id: 2,
    title: "trpc!",
  },
];

const appRouter = trpc.router().query("posts", {
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
```

### 1-3. Add a mutation endpoint

Similarly to GraphQL, tRPC makes a distinction between query and mutation endpoints. Let's add a `createPost` mutation:

```ts
createPost(payload: {title: string}) => {id: string; title: string};
```

```ts
// pages/api/trpc/[trpc].ts
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
```

## 2. Create tRPC hooks

Create a set of strongly-typed hooks using your API's type signature.

```typescript
// utils/trpc.ts
import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../pages/api/trpc/[trpc]";

export const trpc = createReactQueryHooks<AppRouter>();
```

## 3. Configure \_app.tsx

The createReactQueryHooks function expects certain parameters to be passed via the Context API. To set these parameters, create a custom \_app.tsx using the withTRPC higher-order component:

```tsx
import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "./api/trpc/[trpc]";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
```

## 4. Use query

We're ready! Let's connect the server created now. Open `src/index.tsx` then, add import `trpc hook`. At the top of this file, there is already a commented out import statement, so uncomment it.

```typescript
// pages/index.tsx
import { trpc } from "../utils/trpc";
```

And, use tRPC query hook before return statement. Again, we have already commented out and embedded that code, but here we strongly recommend typing it instead of uncommenting it.

```tsx
// You should type bellow code in step 4 on walk through.
// We're highly recommended typing below code instead of copying it.
// const query = trpc.useQuery(["posts"]);
const query = trpc.useQuery(["posts"]); // 👈 Let's type it!
```

When you type `const query = trpc.useQuery(['`, I think you see `posts.all` as a candidate, is it working?
This is possible because tRPC use router type information that we just created as the scheme for client. We're not generate file that provide scheme such as GraphQL and OpenAPI !

Next, use query result instead of dummy data.

```diff
- {dummyData.map((data, i) =>(
+ {query.data?.map((data, i) => ( // 👈 Let's type it!
  <article key={`article-${i}`} className={styles.card}>
    <p>{data.title}</p>
  </article>
))}
```

Save the all file, you should see like this.

Congratulation 🎉 Next, we will create a filter with query hook.

## 6. Use query variable

Actually, there is a post filtering function by input.filter parameter on the server.

```typescript
// pages/api/trpc/[trpc].ts
query("posts", {
  // 👇 input schema
  input: z.object({ filter: z.string() }).nullish(),
  async resolve({ input }) {
    if (input?.filter == null || input.filter == "") {
      return posts;
    }
    // 👇 Filter posts that includes input.filter in the title
    return posts.filter((post) => post.title.includes(input.filter));
  },
});
```

To use this function in hook, specify it as the first argument tuple.

```typescript
const query = trpc.useQuery(["posts", { filter: "filtering text" }]);
//                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

There is a text field for filter, so let's set it as a query parameter.

```typescript
const query = trpc.useQuery(["posts", { filter }]);
```

It will now execute the query every time you type in the text field.

## 7. Use mutation

Remember, we created createPost mutation at Step 1-3.

```typescript
createPost(payload: {title: string}) => {id: string; title: string};
```

In client, we can mutate to use `useMutation` hook like that.

```typescript
const createPost = trpc.useMutation(["createPost"]);
```

Let's open `pages/index.tsx` and type this mutation. We have already commented out and embedded that code, but here we strongly recommend typing it instead of uncommenting it.

```ts
// pages/index.tsx

// And, you should type following code in step 7.
// const createPost = trpc.useMutation(['createPost']);  👈 Let's type this!
```
Next, let's run this hook when the user submits the form.
Since text field value in post form is managed by `title` state, we will set to mutate param it.
```ts
// Text field value in post form is already managed by `title` state
const [title, setTitle] = useState("");
```

And our code has a submit handler like this, so we will mutate there.
```ts
async function submitNewPost(e: FormEvent) {
  e.preventDefault();
  alert(`Let's implement create post mutation`);
  // We will use following code in step 7.
  // setError("");
  // try {
  //   await createPost.mutateAsync({ title });
  // } catch (error) {
  //   if (error instanceof TRPCClientError) {
  //     setError(error.message);
  //   }
  // }
}
```
Like this, remove alert function, and uncomment following code.
```ts
async function submitNewPost(e: FormEvent) {
  e.preventDefault();
  // We will use following code in step 7.
  setError("");
  try {
    await createPost.mutateAsync({ title });
  } catch (error) {
    if (error instanceof TRPCClientError) {
      setError(error.message);
    }
  }
}
```
Now that we have created the Create post mutation, we can click the ✏️ button, fill in the form, and click the Create button to send the data to the server.

If text that filled in is less than 5 characters long, an error message will be displayed above the form. It's provided by tRPC input validation with Zod. 

It's 
私たちは、スキーマを書いただけで、入力値の検証をするためのコードを書いていませんが、tRPCとZodがこれ実現しています。このことはまた詳しく紹介できればと思いますが、

That's it for today! 


これでmutateが実装できました！✏️ボタンを押してフォームに入力しCreateボタンを押すとサーバにデータが送信されます。入力した文字数が