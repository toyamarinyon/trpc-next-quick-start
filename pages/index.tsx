import { TRPCClientError } from "@trpc/client";
import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const query = trpc.useQuery(["posts", { filter }]);
  const createPost = trpc.useMutation(["createPost"]);

  async function submitNewPost(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createPost.mutateAsync({ title });
      alert("Successfully created a post!");
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
          <h1>tRPC fast hands-on 🚀</h1>
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
