import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import Alert from "../common/Alert";
import { DangerButton, PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import Modal, { ConfirmModal } from "../common/Modal";
import Table from "../common/Table";
import { Actions, useAPIRequest } from "../common/api-request";
import CategoryEdit from "./CategoryEdit";
import { deleteCategory, getCategories } from "./CategoryRepo";
import { parseError, formatTimestamp } from "../common/utils";
import { toast } from "react-toastify";

// const list = [
//   { id: 1, name: "Category Name", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 2, name: "Category Name", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 3, name: "Category Name", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 4, name: "Category Name", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 5, name: "Category Name", createdAt: "Feb 6, 2022 9:31 PM" },
// ];

function CategoryList() {
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [category, setCategory] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestCategories] = useAPIRequest(getCategories);
  const [delState, requestDelete] = useAPIRequest(deleteCategory);

  useEffect(() => {
    requestCategories();

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      setList(listState.payload ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Category deleted successfully.");
      requestCategories();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  function getActionButtons(c) {
    return (
      <div className="flex space-x-2">
        <PrimaryButton
          onClick={() => {
            setCategory(c);
            setShowEdit(true);
          }}
        >
          <PencilAltIcon className="w-4 h-4" />
        </PrimaryButton>
        <DangerButton
          onClick={() => {
            setDeleteId(c.id);
            setShowConfirm(true);
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </DangerButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <Modal title="Edit Category" isOpen={showEdit}>
        <CategoryEdit
          category={category}
          handleClose={(result) => {
            setShowEdit(false);
            setCategory(undefined);
            if (result === true) {
              toast.success("Category save successfully.");
              requestCategories();
            }
          }}
        />
      </Modal>

      <ConfirmModal
        message="Are you sure to delete?"
        isOpen={showConfirm}
        handleClose={(result) => {
          setShowConfirm(false);
          if (result) {
            requestDelete(deleteId);
          }
          setDeleteId(undefined);
        }}
      />

      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Categories</h3>
            <PrimaryButton
              className="ml-auto"
              onClick={() => setShowEdit(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New
            </PrimaryButton>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-40 md:w-full">Name</Table.TH>
                  <Table.TH className="w-60">Created At</Table.TH>
                  <Table.TH className="w-44"></Table.TH>
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD>{c.name}</Table.TD>
                      <Table.TD>{formatTimestamp(c.createdAt)}</Table.TD>
                      <Table.TD>{getActionButtons(c)}</Table.TD>
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CategoryList;
