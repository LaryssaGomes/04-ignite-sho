import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"
import { Container } from "../styles/pages/app"
import { CartContextProvider } from "../hooks/ShoppingCartContext"
import { Header } from "../components/Header"

globalStyles()

function App({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <Container>
        <Header/>
      <Component {...pageProps} />
    </Container>
   </CartContextProvider>
  )
}
export default App