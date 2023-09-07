import {
  faBook,
  faBullhorn,
  faClipboardCheck,
  faHome,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../common/db";
import { LocaleContext, useLocalization } from "../common/localization";

function NavLink({ href, children }) {
  const router = useRouter();
  return (
    <>
      <Link href={href}>
        <a className="nav-link d-flex align-items-center d-none d-lg-block">
          {children}
        </a>
      </Link>
      <div
        className="nav-link d-flex align-items-center d-block d-lg-none"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        onClick={(e) => {
          e.preventDefault();
          router.push(href);
        }}
        role="button"
      >
        {children}
      </div>
    </>
  );
}

function Header({ extended, hideAuth }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [search, setSearch] = useState("");

  const router = useRouter();

  const { localize, change } = useLocalization();

  const cartCount = useLiveQuery(async () => {
    return await db.cartItems.count();
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.q) {
      setSearch(router.query.q);
    }
  }, [router]);

  function handleSubmit(event) {
    event.preventDefault();

    const query = {};
    if (search) {
      query.q = search;
    }

    if (query.q === router.query.q) {
      return;
    }
    router.replace({
      pathname: "/books",
      query: query,
    });
  }

  const flagImageStyle = {
    width: 28,
    height: 20,
    objectFit: "fill",
    borderRadius: 2,
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <Link href="/">
            <a className="navbar-brand d-none d-lg-block">
              <div className="d-flex align-items-center">
                <img src="/images/logo-text.png" height={35} alt="" />
                <span
                  className="ms-2 mb-0 h4 fw-bold"
                  style={{ color: "#5c3f37" }}
                >
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </span>
              </div>
            </a>
          </Link>
          <div className="d-flex justify-content-between flex-grow-1">
            <form className="d-flex" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  className="form-control py-2"
                  type="search"
                  placeholder="Search books..."
                  aria-label="Search"
                  size="32"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary shadow-none">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </form>

            <div className="d-flex">
              <Link href="/shopping-cart">
                <a className="btn btn-light border position-relative ms-2 fw-normal shadow-none text-nowrap py-2">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  &nbsp;{localize("cart")}
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger my-auto">
                    {cartCount}
                  </span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {extended && (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="container">
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                {/* <li className="nav-item dropdown">
                   <a
                    className="nav-link"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="categoryMenuLink"
                  >
                    <FontAwesomeIcon
                      icon={faBars}
                      className="d-none d-md-inline me-2"
                    />
                    <span>Categories</span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-macos dropdown-menu-start scrollbar-custom"
                    aria-labelledby="categoryMenuLink"
                  >
                    <li>
                      <a href="#" className="dropdown-item">
                        Art Book
                      </a>
                    </li>
                    <li>
                      <a href="#" className="dropdown-item mt-1">
                        Coloring Chart
                      </a>
                    </li>
                  </ul> 
                </li> */}
                <li className="nav-item d-block d-lg-none">
                  <NavLink href="/">
                    <FontAwesomeIcon
                      icon={faHome}
                      className="d-none d-lg-inline me-2"
                    />
                    {localize("home")}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink href="/books">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="d-none d-lg-inline me-2"
                    />
                    {localize("explore_products")}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink href="/notifications">
                    <FontAwesomeIcon
                      icon={faBullhorn}
                      className="d-none d-lg-inline me-2"
                    />
                    {localize("notifications")}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink href="/track-order">
                    <FontAwesomeIcon
                      icon={faClipboardCheck}
                      className="d-none d-lg-inline me-2"
                    />
                    {localize("track_order")}
                  </NavLink>
                </li>
              </ul>
              <ul className="ms-auto navbar-nav">
                <LocaleContext.Consumer>
                  {({ locale, setLocale }) => {
                    return (
                      <li className="nav-item dropdown">
                        <a
                          href="#"
                          className="nav-link dropdown-toggle d-flex align-items-center"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          id="languageMenuLink"
                        >
                          <img
                            src={`/images/${locale}.png`}
                            alt="Flag"
                            style={flagImageStyle}
                            className="me-1"
                          />
                        </a>
                        <ul
                          className="dropdown-menu dropdown-menu-macos dropdown-menu-end scrollbar-none"
                          aria-labelledby="languageMenuLink"
                        >
                          <li>
                            <div
                              role="button"
                              className="dropdown-item"
                              onClick={() => change("en")}
                            >
                              <img
                                src={`/images/en.png`}
                                alt="Flag"
                                style={flagImageStyle}
                                className="me-2"
                              />
                              English
                            </div>
                          </li>
                          <li>
                            <div
                              role="button"
                              className="dropdown-item mt-1"
                              onClick={() => change("mm")}
                            >
                              <img
                                src={`/images/mm.png`}
                                alt="Flag"
                                style={flagImageStyle}
                                className="me-2"
                              />
                              Myanmar
                            </div>
                          </li>
                        </ul>
                      </li>
                    );
                  }}
                </LocaleContext.Consumer>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
