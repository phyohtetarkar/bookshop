import {
  faCheckCircle,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { KEY_ORDER_NUMBER } from "../../common/app.config";
import { useLocalization } from "../../common/localization";

function CheckoutSuccess() {
  const router = useRouter();
  const { localize } = useLocalization();
  const [orderNumber, setOrderNumber] = useState();

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Checkout Success`;
  });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const number = sessionStorage.getItem(KEY_ORDER_NUMBER);
    if (!number || number.trim().length === 0) {
      router.replace("/shopping-cart");
      return;
    }
    setOrderNumber(number);
    sessionStorage.removeItem(KEY_ORDER_NUMBER);
  }, [router]);

  if (!orderNumber || orderNumber.trim().length === 0) {
    return <div></div>;
  }

  return (
    <div className="container py-4 h-100">
      <div className="row h-100">
        <div className="col-md-12 h-100">
          <div className="card h-100">
            <div className="card-body mt-5">
              <div className="d-flex justify-content-center mb-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="5x"
                  className="text-success"
                />
              </div>
              <h3 className="text-center mb-4">Thanks for your order.</h3>
              <div
                className="text-center px-md-5"
                dangerouslySetInnerHTML={{
                  __html:
                    localize("order_success_message") +
                    "<b>" +
                    (orderNumber ? orderNumber : "") +
                    "</b>",
                }}
              ></div>
              <div className="d-flex flex-column align-items-center mt-5">
                <Link href="/books">
                  <a className="btn btn-primary px-4 py-3 d-flex align-items-center fw-normal shadow-none">
                    <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                    {localize("continue_shopping")}
                  </a>
                </Link>
                <Link href="/track-order">
                  <a className="btn btn-link mt-2">{localize("track_order")}</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default CheckoutSuccess;
