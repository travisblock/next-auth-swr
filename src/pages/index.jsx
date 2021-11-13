import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Main from 'components/layouts/main'
import { route } from 'config/routes'

export default function Home() {
  return (
    <Main title="My Next.js Homepage">
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to{' '}
            <Link href="/">
              <a>Next.js!</a>
            </Link>
          </h1>

          <p className={styles.description}>
            Get started by Login{' '}
            <code className={styles.code}>
              <Link href={route('login')}>
                <a>pages/login.js</a>
              </Link>
            </code>
            {' Or '}
            <code className={styles.code}>
              <Link href={route('user.index')}>
                <a>pages/profile.js</a>
              </Link>
            </code>
          </p>
        </main>
      </div>
    </Main>
  )
}
