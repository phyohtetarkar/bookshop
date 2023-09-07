import { TrashIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { baseImagePath } from "../App";

function ProductImage({ image, onDelete = () => {}, className = "" }) {
  const [src, setSrc] = useState("/placeholder.png");

  useEffect(() => {
    if (typeof image === "object") {
      var reader = new FileReader();
      reader.onload = function (e) {
        setSrc(e.target.result);
      };
      reader.readAsDataURL(image);
    } else if (image && image.trim().length > 0) {
      setSrc(`${baseImagePath}/books%2F${image}?alt=media`);
    }
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 border rounded flex items-center mr-2 mb-2 ${className}`}
    >
      <button
        type="button"
        className="absolute right-2 top-2 rounded bg-red-600 hover:bg-red-700 p-1"
        onClick={onDelete}
      >
        <TrashIcon className="w-4 h-4 text-gray-50" />
      </button>
      <img src={src} alt="Product" className="w-[140px]" />
    </div>
  );
}

export default ProductImage;
