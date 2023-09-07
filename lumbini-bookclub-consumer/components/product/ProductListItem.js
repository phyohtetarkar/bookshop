import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "react-toastify";
import { baseImagbaePath } from "../../common/app.config";
import { SiteSettingContext } from "../../common/contexts";
import { useLocalization } from "../../common/localization";
import { formatPrice, transformDiscount } from "../../common/utils";
import { addToCard } from "../../repo/CheckoutRepo";

function ProductListItem({ data, large }) {
  const { localize } = useLocalization();
  const settingContext = useContext(SiteSettingContext);

  let popular;
  let available;
  let image;
  let price = `${formatPrice(data.price)} ${localize("kyat")}`;

  if (data.images && data.images.length > 0) {
    image = `${baseImagbaePath}/books%2F${data.images[0]}?alt=media`;
  }

  if (data.popular) {
    popular = (
      <div
        className="badge bg-danger position-absolute"
        style={{ top: "0.5rem", right: "0.5rem" }}
      >
        Popular
      </div>
    );
  }

  if (!data.available) {
    available = (
      <div className="bg-dark opacity-75 py-1 text-light position-absolute rounded-bottom text-center bottom-0 start-0 end-0">
        <small>Out Of Stock</small>
      </div>
    );
  }

  if (data.isDiscount) {
    price = (
      <>
        {transformDiscount(data.price, data.discount)}&nbsp;{localize("kyat")}
        <del className="text-muted small fw-normal ms-1">
          {formatPrice(data.price)}&nbsp;{localize("kyat")}
        </del>
      </>
    );
  }
  return (
    <div className="d-flex">
      <div className="flex-shink-0">
        <Link href={`/books/${data.id}`}>
          <a className="text-decoration-none">
            <div
              className="position-relative"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="ratio ratio-1x1 rounded"
                style={{ height: large ? 150 : 120, width: large ? 120 : 100 }}
              >
                <img
                  className=""
                  src={image}
                  alt="Product image."
                  style={{ objectFit: "contain" }}
                />
              </div>
              {available && available}
              {popular && popular}
            </div>
          </a>
        </Link>
      </div>
      <div className="flex-grow-1 d-flex flex-column ms-3 overflow-hidden">
        <Link href={`/books/${data.id}`}>
          <a
            className={`text-muted text-decoration-none ${
              !large ? "text-truncate" : "mb-1"
            }`}
          >
            {data.name}
          </a>
        </Link>
        <Link href={`/books?author=${data.author.id}`}>
          <a
            className={`text-danger text-decoration-none ${
              !large ? "text-truncate small mb-1" : "mb-1"
            }`}
          >
            {data.author.name}
          </a>
        </Link>
        <h6 className="fw-semibold">{price}</h6>
        <div className="mt-auto">
          <button
            className={`btn btn-outline-primary shadow-none fw-normal ${
              !large ? "btn-sm" : ""
            }`}
            disabled={!data.available}
            onClick={() => {
              addToCard(data, settingContext.setting.minimumOrderLimit)
                .then((result) => {
                  if (result) {
                    toast.success(localize("product_added_to_cart"));
                  } else {
                    toast.info(localize("product_already_in_cart"));
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            <FontAwesomeIcon icon={faCartPlus} />
            <span className="ms-2">{localize("add_to_cart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductListItem;
