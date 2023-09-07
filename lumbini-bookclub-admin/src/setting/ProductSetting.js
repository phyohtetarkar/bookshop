import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { PrimaryButton, PrimaryOutlineButton } from "../common/Buttons";
import Card from "../common/Card";
import { Chip } from "../common/Chips";
import { LoadingContext } from "../common/Contexts";
import Modal from "../common/Modal";
import { parseError } from "../common/utils";
import EditionEditDialog from "./EditionEditDialog";
import PublisherEditDialog from "./PublisherEditDialog";
import { getProductSetting, saveProductSetting } from "./SettingRepo";

function ProductSetting() {
  const [showPublisherDialog, setShowPublisherDialog] = useState(false);
  const [showEditionDialog, setShowEditionDialog] = useState(false);

  const [publisherList, setPublisherList] = useState([]);
  const [editionList, setEditionList] = useState([]);

  const [state, requestSave] = useAPIRequest(saveProductSetting);
  const [setting, requestSetting] = useAPIRequest(getProductSetting);

  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    requestSetting();

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(setting.status === Actions.loading);
    if (setting.status === Actions.success) {
      let payLoad = setting.payload;
      setPublisherList(payLoad.publishers ?? []);
      setEditionList(payLoad.editions ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  useEffect(() => {
    if (state.status === Actions.success) {
      toast.success("Product setting saved successfully.");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function removePublisher(i) {
    let list = [...publisherList];
    list.splice(i, 1);
    setPublisherList(list);
  }

  function removeEdition(i) {
    let list = [...editionList];
    list.splice(i, 1);
    setEditionList(list);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let ps = {
      publishers: publisherList,
      editions: editionList,
    };
    requestSave(ps);
  }

  return (
    <div>
      <Modal title="Add Publisher" isOpen={showPublisherDialog}>
        <PublisherEditDialog
          handleClose={(value) => {
            setShowPublisherDialog(false);
            if (value && value.length !== 0) {
              let list = [...publisherList];
              list.push(value);
              setPublisherList(list);
            }
          }}
          list={publisherList}
        />
      </Modal>

      <Modal title="Add Edition" isOpen={showEditionDialog}>
        <EditionEditDialog
          handleClose={(value) => {
            setShowEditionDialog(false);
            if (value && value.length !== 0) {
              let list = [...editionList];
              list.push(value);
              setEditionList(list);
            }
          }}
          list={editionList}
        />
      </Modal>
      <div>
        <form onSubmit={handleSubmit}>
          {state.status === Actions.failure && (
            <Alert alertClass="alert-error mb-4" closeable>
              {parseError(state.error)}
            </Alert>
          )}

          <Card>
            <Card.Body>
              <div className="d-flex flex-col">
                <div className="mb-3">
                  <div className="flex items-center">
                    <h6 className="text-lg font-bold text-gray-900">
                      Publishers
                    </h6>
                    <PrimaryOutlineButton
                      className="ml-auto"
                      small={true}
                      onClick={() => {
                        setShowPublisherDialog(true);
                      }}
                    >
                      <PlusIcon className="w-4 h-4 mr-2"></PlusIcon>
                      Add New
                    </PrimaryOutlineButton>
                  </div>
                  <hr className="mt-2 mb-3" />
                  <div className="flex flex-wrap">
                    {publisherList.map((s, i) => (
                      <Chip.Default key={i} className="mr-2 mb-2">
                        {s}
                        <Chip.DeleteAction onClick={() => removePublisher(i)} />
                      </Chip.Default>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center">
                    <h6 className="text-lg font-bold text-gray-900">
                      Editions
                    </h6>
                    <PrimaryOutlineButton
                      className="ml-auto"
                      small={true}
                      onClick={() => {
                        setShowEditionDialog(true);
                      }}
                    >
                      <PlusIcon className="w-4 h-4 mr-2"></PlusIcon>
                      Add New
                    </PrimaryOutlineButton>
                  </div>
                  <hr className="mt-1 mb-3" />
                  <div className="flex flex-wrap">
                    {editionList.map((s, i) => (
                      <Chip.Default key={i} className="mr-2 mb-2">
                        {s}
                        <Chip.DeleteAction onClick={() => removeEdition(i)} />
                      </Chip.Default>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex">
                <PrimaryButton
                  className="ml-auto"
                  type="submit"
                  disabled={
                    state.status === Actions.loading ||
                    setting.status === Actions.loading
                  }
                  loading={state.status === Actions.loading}
                >
                  Save
                </PrimaryButton>
              </div>
            </Card.Footer>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default ProductSetting;
