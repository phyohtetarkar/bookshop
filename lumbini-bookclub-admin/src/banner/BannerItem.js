import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "@heroicons/react/outline";
import { baseImagePath } from "../App";

function BannerItem({ id, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, resizeObserverConfig: { disabled: true } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative focus:z-10 cursor-move"
    >
      <button
        className="absolute right-4 top-2 rounded bg-red-600 hover:bg-red-700 p-1"
        onClick={() => onDelete(id)}
      >
        <TrashIcon className="w-4 h-4 text-gray-50" />
      </button>
      <img
        src={`${baseImagePath}/banners%2F${id}?alt=media`}
        alt="Banner"
        className="w-[200px] aspect-video mr-2 mb-2 border rounded"
      />
    </div>
  );
}

export default BannerItem;
