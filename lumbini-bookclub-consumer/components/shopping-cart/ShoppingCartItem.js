import { faMinus, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "react-toastify";
import { baseImagbaePath } from "../../common/app.config";
import { SiteSettingContext } from "../../common/contexts";
import { useLocalization } from "../../common/localization";
import { formatPrice, transformDiscount } from "../../common/utils";
import { removeFromCart, updateItemQuantity } from "../../repo/CheckoutRepo";

function ShoppingCartItem({ data = {} }) {
  const { localize } = useLocalization();
  const settingContext = useContext(SiteSettingContext);
  let image;
  let price = `${formatPrice(data.product.price)} ${localize("kyat")}`;

  if (data.product.images && data.product.images.length > 0) {
    image = `${baseImagbaePath}/books%2F${data.product.images[0]}?alt=media`;
  }

  function remove(id) {
    removeFromCart(id)
      .then((result) => {
        if (result) {
          toast.success("Product removed from cart.");
        } else {
          toast.error("Failed to remove from cart.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const getQtyInput = () => {
    return (
      <div className="input-group">
        <button
          className="btn btn-outline-default text-muted shadow-none"
          style={{ width: 46 }}
          type="button"
          onClick={() => {
            if (data.quantity > settingContext.setting.minimumOrderLimit) {
              updateItemQuantity(data.id, -1);
            }
          }}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <input
          type="text"
          className="form-control text-center bg-light border-start-0 border-end-0"
          value={data.quantity}
          onChange={() => {}}
          size="2"
          style={{ width: 48 }}
          readOnly
          disabled
        />
        <button
          className="btn btn-outline-default text-muted shadow-none"
          style={{ width: 46 }}
          type="button"
          onClick={() => {
            updateItemQuantity(data.id, 1);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    );
  };

  if (data.product.isDiscount) {
    price = (
      <>
        {transformDiscount(data.product.price, data.product.discount)}&nbsp;
        {localize("kyat")}
        <del className="text-muted small fw-normal ms-1">
          {formatPrice(data.product.price)}&nbsp;{localize("kyat")}
        </del>
      </>
    );
  }

  return (
    <div>
      <div className="card mb-3 d-none d-md-block">
        <div className="card-body p-3">
          <div className="hstack justify-content-between">
            <div className="hstack col-8">
              <div className="flex-shink-0">
                <Link href={`/books/${data.product.id}`}>
                  <a className="text-decoration-none">
                    <div
                      className="position-relative"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div
                        className="ratio ratio-1x1 rounded"
                        style={{ height: 120, width: 100 }}
                      >
                        <img
                          className=""
                          src={image}
                          alt="Product image."
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="ms-3 vstack justify-content-between overflow-hidden">
                <div>
                  <span className="h6">
                    <Link href={`/books/${data.product.id}`}>
                      <a className="link-dark text-decoration-none text-truncate d-block py-1">
                        {data.product.name}
                      </a>
                    </Link>
                  </span>
                  <span className="h6">
                    <Link href={`/books?author=${data.product.author.id}`}>
                      <a
                        className={`text-danger text-decoration-none fw-normal`}
                      >
                        {data.product.author.name}
                      </a>
                    </Link>
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{price}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-auto">
              <div>{getQtyInput()}</div>
            </div>
            <div>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => {
                  remove(data.id);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm mb-3 d-block d-md-none">
        <div className="card-body p-3">
          <div className="vstack">
            <div className="hstack mb-3">
              <div className="flex-shink-0">
                <Link href={`/books/${data.product.id}`}>
                  <a className="text-decoration-none">
                    <div
                      className="position-relative"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div
                        className="ratio ratio-1x1 rounded"
                        style={{ height: 120, width: 100 }}
                      >
                        <img
                          className=""
                          src={image}
                          alt="Product image."
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="ms-3 vstack justify-content-between overflow-hidden">
                <div>
                  <span className="h6">
                    <Link href={`/books/${data.product.id}`}>
                      <a className="link-dark text-decoration-none text-truncate d-block py-1">
                        {data.product.name}
                      </a>
                    </Link>
                  </span>
                  <span className="h6">
                    <Link href={`/books?author=${data.product.author.id}`}>
                      <a className={`text-danger text-decoration-none`}>
                        {data.product.author.name}
                      </a>
                    </Link>
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{price}</h6>
                </div>
              </div>
            </div>
            <div className="hstack justify-content-between">
              <div className="d-flex">
                <div>{getQtyInput()}</div>
              </div>
              <div>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    remove(data.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartItem;
