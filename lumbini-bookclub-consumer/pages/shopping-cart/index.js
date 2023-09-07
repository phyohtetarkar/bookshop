import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useEffect } from "react";
import { db } from "../../common/db";
import { useLocalization } from "../../common/localization";
import PricingCard from "../../components/shopping-cart/PricingCard";
import ShoppingCartItem from "../../components/shopping-cart/ShoppingCartItem";

function ShoppingCart() {
  const { localize } = useLocalization();
  const list = useLiveQuery(async () => {
    return await db.cartItems.toArray();
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Shopping Cart`;
  });

  let content = <div></div>;
  if (list && list.length === 0) {
    content = (
      <div>
        <h6 className="text-center text-muted p-3">
          {localize("no_products_in_cart")}
        </h6>
      </div>
    );
  } else {
    content = (
      <div>
        {list &&
          list.map((p) => {
            return <ShoppingCartItem key={p.id} data={p} />;
          })}
      </div>
    );
  }

  return (
    <div className="vstack mb-5">
      <div className="bg-secondary">
        <div className="container">
          <div className="row py-4 px-2">
            <nav aria-label="breadcrumb col-12">
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <Link href={`/`}>
                    <a>{localize("home")}</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {localize("shopping_cart")}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container py-3">
        <div className="row g-3">
          <div className="col-lg-8">{content}</div>
          <div className="col-lg-4">
            <PricingCard data={list} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
