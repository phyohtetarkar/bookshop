import Link from "next/link";
import { baseImagbaePath } from "../../common/app.config";
import { useLocalization } from "../../common/localization";
import { formatPrice, transformDiscount } from "../../common/utils";

function ReviewCartItem({ data }) {
  const { localize } = useLocalization();

  const product = data.product;
  let image;
  let price = `${formatPrice(product.price)} ${localize("kyat")}`;

  if (product.images && product.images.length > 0) {
    image = `${baseImagbaePath}/books%2F${product.images[0]}?alt=media`;
  }

  if (product.isDiscount) {
    price = (
      <>
        {transformDiscount(product.price, product.discount)}
        &nbsp;{localize("kyat")}
      </>
    );
  }

  return (
    <div className="hstack">
      <div className="flex-shink-0">
        <Link href={`/books/${product.id}`}>
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
                  className={`${data.removed ? "opacity-75" : ""}`}
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
            <Link href={`/books/${product.id}`}>
              <a className="link-dark text-decoration-none text-truncate d-block py-1">
                {data.removed ? <del>{product.name}</del> : product.name}
              </a>
            </Link>
          </span>
          <span className="h6">
            <Link href={`/books?author=${product.author.id}`}>
              <a className={`text-danger text-decoration-none fw-normal`}>
                {data.removed ? (
                  <del>{product.author.name}</del>
                ) : (
                  product.author.name
                )}
              </a>
            </Link>
          </span>
        </div>
        <div>
          <h6 className="mb-0">
            {data.removed ? (
              <del>
                {data.quantity} x {price}
              </del>
            ) : (
              `${data.quantity} x ${price}`
            )}
          </h6>
        </div>
      </div>
    </div>
  );
}

export default ReviewCartItem;
