import { SWRConfig } from 'swr'
import fetch from 'lib/fetcher'
import nProgress from 'nprogress'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => nProgress.start());
    router.events.on('routeChangeComplete', () => nProgress.done());
    router.events.on('routeChangeError', () => nProgress.done());

    return () => {
      router.events.off('routeChangeStart', () => nProgress.start());
      router.events.off('routeChangeComplete', () => nProgress.done()); 
      router.events.off('routeChangeError', () => nProgress.done());
    }
  }, [router])

  return (
    <SWRConfig 
      value={{ 
        fetcher: fetch,
        onError: (err) => {
          console.log(err)
        }
      }}
    >
      <style jsx global>{`
        #nprogress { pointer-events: none; }
        #nprogress .bar {
          background: #2e4ead;
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
        }
        #nprogress .spinner { display: none }
      `}
      </style>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
