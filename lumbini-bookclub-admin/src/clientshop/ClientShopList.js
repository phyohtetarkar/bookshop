import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DangerButton, PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { ConfirmModal } from "../common/Modal";
import Pagination from "../common/Pagination";
import Table from "../common/Table";
import { formatTimestamp, parseError } from "../common/utils";
import { deleteClientShop, getClientShops } from "./ClientShopRepo";

function ClientShopList() {
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [deleteId, setDeleteId] = useState();

  const [listState, requestClientShops] = useAPIRequest(getClientShops);
  const [delState, requestDelete] = useAPIRequest(deleteClientShop);

  const [query, setQuery] = useState({
    first: null,
    last: null,
  });

  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  useEffect(() => {
    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      let payload = listState.payload?.list ?? [];
      setList(payload);
      setPaging({
        hasNext: listState.payload?.hasNext,
        hasPrev: listState.payload?.hasPrev,
      });
      if (payload.length === 0) {
        toast.info("No client shop found.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Category deleted successfully.");
      requestClientShops();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  useEffect(() => {
    requestClientShops(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function getActionButtons(c) {
    return (
      <div className="flex space-x-2">
        <Link to={`/client-shops/${c.id}`}>
          <PrimaryButton>
            <PencilAltIcon className="w-4 h-4" />
          </PrimaryButton>
        </Link>
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
    <div>
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
            <h3 className="text-gray-600">Client Shops</h3>
            <NavLink to="/client-shops/new" className="ml-auto">
              <PrimaryButton>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New
              </PrimaryButton>
            </NavLink>
          </div>
        </Card.Header>

        <Card.Body className="flex flex-col space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-44">Name</Table.TH>
                  <Table.TH className="w-60 md:w-full">Address</Table.TH>
                  <Table.TH className="w-32">City</Table.TH>
                  <Table.TH className="w-32">Township</Table.TH>
                  <Table.TH className="w-56">Created At</Table.TH>
                  <Table.TH className="w-32"></Table.TH>
                </tr>
              </Table.THead>
              <Table.TBody>
                {list.map((c) => {
                  return (
                    <tr key={c.id}>
                      <Table.TD>{c.name}</Table.TD>
                      <Table.TD>{c.address}</Table.TD>
                      <Table.TD>{c.city}</Table.TD>
                      <Table.TD>{c.township}</Table.TD>
                      <Table.TD>{formatTimestamp(c.createdAt)}</Table.TD>
                      <Table.TD>{getActionButtons(c)}</Table.TD>
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>
          <div className="flex flex-row-reverse">
            <Pagination
              list={list}
              query={query}
              hasPrev={paging.hasPrev}
              hasNext={paging.hasNext}
              onPrev={(first) => {
                const q = { ...query };
                q.first = first;
                q.last = null;
                setQuery(q);
              }}
              onNext={(last) => {
                const q = { ...query };
                q.last = last;
                q.first = null;
                setQuery(q);
              }}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ClientShopList;
