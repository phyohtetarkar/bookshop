import {
  faCircleXmark,
  faGrip,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { pageSizeLimit } from "../../common/app.config";
import { useLocalization } from "../../common/localization";
import { getProducts } from "../../repo/ProductRepo";
import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";
import ProductFilter from "./ProductFilter";
import ProductGridItem from "./ProductGridItem";
import ProductListItem from "./ProductListItem";

function ProductListingComponent({ path }) {
  const [list, setList] = useState([]);
  const [pageEnd, setPageEnd] = useState(false);
  const [category, setCategory] = useState();
  const [author, setAuthor] = useState();

  const router = useRouter();

  const [query, setQuery] = useState(null);
  const [viewGrid, setViewGrid] = useState(false);
  const { localize } = useLocalization();

  const { data, error } = useSWR([query, "/books"], getProducts, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    setList([]);
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const q = router.query;
    const newQuery = {
      category: q.category,
      author: q.author,
      name: q.q,
      promotion: path === "promotions",
      popular: path === "populars",
      newArrival: path === "new-arrivals",
      last: null,
    };

    setQuery((old) => {
      if (JSON.stringify(old) === JSON.stringify(newQuery)) {
        return old;
      }

      setList([]);
      return newQuery;
    });
  }, [router, path]);

  useEffect(() => {
    if (data) {
      setList((old) => [...old, ...data]);
      setPageEnd(data.length < pageSizeLimit);
    }
  }, [data]);

  function loadMore() {
    if (list.length === 0 || pageEnd) {
      return;
    }

    const last = list[list.length - 1];

    setQuery((old) => ({ ...old, last: last.id }));
  }

  let title = localize("all_products");
  if (path === "promotions") {
    title = localize("promotions");
  } else if (path === "populars") {
    title = localize("popular_products");
  } else if (path === "new-arrivals") {
    title = localize("new_arrivals");
  }

  let content = <Loading />;

  if (error) {
    content = <ErrorMessage error={error} />;
  } else if (list && list.length > 0) {
    content = (
      <>
        {viewGrid ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 pb-2">
            {list.map((product) => {
              return (
                <div key={product.id} className="col">
                  <ProductGridItem data={product} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-1 row-cols-lg-2 g-3 pb-2">
            {list.map((product) => {
              return (
                <div key={product.id} className="col">
                  <div className="card">
                    <div className="card-body">
                      <ProductListItem data={product} large={true} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!pageEnd && data && !error && (
          <div className="d-flex justify-content-center py-4">
            <button
              className="btn btn-outline-primary rounded-pill px-3"
              onClick={loadMore}
            >
              Load more items
            </button>
          </div>
        )}

        {!data && !error && <Loading />}
      </>
    );
  } else if (data && !error && list.length === 0) {
    content = (
      <div className="text-muted text-center py-3">No books found.</div>
    );
  }

  return (
    <div className="vstack mb-5">
      <div className="bg-secondary">
        <div className="container">
          <div className="py-4 px-2">
            <h4 className="text-dark fw-semibold mb-0">{title}</h4>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-3">
            <ProductFilter
              category={router.query.category}
              author={router.query.author}
              onCategoryChoice={setCategory}
              onAuthorChoice={setAuthor}
            />
          </div>
          <div className="col-lg-9">
            <div className="d-flex mb-3">
              {/* <div className="me-2">
                {authorData.data && (
                  <Select
                    className="text-nowrap"
                    styles={{
                      control: (css, state) => ({
                        ...css,
                        boxShadow: "none",
                        padding: 2,
                        borderRadius: 0,
                      }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#dddddd",
                        primary: "#212121",
                      },
                    })}
                    value={
                      router.query.author
                        ? authorData.data.find(
                            (d) => d.id === router.query.author
                          )
                        : ""
                    }
                    onChange={(newValue, action) => {
                      handleAuthorSelect(newValue?.id);
                    }}
                    options={authorData.data}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    placeholder="All authors"
                    getOptionValue={(op) => op.id}
                    getOptionLabel={(op) => op.name}
                  />
                )}
              </div> */}

              <div className="">
                <div className="d-flex">
                  {author && (
                    <div className="bg-default p-2 rounded d-flex align-items-center me-2">
                      <span className="me-2 user-select-none text-truncate">
                        {author.name}
                      </span>
                      <FontAwesomeIcon
                        role="button"
                        icon={faCircleXmark}
                        onClick={() => {
                          const query = { ...router.query };
                          delete query.author;
                          router.replace({
                            pathname: router.pathname,
                            query: query,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="">
                <div className="d-flex">
                  {category && (
                    <div className="bg-default p-2 rounded d-flex align-items-center me-2">
                      <span className="me-2 user-select-none text-truncate">
                        {category.name}
                      </span>
                      <FontAwesomeIcon
                        role="button"
                        icon={faCircleXmark}
                        onClick={() => {
                          const query = { ...router.query };
                          delete query.category;
                          router.replace({
                            pathname: router.pathname,
                            query: query,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="btn-group ms-auto" role="group">
                <button
                  className="btn btn-outline-primary shadow-none"
                  onClick={() => setViewGrid((old) => !old)}
                >
                  {viewGrid ? (
                    <FontAwesomeIcon icon={faList} size="lg" fixedWidth />
                  ) : (
                    <FontAwesomeIcon icon={faGrip} size="lg" fixedWidth />
                  )}
                </button>
              </div>
              {/* <div className="col-md-4 order-1 order-md-2">
                <form className="" onSubmit={() => {}}>
                  <div className="position-relative">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search..."
                      aria-label="Search"
                      size="32"
                      value={query?.search ?? ""}
                      onChange={(e) => {}}
                    />
                    <FontAwesomeIcon
                      className="position-absolute top-50 end-0 translate-middle-y text-muted pe-2"
                      icon={faSearch}
                    />
                  </div>
                </form>
              </div> */}
            </div>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListingComponent;
