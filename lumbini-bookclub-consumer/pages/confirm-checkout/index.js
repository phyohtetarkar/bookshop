import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { KEY_ORDER_NUMBER } from "../../common/app.config";
import { useLocalization } from "../../common/localization";
import { debounce } from "../../common/utils";
import ReviewCartItem from "../../components/confirm-checkout/ReviewCartItem";
import Modal from "../../components/modal";
import PricingCard from "../../components/shopping-cart/PricingCard";
import {
  getConfimCartData,
  getContactInfo,
  submitOrder,
} from "../../repo/CheckoutRepo";

function ConfirmCheckout() {
  const router = useRouter();
  const { localize } = useLocalization();
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmData, setConfirmData] = useState({
    items: [],
    discount: 0,
    deliveryFee: 0,
    totalPrice: 0,
  });
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    deliveryFee: 0,
    address: "",
    note: "",
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Confirm Checkout`;
  });

  useEffect(() => {
    let contactInfo = getContactInfo();
    if (!contactInfo) {
      router.replace("/shopping-cart");
      return;
    }
    setContactInfo({ ...contactInfo });

    getConfimCartData(contactInfo.deliveryFee)
      .then((c) => {
        if (!c.items.length > 0) {
          router.replace("/shopping-cart");
          return;
        }
        setConfirmData(c);
      })
      .catch((e) => {
        console.log(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCheckout() {
    submitOrder({ data: confirmData, contactInfo: contactInfo })
      .then((orderNumber) => {
        setProcessing(false);
        sessionStorage.setItem(KEY_ORDER_NUMBER, orderNumber);
        router.replace("/checkout-success");
      })
      .catch((e) => {
        setProcessing(false);
        toast.error(e.message);
      });
  }

  const processCheckout = debounce(() => handleCheckout(), 500);

  return (
    <div className="vstack mb-5">
      <div className="bg-secondary">
        <div className="container">
          <div className="row py-4 px-2">
            <nav aria-label="breadcrumb col-12">
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <Link href={`/`}>
                    <a>{localize("home")}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/shopping-cart`}>
                    <a>{localize("shopping_cart")}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/contact-info`}>
                    <a>{localize("contact_info")}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {localize("order_confirm")}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h4 className="fw-semibold mb-3">Products in cart</h4>
                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {confirmData.items &&
                    confirmData.items.map((p, i) => (
                      <ReviewCartItem key={i} data={p} />
                    ))}
                </div>
                <hr className="text-muted" />
                <div className="row g-3">
                  <div className="col-md-6">
                    <h4 className="fw-semibold">Delivery Info</h4>
                    <div className="vstack text-muted small">
                      <div>
                        Name:&nbsp;
                        <span className="text-dark fw-semibold">
                          {contactInfo.name}
                        </span>
                      </div>
                      <div>
                        Phone:&nbsp;
                        <span className="text-dark fw-semibold">
                          {contactInfo.phone}
                        </span>
                      </div>
                      <div>
                        Address:&nbsp;
                        <span className="text-dark fw-semibold">
                          {contactInfo.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 className="fw-semibold">Note</h4>
                    <div className="vstack small text-muted">
                      <span>{contactInfo.note}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <PricingCard
              data={confirmData.items}
              fee={confirmData.deliveryFee}
              pricingOnly
              showDelivery
            >
              <div className="mt-3 d-grid gap-2">
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center py-2"
                  disabled={processing}
                  onClick={() => {
                    // router.replace({
                    //   pathname: "/checkout-success",
                    // });
                    //setProcessing(true);
                    //processCheckout();
                    setShowConfirm(true);
                  }}
                >
                  Place order
                </button>
                <Link href="/contact-info">
                  <a className="btn btn-outline-primary py-2">Return</a>
                </Link>
              </div>
            </PricingCard>
          </div>
        </div>

        {processing && (
          <div className="overlay d-flex justify-content-center">
            <div
              className="spinner-border text-light align-self-center"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            {/* <div
              className="align-self-center"
              style={{
                width: 200,
              }}
            >
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: "100%",
                  }}
                ></div>
              </div>
            </div> */}
          </div>
        )}
        <br />
        <br />
        <br />
      </div>
      <Modal
        id="orderConfirm"
        title={localize("order_confirm")}
        visible={showConfirm}
        handleClose={() => setShowConfirm(false)}
      >
        <Modal.Body>
          <div className="py-2">{localize("confirm_order_submit")}</div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-default"
            onClick={() => setShowConfirm(false)}
          >
            {localize("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShowConfirm(false);
              setProcessing(true);
              processCheckout();
            }}
          >
            {localize("ok")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConfirmCheckout;
