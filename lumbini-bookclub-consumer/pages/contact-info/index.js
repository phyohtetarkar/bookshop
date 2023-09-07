import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { db } from "../../common/db";
import { useLocalization } from "../../common/localization";
import PricingCard from "../../components/shopping-cart/PricingCard";
import { getContactInfo, saveContactInfo } from "../../repo/CheckoutRepo";

function ContactInfo() {
  const router = useRouter();
  const { localize } = useLocalization();
  const [list, setList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const getCartData = async () => {
    return await db.cartItems.toArray();
  };

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Contact Info`;
  });

  useEffect(() => {
    let contactInfo = getContactInfo();
    if (contactInfo) {
      setInitialValues({
        name: contactInfo.name ? contactInfo.name : "",
        phone: contactInfo.phone ? contactInfo.phone : "",
        address: contactInfo.address ? contactInfo.address : "",
        note: contactInfo.note ? contactInfo.note : "",
      });
    }

    getCartData()
      .then((c) => {
        if (!c.length > 0) {
          router.replace("/shopping-cart");
          return;
        }
        setList(c);
      })
      .catch((e) => {
        console.log(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter name.";
      }

      if (!values.phone || values.phone.trim().length === 0) {
        errors.phone = "Please enter phone.";
      } else if (isNaN(values.phone)) {
        errors.phone = "Invalid phone number.";
      }

      if (!values.address || values.address.trim().length === 0) {
        errors.address = "Please enter address.";
      }

      if (Object.keys(errors).length > 0) {
        toast.error("Please correct input errors.");
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const contactInfo = { ...values };
      //contactInfo["deliveryFee"] = data[selectedTownshipIndex];
      saveContactInfo(contactInfo);
      router.push("/confirm-checkout");
    },
  });

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
                <li className="breadcrumb-item active" aria-current="page">
                  {localize("contact_info")}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <form
                  className="row g-3"
                  onSubmit={formik.handleSubmit}
                  autoComplete="on"
                >
                  {/* <h4 className="fw-semibold mb-0">
                    {localize("contact_info")}
                  </h4> */}
                  <div className="col-md-6">
                    <label className="form-label">{localize("name")}*</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control py-2 ${
                        formik.errors.name ? "is-invalid" : ""
                      }`}
                      placeholder={localize("enter_name")}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      autoComplete="on"
                    />
                    {formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">{localize("phone")}*</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control py-2 ${
                        formik.errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder={localize("enter_phone")}
                      value={formik.values.phone}
                      onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                          formik.setFieldValue(
                            e.target.name,
                            e.target.value.trim()
                          );
                        }
                      }}
                      autoComplete="on"
                    />
                    {formik.errors.phone && (
                      <div className="invalid-feedback">
                        {formik.errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">{localize("address")}*</label>
                    <textarea
                      className={`form-control ${
                        formik.errors.address ? "is-invalid" : ""
                      }`}
                      rows="5"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      autoComplete="on"
                    />
                    {formik.errors.address && (
                      <div className="invalid-feedback">
                        {formik.errors.address}
                      </div>
                    )}
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">
                      {localize("order_note")}
                    </label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="note"
                      value={formik.values.note}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="col-md-12 mt-4">
                    <div className="d-grid gap-2 d-flex justify-content-end">
                      <Link href="/shopping-cart">
                        <a className="btn btn-outline-primary">Back</a>
                      </Link>
                      <button className="btn btn-primary" type="submit">
                        Continue
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <PricingCard data={list} pricingOnly showDelivery />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
