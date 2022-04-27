import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { CookiesProvider } from "react-cookie";
import SSRProvider from 'react-bootstrap/SSRProvider';
import Header from '../components/Layout/Header/Header';

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <CookiesProvider>
        <Header />
        <Component {...pageProps} />
      </CookiesProvider>
    </SSRProvider>
  )
}

export default MyApp;
