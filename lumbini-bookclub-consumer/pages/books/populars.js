import { useEffect } from "react";
import ProductListingComponent from "../../components/product/ProductListingComponent";

function PopularProducts() {
  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Popular Products`;
  });

  return <ProductListingComponent path="populars" />;
}

export default PopularProducts;
