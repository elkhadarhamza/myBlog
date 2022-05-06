import Link from "next/link"
import styles from "../styles/Blog.module.css"

const Home = () => {
  return (
<>
    <h1 className="heading text-4xl md:text-6xl font-bold font-sans md:leading-tight">
    <strong>Hugo Tailwind</strong> Starter Blog
  </h1>
    <div className={styles.grid}>
      <div className={styles.box}>
        <h1 className={styles.title}> Blog post 1 </h1>
        <p className={styles.paragraf}>
          Lorem ipsum sit amet, consectetur adipiscing elit, sed do
        </p>
        <Link href="/sign-in">
          <a>Read Now </a>
        </Link>
      </div>

    </div>
    </>
  )
}

export default Home
