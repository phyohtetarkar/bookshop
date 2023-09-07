import dynamic from "next/dynamic";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Footer from "./footer";
import Header from "./header";

const MessengerChatComponent = dynamic(
  () => import("react-messenger-chat-plugin").then((mob) => mob.MessengerChat),
  { ssr: false }
);

function Layout({ extended, whiteBackground, children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Shop Educational Products" />

        <meta property="fb:pages" content="1692366871060224" />

        <meta property="og:title" content="Universe Online Shop" />
        <meta property="og:description" content="Shop Educational Products" />
        <meta
          property="og:image"
          content="https://www.universe4kids.com/cover.jpg"
        />

        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
        <title>Universe Online Shop</title>
      </Head>
      <div
        className={`d-flex flex-column h-100 ${
          whiteBackground ? "bg-white" : ""
        }`}
      >
        <Header extended={extended} />
        <main className={`flex-shrink-0 ${whiteBackground ? "bg-white" : ""}`}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            theme="colored"
          />
          {children}
        </main>
        {typeof window !== "undefiend" && (
          <MessengerChatComponent
            pageId={process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID}
            language="en_US"
            height={24}
            autoExpand={true}
            debugMode={false}
          />
        )}
        <Footer />
      </div>
    </>
  );
}

export default Layout;
