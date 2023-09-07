import { PhotographIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import { toast } from "react-toastify";

function ProductImages({ images, onImagesChange = (blobs, urls) => {} }) {
  const [list, setList] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    setList(images ?? []);
  }, [images]);

  function handleFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size / (1024.0 * 1024.0);

      if (fileSize > 0.512) {
        toast.error("Image file size must not exceed 512KB.");
      } else {
        const imgs = [...list, file];
        setList(imgs);
        onImagesChange(
          imgs.filter((e) => typeof e === "object"),
          imgs.filter((e) => typeof e === "string")
        );
      }

      fileRef.current.value = "";
    }
  }

  function handleImageDelete(index) {
    if (index === null || index === undefined) {
      return;
    }

    let imgs = [...list];
    imgs.splice(index, 1);
    setList(imgs);

    onImagesChange(
      imgs.filter((e) => typeof e === "object"),
      imgs.filter((e) => typeof e === "string")
    );
  }

  return (
    <div className="flex flex-wrap">
      {list.map((e, i) => {
        return (
          <ProductImage
            key={i}
            image={e}
            onDelete={() => handleImageDelete(i)}
          />
        );
      })}

      {list.length < 5 && (
        <div
          role="button"
          className="shadow-sm w-[140px] aspect-square bg-gray-200 hover:bg-gray-300 rounded mr-2 mb-2 p-5"
          onClick={() => fileRef.current.click()}
        >
          <div className="flex flex-col items-center justify-center border-2 border-gray-400 border-dashed h-full w-full rounded">
            <PhotographIcon className="text-gray-500 w-11 h-11" />
            <div className="font-medium text-gray-500">Choose</div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/x-png,image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ProductImages;
