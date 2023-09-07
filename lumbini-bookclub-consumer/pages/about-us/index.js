import { useEffect } from "react";
import useSWR from "swr";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/layout";
import { getAboutUs } from "../../repo/SettingRepo";

function AboutUs() {
  const { data, error } = useSWR("/about-us", getAboutUs, {
    revalidateOnFocus: false,
    errorRetryCount: 0,
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | About Us`;
  });

  if (error) {
    return (
      <div className="container py-3">
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (!data && !error) {
    return <div></div>;
  }

  return (
    <div className="container py-3">
      <div className="row mb-5">
        <div className="col-lg-8 offset-lg-2">
          <h3 className="my-3">About Us</h3>
          {data.split("\n").map((str, i) => {
            return <p key={i}>{str}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

AboutUs.getLayout = (page) => (
  <Layout extended whiteBackground>
    {page}
  </Layout>
);

export default AboutUs;
