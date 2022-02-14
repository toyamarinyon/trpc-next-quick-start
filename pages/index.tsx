import { trpc } from "../utils/trpc";
import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import { TRPCClientError } from "@trpc/client";

const dummyData = [
  {
    id: 1,
    title: "This post is dummy content",
  },
  {
    id: 2,
    title: "Let's create tRPC server and use it!",
  },
];
const Home: NextPage = () => {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("aaaa");

  // You should type following code in step 4 on walk through.
  // We're highly recommended typing following code instead of copying it.
  // const query = trpc.useQuery(["posts"]);
  const query = trpc.useQuery(["posts"]);

  // And, you should type following code in step 7.
  // const createPost = trpc.useMutation(['createPost']);
  const createPost = trpc.useMutation(["createPost"]);

  async function submitNewPost(e: FormEvent) {
    e.preventDefault();
    alert(`Let's implement create post mutation`);
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
  return (
    <section className={styles.container}>
      <main className={styles.main}>
        <header className={styles.title}>
          <h1>tRPC with Next.js Quick Demo 🚀</h1>
        </header>
        <section className={styles.controller}>
          <form className={styles.filter}>
            <input
              type="text"
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
          <details>
            <summary>
              ✏️
              <div className={styles.modalOverlay}></div>
            </summary>
            <section className={styles.modal}>
              <div className={styles.modalContent}>
                <h3>New Post</h3>
                {error && <p className={styles.error}>👀&nbsp;{error}</p>}
                <form onSubmit={(e) => submitNewPost(e)}>
                  <textarea
                    id="postTitle"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <button type="submit">Create</button>
                </form>
              </div>
            </section>
          </details>
        </section>

        <section className={styles.grid}>
          {query.data?.map((data, i) => (
            <article key={`article-${i}`} className={styles.card}>
              <p>{data.title}</p>
            </article>
          ))}
        </section>
      </main>
    </section>
  );
};

export default Home;
