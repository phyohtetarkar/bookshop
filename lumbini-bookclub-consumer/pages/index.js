import { faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import useSWR from "swr";
import { baseImagbaePath } from "../common/app.config";
import { useLocalization } from "../common/localization";
import ErrorMessage from "../components/ErrorMessage";
import ProductGridItem from "../components/product/ProductGridItem";
import { getHomeData } from "../repo/HomeRepo";

function Home() {
  const { data, error } = useSWR("/home", getHomeData, {
    revalidateOnFocus: false,
  });

  // const categoricalData = useSWR("/categorical-data", getHomeCategorizedData, {
  //   revalidateOnFocus: false,
  // });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Home`;
  });

  const { localize } = useLocalization();

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

  return (
    <div className="container py-3">
      <div className="row mb-4 mb-lg-5">
        <div className="col-12">
          <div className="row g-3">
            <div className="col-lg-3 d-none d-lg-inline">
              <div className="card h-100">
                <div className="card-header">
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ height: 42 }}
                  >
                    <h6 className="mb-0">{localize("all_authors")}</h6>

                    <Link href="/books">
                      <a className="text-primary small fw-medium text-decoration-none ms-2">
                        {localize("view_all")}&nbsp;
                        <FontAwesomeIcon icon={faChevronRight} />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="card-body h-100 overflow-auto scrollbar-custom">
                  <div className="position-relative">
                    <div className="d-flex flex-column gap-2 position-absolute top-0 bottom-0 start-0 end-0">
                      {/* <input
                        type="search"
                        placeholder="Filter author"
                        className="form-control"
                      /> */}
                      {data.authors
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((e) => {
                          return (
                            <Link key={e.id} href={`/books?author=${e.id}`}>
                              <a className="p-2 my-list-item user-select-none">
                                {e.name}
                              </a>
                            </Link>
                          );
                        })}

                      <a href="#" className="invisible p-1"></a>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="bg-white p-3 rounded shadow-sm h-100 overflow-auto scrollbar-custom">
                <div className="position-relative">
                  <div className="d-flex flex-column gap-2 position-absolute top-0 bottom-0 start-0 end-0">
                    <Link href="/products">
                      <a className="p-2 my-list-item user-select-none">
                        All Categories
                      </a>
                    </Link>
                    {data.categories.map((e) => {
                      return (
                        <Link key={e.id} href={`/products?category=${e.id}`}>
                          <a className="p-2 my-list-item user-select-none">
                            {e.name}
                          </a>
                        </Link>
                      );
                    })}

                    <a href="#" className="invisible p-1"></a>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-lg-9">
              <Carousel
                className="overflow-hidden"
                autoPlay={true}
                infiniteLoop={true}
                showArrows={false}
                showStatus={false}
                showThumbs={false}
                transitionTime={300}
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                  if (isSelected) {
                    return (
                      <li
                        className="d-inline-block mx-2 mb-lg-3 text-light small"
                        style={{ outline: "none" }}
                      >
                        <FontAwesomeIcon icon={faCircle} size="xs" />
                      </li>
                    );
                  }
                  return (
                    <li
                      className="d-inline-block mx-2 mb-lg-3 text-light text-opacity-50 small"
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
                {data.banners.map((e, i) => {
                  return (
                    <div
                      key={i}
                      onContextMenu={(e) => e.preventDefault()}
                      className="ratio ratio-16x9 overflow-hidden"
                    >
                      <img
                        src={`${baseImagbaePath}/banners%2F${e.name}?alt=media`}
                        alt="Cover image"
                        className=""
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex overflow-auto scrollbar-none mb-4 d-lg-none">
        {data.authors.map((e, i) => {
          return (
            <Link key={e.id} href={`/books?author=${e.id}`}>
              <a
                className={
                  "btn btn-primary text-nowrap " + (i > 0 ? "ms-2" : "")
                }
              >
                {e.name}
              </a>
            </Link>
          );
        })}
      </div>

      {data.promotions && data.promotions.length > 0 && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4
              className="fw-semibold text-nowrap"
              style={{ textOverflow: "ellipsis", overflowX: "clip" }}
            >
              {localize("promotions")}
            </h4>
            <Link href="/books/promotions">
              <a className="text-decoration-none fw-medium text-nowrap">
                {localize("view_all")}
              </a>
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
            {data.promotions.map((e, i) => {
              return (
                <div className="col" key={i}>
                  <ProductGridItem data={e} />
                </div>
              );
            })}
          </div>
        </>
      )}

      {data.populars && data.populars.length > 0 && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4
              className="fw-semibold text-nowrap"
              style={{ textOverflow: "ellipsis", overflowX: "clip" }}
            >
              {localize("popular_products")}
            </h4>
            <Link href="/books/populars">
              <a className="text-decoration-none fw-medium text-nowrap">
                {localize("view_all")}
              </a>
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
            {data.populars.map((e, i) => {
              return (
                <div className="col" key={i}>
                  <ProductGridItem data={e} />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* {categoricalData.data &&
        categoricalData.data.map((cd) => {
          if (cd.list.length === 0) {
            return null;
          }

          return (
            <Fragment key={cd.category.id}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4
                  className="fw-semibold text-nowrap"
                  style={{ textOverflow: "ellipsis", overflowX: "clip" }}
                >
                  {cd.category.name}
                </h4>
                <Link href={`/books?category=${cd.category.id}`}>
                  <a className="text-decoration-none fw-medium text-nowrap">
                    {localize("view_all")}
                  </a>
                </Link>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
                {cd.list.map((e, i) => {
                  return (
                    <div className="col" key={i}>
                      <ProductGridItem data={e} />
                    </div>
                  );
                })}
              </div>
            </Fragment>
          );
        })} */}

      {data.newArrivals && data.newArrivals.length > 0 && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4
              className="fw-semibold text-nowrap"
              style={{ textOverflow: "ellipsis", overflowX: "clip" }}
            >
              {localize("new_arrivals")}
            </h4>
            <Link href="/books/new-arrivals">
              <a className="text-decoration-none fw-medium text-nowrap">
                {localize("view_all")}
              </a>
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
            {data.newArrivals.map((e, i) => {
              return (
                <div className="col" key={i}>
                  <ProductGridItem data={e} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
