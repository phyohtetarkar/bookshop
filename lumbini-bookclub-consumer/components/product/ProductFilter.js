import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useLocalization } from "../../common/localization";
import { getAuthors } from "../../repo/AuthorRepo";
import { getCategories } from "../../repo/CategoryRepo";

function ProductFilter({ category, author, onCategoryChoice, onAuthorChoice }) {
  const [selectedCatgory, setSelectedCategory] = useState();
  const [selectedAuthor, setSelectedAuthor] = useState();
  const [authorFilter, setAuthorFilter] = useState();

  const { localize } = useLocalization();

  const authorData = useSWR("/authors", getAuthors, {
    revalidateOnFocus: false,
  });

  const { data, error } = useSWR("/categories", getCategories, {
    revalidateOnFocus: false,
  });
  const router = useRouter();

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  useEffect(() => {
    setSelectedAuthor(author);
  }, [author]);

  useEffect(() => {
    if (data && onCategoryChoice) {
      onCategoryChoice(data.find((c) => c.id === category));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, data]);

  useEffect(() => {
    if (authorData.data && onCategoryChoice) {
      onAuthorChoice(authorData.data.find((a) => a.id === author));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, data]);

  function handleSelect(event) {
    let checkedQuery = {};
    if (event.target.checked) {
      checkedQuery = event.target.id;
    }

    const query = { ...router.query };
    if (checkedQuery && event.target.name === "category") {
      query.category = checkedQuery;
    } else if (checkedQuery && event.target.name === "author") {
      query.author = checkedQuery;
    }

    router.replace({
      pathname: router.pathname,
      query: query,
    });
  }

  if (error) {
    return null;
  }

  if (!data && !error) {
    return <div></div>;
  }

  return (
    <div className="accordion border">
      <div className="accordion-item border-bottom">
        <h2 className="accordion-header">
          <button
            className="accordion-button fw-bold"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            style={{ backgroundColor: "transparent" }}
          >
            Explore
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show">
          <div className="accordion-body">
            <div className="vstack gap-2">
              <Link href={"/books"} replace>
                <a className="fw-medium link-dark text-decoration-none">
                  {localize("all_products")}
                </a>
              </Link>
              <Link href={"/books/promotions"}>
                <a className="fw-medium link-dark text-decoration-none">
                  {localize("promotions")}
                </a>
              </Link>
              <Link href={"/books/populars"}>
                <a className="fw-medium link-dark text-decoration-none">
                  {localize("popular_products")}
                </a>
              </Link>
              <Link href={"/books/new-arrivals"}>
                <a className="fw-medium link-dark text-decoration-none">
                  {localize("new_arrivals")}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item border-bottom">
        <h2 className="accordion-header">
          <button
            className="accordion-button fw-bold"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="true"
            style={{ backgroundColor: "transparent" }}
          >
            Authors
          </button>
        </h2>
        <div id="collapseTwo" className="accordion-collapse collapse show">
          <div
            className="accordion-body scrollbar-custom py-1"
            style={{ overflowY: "auto" }}
          >
            <input
              type="search"
              placeholder="Filter author"
              className="form-control mb-3"
              value={authorFilter ?? ""}
              onChange={(e) => setAuthorFilter(e.target.value)}
            />
            <div
              className="vstack gap-2"
              style={{ maxHeight: 250, minHeight: 100 }}
            >
              {authorData.data &&
                authorData.data
                  .filter(
                    (a) => !authorFilter || a.name.startsWith(authorFilter)
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((a) => {
                    return (
                      <div key={a.id} className="form-check">
                        <input
                          type="radio"
                          id={a.id}
                          name="author"
                          className="form-check-input"
                          checked={selectedAuthor === a.id}
                          onChange={handleSelect}
                        />
                        <label className="form-check-label" htmlFor={a.id}>
                          {a.name}
                        </label>
                      </div>
                    );
                  })}
              <a href="#" className="invisible p-1"></a>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button fw-bold"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="true"
            style={{ backgroundColor: "transparent" }}
          >
            Categories
          </button>
        </h2>
        <div id="collapseThree" className="accordion-collapse collapse show">
          <div
            className="accordion-body scrollbar-custom py-1"
            style={{ overflowY: "auto" }}
          >
            <div className="vstack gap-2" style={{ maxHeight: 250 }}>
              {data.map((category) => {
                return (
                  <div key={category.id} className="form-check">
                    <input
                      type="radio"
                      id={category.id}
                      name="category"
                      className="form-check-input"
                      checked={selectedCatgory === category.id}
                      onChange={handleSelect}
                    />
                    <label className="form-check-label" htmlFor={category.id}>
                      {category.name}
                    </label>
                  </div>
                );
              })}
              <a href="#" className="invisible p-1"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
