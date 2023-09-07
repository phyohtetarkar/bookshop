import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
import { KEY_APP_LOCALE } from "../common/app.config";
import { SiteSettingContext } from "../common/contexts";
import GlobalErrorHandler from "../common/GlobalErrorHandler";
import { LocaleContext } from "../common/localization";
import Layout from "../components/layout";
import { getSiteSetting } from "../repo/SettingRepo";
import "../styles/bootstrap-custom.css";
import "../styles/globals.css";

config.autoAddCss = false;

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap.bundle.min.js");
}

function MyApp({ Component, pageProps }) {
  const changeLocale = (value) => {
    setLocale((old) => {
      return { ...old, locale: value };
    });
  };

  const updateSiteSetting = (setting) => {
    setSiteSetting((old) => {
      return { ...old, setting: setting };
    });
  };

  const [locale, setLocale] = useState({
    locale: "mm",
    setLocale: changeLocale,
  });

  const [siteSetting, setSiteSetting] = useState({
    setting: {
      minimumOrderLimit: 6,
      payments: [],
      general: {
        contact: {
          address: "",
          email: "",
          phoneNumbers: [],
          location: {
            lat: "",
            lon: "",
          },
        },
        appStoreUrl: "",
        playStoreUrl: "",
        socialMedias: {
          facebook: "",
          instagram: "",
          twitter: "",
        },
      },
    },
    update: updateSiteSetting,
  });

  const { data, error } = useSWR("/site-setting", getSiteSetting, {
    revalidateOnFocus: false,
  });

  const getLayout = Component.getLayout;

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME}`;
    changeLocale(localStorage.getItem(KEY_APP_LOCALE) ?? "mm");
  }, []);

  useEffect(() => {
    if (data && !error) {
      updateSiteSetting(data);
    }
  }, [data, error]);

  if (error) {
    return (
      <div className="w-100 h-100 bg-primary d-flex justify-content-center">
        <div
          className="spinner-grow text-light align-self-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && !error) {
    return (
      <div className="w-100 h-100 bg-primary d-flex justify-content-center">
        <div
          className="spinner-grow text-light align-self-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  let content = (
    <Layout extended>
      <Component {...pageProps} />
    </Layout>
  );

  if (getLayout) {
    content = getLayout(<Component {...pageProps} />);
  }

  return (
    <GlobalErrorHandler>
      <LocaleContext.Provider value={locale}>
        <SiteSettingContext.Provider value={siteSetting}>
          {content}
        </SiteSettingContext.Provider>
      </LocaleContext.Provider>
    </GlobalErrorHandler>
  );
}

export default MyApp;
