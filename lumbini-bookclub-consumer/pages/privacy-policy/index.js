import { useEffect } from "react";
import Layout from "../../components/layout";

function PrivacyPolicy() {
  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Privacy Policy`;
  });

  return (
    <div className="container py-3">
      <div className="row mb-5">
        <div className="col-lg-8 offset-lg-2">
          <h3 className="my-3">Privacy Policy</h3>
          <div className="my-4">
            At <b>Lumbini Book Club</b> application, one of our main priorities
            is the privacy of our application&apos;s users. This Privacy Policy
            document contains types of information that is collected and
            recorded by Lumbini Book Club and how we use it.
          </div>
          <div>
            The following information is collected when submitting order
          </div>
          <ol className="py-3">
            <li>
              The mobile number : for the purpose of order confirmation and
              delivery processing.
            </li>
            <li>
              The name of user : for the purpose of order confirmation and
              delivery processing.
            </li>
            <li>
              The address of user : for the purpose of delivery processing.
            </li>
          </ol>
          <div className="fw-semibold">
            NO OTHER INFORMATION IS COLLECTED. WE DO NOT SHARE YOUR INFORMATION
            TO ANY OTHER PARTIES.
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

PrivacyPolicy.getLayout = (page) => (
  <Layout extended whiteBackground>
    {page}
  </Layout>
);

export default PrivacyPolicy;
