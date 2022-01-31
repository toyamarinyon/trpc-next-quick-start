// import { trpc } from "../utils/trpc";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const dummyData = [
  {
    id: 1,
    title: "dummy a",
  },
  {
    id: 2,
    title: "dummy b",
  },
];
const Home: NextPage = () => {
  // You should type bellow code in step 4 on walk through.
  // We're highly recommended typing below code instead of copying it.
  // const query = trpc.useQuery(["posts", {}]);
  return (
    <section className={styles.container}>
      <main className={styles.main}>
        <header className={styles.title}>
          <h1>tRPC with Next.js Quick Demo 🚀</h1>
        </header>
        <h2>Posts</h2>
        <section className={styles.grid}>
          {dummyData.map((data, i) => (
            <article key={`article-${i}`} className={styles.card}>
              <p>{data.title}</p>
            </article>
          ))}
        </section>
        <h2>Add post</h2>
        <form className={styles.form}>
          <textarea></textarea>
          <button>submit</button>
        </form>
      </main>
    </section>
  );
};

export default Home;
