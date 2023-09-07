import { useEffect } from "react";
import ProductListingComponent from "../../components/product/ProductListingComponent";

function DiscountProducts() {
  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Promotions`;
  });
  return <ProductListingComponent path="promotions" />;
}

export default DiscountProducts;
