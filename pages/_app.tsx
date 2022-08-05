import type { AppProps } from 'next/app'
import '../styles/globals.css'

function FifaSerido({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default FifaSerido
