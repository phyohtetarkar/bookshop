import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { parseError } from "../common/utils";
import BannerItem from "./BannerItem";
import {
  getBanners,
  removeBanner,
  updateBanners,
  uploadImage,
} from "./BannerRepo";

function Banners() {
  const loadingContext = useContext(LoadingContext);
  const fileRef = useRef();
  const [items, setItems] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [listState, requestBanners] = useAPIRequest(getBanners);
  const [updateState, requestUpdate] = useAPIRequest(updateBanners);
  const [delState, requestDelete] = useAPIRequest(removeBanner);
  const [uploadState, requestUpload] = useAPIRequest(uploadImage);

  useEffect(() => {
    requestBanners();

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      setItems(listState.payload ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    if (updateState.status === Actions.failure) {
      toast.error(parseError(updateState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      requestBanners();
    }

    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  useEffect(() => {
    loadingContext.setLoading(uploadState.status === Actions.loading);
    if (uploadState.status === Actions.success) {
      requestBanners();
    }
    if (uploadState.status === Actions.failure) {
      toast.error(parseError(uploadState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadState]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((e) => e.name === active.id);
        const newIndex = items.findIndex((e) => e.name === over.id);

        let newItems = arrayMove(items, oldIndex, newIndex);

        requestUpdate(newItems);
        return newItems;
      });
    }
  }

  function handleImageChoose(event) {
    let files = event.target.files;
    if (files && files.length > 0) {
      let file = files[0];
      requestUpload(file);
      fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Banners</h3>
            <PrimaryButton
              className="ml-auto"
              onClick={() => fileRef.current.click()}
              disabled={uploadState === Actions.loading}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New
            </PrimaryButton>
            <form>
              <input
                ref={fileRef}
                onChange={handleImageChoose}
                type="file"
                className="hidden"
                accept="image/x-png,image/jpeg"
              />
            </form>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((e) => e.name)}
                strategy={rectSortingStrategy}
              >
                {items.map((e) => {
                  return (
                    <BannerItem
                      key={e.name}
                      id={e.name}
                      onDelete={(image) =>
                        requestDelete({ images: items, image })
                      }
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Banners;
