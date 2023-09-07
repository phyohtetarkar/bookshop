import { useEffect, useState, useRef } from "react";
import { baseImagePath } from "../App";

function ActivityCover({ cover, onFileChange = (file) => {} }) {
  const imageRef = useRef();
  const [image, setImage] = useState("/placeholder.png");

  useEffect(() => {
    if (cover && cover.trim().length > 0) {
      setImage(`${baseImagePath}/activities%2F${cover}?alt=media`);
    }
  }, [cover]);

  function handleFileChange(event) {
    let files = event.target.files;
    if (files && files.length > 0) {
      let file = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target.result);
      };

      reader.readAsDataURL(file);
      onFileChange(file);
      imageRef.current.value = "";
    }
  }

  return (
    <div
      className="relative rounded flex overflow-clip"
      role="button"
      onClick={() => imageRef.current.click()}
    >
      <img
        src={image}
        alt="Cover"
        className="w-full aspect-video object-cover"
      />
      <div className="absolute bottom-0 p-2 bg-black bg-opacity-50 text-center w-full text-gray-100">
        Choose image
      </div>
      <input
        ref={imageRef}
        src={image}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/x-png,image/jpeg"
      />
    </div>
  );
}

export default ActivityCover;
