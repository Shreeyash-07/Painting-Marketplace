import { NavBar } from "../components/componentindex";
import "../Styles/globals.css";

import { PaintingMarketplaceProvider } from "../context/PaintingMarketplaceContext";
const MyApp = ({ Component, pageProps }) => {
  return (
    <PaintingMarketplaceProvider>
      <NavBar />
      <Component {...pageProps} />
    </PaintingMarketplaceProvider>
  );
};

export default MyApp;
