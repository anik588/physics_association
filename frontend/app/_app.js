// pages/_app.js
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS globally

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
