import Link from "next/link";
import { useLocalization } from "../../common/localization";
import { formatPrice } from "../../common/utils";

function PricingCard({
  data = [],
  fee = 0,
  pricingOnly,
  showDelivery,
  children,
}) {
  const { localize } = useLocalization();

  return (
    <div className="card">
      <div className="card-body">
        <div className="vstack gap-2">
          <div className="d-flex justify-content-between">
            <span>{localize("total_products")}</span>
            <span>{data.reduce((p, c) => p + c.quantity, 0)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>{localize("subtotal")}</span>
            <span>
              {formatPrice(
                data.reduce((p, c) => p + c.product.price * c.quantity, 0)
              )}
              &nbsp;{localize("kyat")}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>{localize("discount")}</span>
            <span className="text-danger">
              -{formatPrice(data.reduce((p, c) => p + c.discount, 0))}&nbsp;
              {localize("kyat")}
            </span>
          </div>
          {showDelivery && (
            <div className="d-flex justify-content-between">
              <span>{localize("delivery_fee")}</span>
              <span className="text-success">
                +{formatPrice(fee)}&nbsp;{localize("kyat")}
              </span>
            </div>
          )}

          <hr className="text-muted" />

          <div className="d-flex justify-content-between">
            <span className="h5">{localize("total_price")}</span>
            <span className="fw-bold h5 mb-0">
              {formatPrice(data.reduce((p, c) => p + c.price, fee))}&nbsp;
              {localize("kyat")}
            </span>
          </div>

          {!pricingOnly && (
            <div className="d-grid gap-2 mt-3">
              <Link href="/contact-info" passHref>
                <button
                  className="btn btn-primary fw-normal py-2"
                  disabled={data.length === 0}
                >
                  Checkout
                </button>
              </Link>
              <Link href="/books">
                <a className="btn btn-outline-primary fw-normal py-2">
                  Continue Shopping
                </a>
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PricingCard;
