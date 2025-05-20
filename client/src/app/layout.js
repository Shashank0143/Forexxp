import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";
import "./responsive.css";

import ThemeProvider from "@/context/ThemeProvider";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer/index";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Forexxp Review, Forex Broker&Trading Markets, Legit or a Scam-Forexxp</title>
        <meta
          content="forex, brokers, reviews, rating, insights, forex broker, fintech, scam, exchange, scoring, stars, LP agency, trading, mt5, meta trader, forexyt, gtcfx, octafx, exness, star trader"
          name="keywords"
        />
        <meta
          content="Forexxp: Octafx review, covering licenses, user reviews, forex spreads, leverage, Is OctaFx a scam or legit broker, Read Forexxp review before start trading."
          name="description"
        />
        <link rel="canonical" href="https://www.forexxp.com/" />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
