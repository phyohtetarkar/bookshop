import {
  faCartPlus,
  faCircle,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { toast } from "react-toastify";
import useSWR from "swr";
import { baseImagbaePath } from "../../common/app.config";
import { SiteSettingContext } from "../../common/contexts";
import { useLocalization } from "../../common/localization";
import { formatPrice, transformDiscount } from "../../common/utils";
import ErrorMessage from "../../components/ErrorMessage";
import ProductListItem from "../../components/product/ProductListItem";
import { addToCard } from "../../repo/CheckoutRepo";
import { getProduct } from "../../repo/ProductRepo";

function ProductDetail() {
  const settingContext = useContext(SiteSettingContext);
  const [quantity, setQuantity] = useState(
    settingContext.setting.minimumOrderLimit
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { localize } = useLocalization();

  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR([id], getProduct, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Book Detail`;
  });

  useEffect(() => {
    if (data && !error) {
      setSelectedIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  if (error) {
    return (
      <div className="container py-3">
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (!data && !error) {
    return <div></div>;
  }

  const product = data.product;
  let price = `${formatPrice(product.price)} ${localize("kyat")}`;

  if (product.isDiscount) {
    price = (
      <>
        {transformDiscount(product.price, product.discount)}&nbsp;
        {localize("kyat")}
        <del className="text-danger small fw-normal ms-1">
          {formatPrice(product.price)}&nbsp;{localize("kyat")}
        </del>
      </>
    );
  }

  return (
    <div className="vstack">
      <div className="bg-secondary">
        <div className="container">
          <div className="row py-4 px-2">
            <nav aria-label="breadcrumb col-12">
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <Link href={"/books"}>
                    <a>{localize("all_categories")}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/books?category=${product.category.id}`}>
                    <a>{product.category.name}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-white mb-4">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-5">
              <div
                className="position-relative"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="ratio ratio-1x1 rounded d-none d-lg-block">
                  <img
                    className=""
                    src={`${baseImagbaePath}/books%2F${product.images[selectedIndex]}?alt=media`}
                    alt="Product image."
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <Carousel
                  className="rounded overflow-hidden d-block d-lg-none"
                  autoPlay={false}
                  infiniteLoop={true}
                  showArrows={false}
                  showStatus={false}
                  showThumbs={false}
                  transitionTime={300}
                  selectedItem={selectedIndex}
                  onChange={(index, item) => setSelectedIndex(index)}
                  renderIndicator={(
                    onClickHandler,
                    isSelected,
                    index,
                    label
                  ) => {
                    if (isSelected) {
                      return (
                        <li
                          className="d-inline-block m-2 text-dark text-opacity-75 small"
                          style={{ outline: "none" }}
                        >
                          <FontAwesomeIcon icon={faCircle} size="xs" />
                        </li>
                      );
                    }
                    return (
                      <li
                        className="d-inline-block m-2 text-dark text-opacity-25 small"
                        onClick={onClickHandler}
                        key={index}
                        role="button"
                        tabIndex={0}
                        style={{ outline: "none" }}
                      >
                        <FontAwesomeIcon icon={faCircle} size="xs" />
                      </li>
                    );
                  }}
                >
                  {product.images.map((img, i) => {
                    return (
                      <div
                        key={i}
                        className="ratio ratio-1x1"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <img
                          className="p-2"
                          src={`${baseImagbaePath}/books%2F${img}?alt=media`}
                          alt="Product image."
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    );
                  })}
                </Carousel>

                {/* {product.images.length > 0 && (
                  <>
                    <div
                      role="button"
                      className="p-2 bg-dark position-absolute rounded-circle top-50 start-0 translate-middle-y text-light d-block d-lg-none bg-opacity-75"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} fixedWidth />
                    </div>
                    <div
                      role="button"
                      className="p-2 bg-dark position-absolute rounded-circle top-50 end-0 translate-middle-y text-light d-block d-lg-none bg-opacity-75"
                    >
                      <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                    </div>
                  </>
                )} */}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-column h-100">
                <h4 className="d-inline text-muted me-3">
                  {product.name}
                  {product.popular && (
                    <span className="badge bg-danger ms-2">Popular</span>
                  )}
                </h4>

                <h4 className="fw-semibold mb-0">{price}</h4>

                <hr />

                <dl className="row mb-3">
                  {product.code && (
                    <>
                      <dt className="col-sm-3 fw-semibold">
                        {localize("product_code")}
                      </dt>
                      <dd className="col-sm-9">
                        {product.code ? product.code : <span>&nbsp;</span>}
                      </dd>
                    </>
                  )}
                  <dt className="col-sm-3 fw-semibold">{localize("author")}</dt>
                  <dd className="col-sm-9">
                    <Link href={`/books?author=${product.author.id}`}>
                      <a className="text-dark fw-bold">{product.author.name}</a>
                    </Link>
                  </dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("category")}
                  </dt>
                  <dd className="col-sm-9">{product.category.name}</dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("publisher")}
                  </dt>
                  <dd className="col-sm-9">{product.publisher}</dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("published_year")}
                  </dt>
                  <dd className="col-sm-9">
                    {product.publishedYear ? (
                      product.publishedYear
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("number_of_pages")}
                  </dt>
                  <dd className="col-sm-9">
                    {product.numberOfPages ? (
                      product.numberOfPages
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("edition")}
                  </dt>
                  <dd className="col-sm-9">
                    {product.edition ? product.edition : <span>&nbsp;</span>}
                  </dd>
                  <dt className="col-sm-3 fw-semibold">
                    {localize("availability")}
                  </dt>
                  <dd className="col-sm-9 fw-semibold">
                    {product.available ? (
                      <span className="text-success">In Stock</span>
                    ) : (
                      <span className="text-danger">Out Of Stock</span>
                    )}
                  </dd>
                </dl>

                <div className="flex-grow-1"></div>

                <div className="d-flex">
                  <div className="col col-sm-auto me-3">
                    <div className="input-group flex-nowrap border py-1">
                      <button
                        className="btn btn-link shadow-none"
                        onClick={() => {
                          quantity > settingContext.setting.minimumOrderLimit &&
                            setQuantity((old) => old - 1);
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div
                        className="bg-white align-items-center justify-content-center d-flex flex-grow-1"
                        style={{ minWidth: 44 }}
                      >
                        {quantity}
                      </div>
                      <button
                        className="btn btn-link shadow-none"
                        onClick={() => {
                          setQuantity((old) => old + 1);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary col-auto col-sm-auto text-nowrap px-3 fw-normal"
                    disabled={!product.available}
                    onClick={() => {
                      addToCard(product, quantity)
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
                    <span className="ms-2 d-none d-sm-inline">
                      {localize("add_to_cart")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3 d-none d-lg-block">
            <div className="col-5 d-flex justify-content-center">
              {product.images?.map((e, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: 60 }}
                    className={`me-2 ratio ratio-1x1 ${
                      selectedIndex === i ? "border border-primary" : ""
                    }`}
                    role="button"
                    onClick={() => setSelectedIndex(i)}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      className="p-1"
                      src={`${baseImagbaePath}/books%2F${e}?alt=media`}
                      alt="Product image."
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                );
              }) ?? ""}
            </div>
            <div className="col-7"></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="card">
              <div
                className="px-3 d-flex align-items-center card-header"
                style={{ height: 64 }}
              >
                <h5 className="mb-0 fw-semibold">Description</h5>
              </div>
              <div className="card-body">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
                {/* {product.description.split("\n").map((str, i) => {
                  return <p key={i}>{str}</p>;
                })} */}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div
                className="px-3 d-flex align-items-center card-header"
                style={{ height: 64 }}
              >
                <h5 className="mb-0 fw-semibold">Related books</h5>
              </div>
              <div className="card-body">
                {data.relatedProducts.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {data.relatedProducts.map((e) => {
                      return <ProductListItem key={e.id} data={e} />;
                    })}
                  </div>
                ) : (
                  <div className="text-muted">No related books.</div>
                )}
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

export default ProductDetail;
