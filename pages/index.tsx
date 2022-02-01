// import { trpc } from "../utils/trpc";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";

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
  const [title, setTitle] = useState();
  const [filter, setFilter] = useState();

  // You should type bellow code in step 4 on walk through.
  // We're highly recommended typing below code instead of copying it.
  // const query = trpc.useQuery(["posts", {}]);
  return (
    <section className={styles.container}>
      <main className={styles.main}>
        <header className={styles.title}>
          <h1>tRPC with Next.js Quick Demo 🚀</h1>
        </header>
        <section className={styles.controller}>
          <form className={styles.filter}>
            <input type="text" id="filter" />
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
                <form>
                  <textarea id="postTitle"></textarea>
                  <button type="submit">Create</button>
                </form>
              </div>
            </section>
          </details>
        </section>

        <section className={styles.grid}>
          {dummyData.map((data, i) => (
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
