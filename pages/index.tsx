import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Liga FIFA Seridó</title>
        <meta name="description" content="Draft Liga Fifa Seridó" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.logocontainer}>
        <Link href={'/participants'}>
          <Image src="/images/lfslogo.jpeg" alt="LFS Logo" width={300} height={300} className={styles.logo} />
        </Link>
        <h1 className={styles.draft}>#DRAFT</h1>
      </div>

      <footer className={styles.footer}>
        <span>Feito com carinho  &#x2764; pelo "Dev"</span>
      </footer>
    </div>
  )
}

export default Home
