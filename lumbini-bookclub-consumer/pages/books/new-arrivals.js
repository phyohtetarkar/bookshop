import { useEffect } from "react";
import ProductListingComponent from "../../components/product/ProductListingComponent";

function NewArrivals() {
  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | New Arrivals`;
  });
  return <ProductListingComponent path="new-arrivals" />;
}

export default NewArrivals;
