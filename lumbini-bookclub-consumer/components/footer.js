import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faEnvelope,
  faMapMarker,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { SiteSettingContext } from "../common/contexts";
import { useLocalization } from "../common/localization";
import Modal from "./modal";

function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const [showPayments, setShowPayments] = useState(false);

  const { localize } = useLocalization();
  return (
    <SiteSettingContext.Consumer>
      {({ setting }) => {
        const contact = setting?.general?.contact;
        const payments = setting?.payments ?? [];

        return (
          <>
            <Modal
              id="paymentOptions"
              title={localize("payment_options")}
              visible={showPayments}
              handleClose={() => setShowPayments(false)}
            >
              <Modal.Body>
                <div className="d-flex flex-column gap-3">
                  {payments.map((e, i) => {
                    return (
                      <div
                        key={i}
                        className="d-flex align-items-center justify-content-between"
                      >
                        <h6 className="mb-0 fw-bold">{e.method}</h6>
                        <div className="text-muted">{e.number}</div>
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowPayments(false);
                  }}
                >
                  {localize("close")}
                </button>
              </Modal.Footer>
            </Modal>

            <div className="mt-auto bg-primary">
              <footer className="py-4 bg-primary">
                <div className="container pt-2 pb-3">
                  <div className="row g-4">
                    <div className="col-lg-4 d-none d-md-block">
                      {/* <h5 className="text-light">About Us</h5> */}
                      <div className="d-flex mb-3">
                        <div className="rounded overflow-hidden">
                          <img src="/images/logo.png" height={70} alt="" />
                        </div>
                      </div>
                      <span className="text-light text-opacity-75 my-auto">
                        &copy; {new Date().getFullYear()} {appName}. All rights
                        reserved.
                      </span>
                      {/* <p className="mb-2 text-light text-opacity-75 small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                  in feugiat lorem.
                </p> */}
                    </div>
                    <div className="col-lg-2">
                      <h5 className="text-light">About</h5>
                      <div className="vstack small gap-2">
                        <Link href="/about-us">
                          <a className="footer-link">{localize("about_us")}</a>
                        </Link>
                        {contact.location && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${contact?.location?.lat}%2C${contact?.location?.lon}`}
                            target="_blank"
                            rel="noreferrer"
                            className="footer-link"
                          >
                            {localize("view_on_map")}
                          </a>
                        )}
                        <Link href="/terms-and-conditions">
                          <a className="footer-link">
                            {localize("terms_and_conditions")}
                          </a>
                        </Link>
                        <Link href="/privacy-policy">
                          <a className="footer-link">
                            {localize("privacy_policy")}
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <h5 className="text-light">Information</h5>
                      <div className="vstack small gap-2">
                        <Link href="/notifications">
                          <a className="footer-link">
                            {localize("notifications")}
                          </a>
                        </Link>
                        <Link href="/track-order">
                          <a className="footer-link">
                            {localize("track_order")}
                          </a>
                        </Link>
                        <a
                          href="#"
                          className="footer-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPayments(true);
                          }}
                        >
                          {localize("payment_options")}
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <h5 className="text-light">Contact Us</h5>
                      <div className="row g-0 mb-1 text-light text-opacity-75">
                        <div className="col-auto small">
                          <FontAwesomeIcon
                            icon={faMapMarker}
                            className="mt-1 me-2"
                            fixedWidth
                          />
                        </div>
                        <div className="col small">
                          {contact?.address ?? ""}
                        </div>
                      </div>
                      <div className="row g-0 mb-1 text-light text-opacity-75">
                        <div className="col-auto small">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="mt-1 me-2"
                            fixedWidth
                          />
                        </div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="col small text-light text-opacity-75"
                        >
                          {contact?.email ?? ""}
                        </a>
                      </div>

                      <div className="row g-0 text-light text-opacity-75 mb-3">
                        <div className="col-auto small">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="mt-1 me-2"
                            fixedWidth
                          />
                        </div>
                        <div className="col small">
                          {contact?.phoneNumbers.join(", ") ?? ""}
                        </div>
                      </div>

                      <div className="hstack gap-2">
                        {setting.general?.appStoreUrl && (
                          <a
                            href={setting.general.appStoreUrl}
                            className="text-decoration-none"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src="/images/apple-app-store-badge.svg"
                              alt=""
                            />
                          </a>
                        )}
                        {setting.general?.playStoreUrl && (
                          <a
                            href={setting.general.playStoreUrl}
                            className="text-decoration-none"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src="/images/google-play-badge.svg" alt="" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
              <div className="container ">
                <hr className="my-0 bg-light bg-opacity-75" />
              </div>
              <footer className="py-4 bg-primary">
                <div className="container d-flex justify-content-center">
                  {/* <span className="text-light text-opacity-50 my-auto">
              &copy; {new Date().getFullYear()} Universe4kids. All rights
              reserved.
            </span> */}
                  <div className="d-flex gap-4">
                    {setting.general?.socialMedias?.facebook && (
                      <a
                        href={setting.general.socialMedias.facebook}
                        className="ms-auto link-light"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faFacebookF} size="lg" />
                      </a>
                    )}
                    {setting.general?.socialMedias?.twitter && (
                      <a
                        href={setting.general.socialMedias.twitter}
                        className="ms-auto link-light"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                      </a>
                    )}
                    {setting.general?.socialMedias?.instagram && (
                      <a
                        href={setting.general.socialMedias.instagram}
                        className="ms-auto link-light"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faInstagram} size="lg" />
                      </a>
                    )}
                  </div>
                </div>
              </footer>
            </div>
          </>
        );
      }}
    </SiteSettingContext.Consumer>
  );
}

export default Footer;
