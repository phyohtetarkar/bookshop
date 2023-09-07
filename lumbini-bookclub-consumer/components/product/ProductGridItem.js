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

function ProductGridItem({ data = {} }) {
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
        className="badge bg-danger py-2 position-absolute"
        style={{ top: "1rem", right: "1rem" }}
      >
        Popular
      </div>
    );
  }

  if (!data.available) {
    available = (
      <div className="bg-dark opacity-75 py-2 text-light position-absolute text-center bottom-0 start-0 end-0">
        Out Of Stock
      </div>
    );
  }

  if (data.isDiscount) {
    price = (
      <>
        {transformDiscount(data.price, data.discount)}&nbsp;
        {localize("kyat")}
        <del className="text-muted small fw-normal ms-1">
          {formatPrice(data.price)}&nbsp;
          {localize("kyat")}
        </del>
      </>
    );
  }

  return (
    <div className="card h-100">
      <Link href={`/books/${data.id}`}>
        <a className="text-decoration-none">
          <div
            className="position-relative"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="ratio ratio-1x1 rounded-top">
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
      <div className="card-body">
        <div className="vstack">
          <Link href={`/books/${data.id}`}>
            <a className="text-muted text-decoration-none text-truncate mb-1">
              {data.name}
            </a>
          </Link>

          <Link href={`/books?author=${data.author.id}`}>
            <a className="text-danger text-decoration-none text-truncate">
              {data.author.name}
            </a>
          </Link>

          <div className="hstack gap-2 mt-3">
            <h6 className="fw-semibold mb-0">{price}</h6>
            <button
              disabled={!data.available}
              className="btn btn-outline-primary shadow-none ms-auto"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGridItem;
