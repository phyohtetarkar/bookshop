import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { baseImagePath } from "../App";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DangerButton, PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { ConfirmModal } from "../common/Modal";
import Pagination from "../common/Pagination";
import Table from "../common/Table";
import { formatTimestamp, parseError } from "../common/utils";
import { deleteActivity, getActivities } from "./ActivityRepo";

// const alist = [
//   { id: 1, title: "title", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 2, title: "title", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 3, title: "title", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 4, title: "title", createdAt: "Feb 6, 2022 9:31 PM" },
//   { id: 5, title: "title", createdAt: "Feb 6, 2022 9:31 PM" },
// ];

function ActivityList() {
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [deleteId, setDeleteId] = useState();

  const [listState, requestActivities] = useAPIRequest(getActivities);
  const [delState, requestDelete] = useAPIRequest(deleteActivity);

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
      const payload = listState.payload?.list ?? [];
      setList(payload);
      setPaging({
        hasNext: listState.payload?.hasNext,
        hasPrev: listState.payload?.hasPrev,
      });
      if (payload.length === 0) {
        toast.info("No activity found.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Activity deleted successfully.");
      requestActivities();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  useEffect(() => {
    requestActivities(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function getActionButtons(a) {
    return (
      <div className="flex space-x-2">
        <Link to={`/activities/${a.id}`}>
          <PrimaryButton>
            <PencilAltIcon className="w-4 h-4" />
          </PrimaryButton>
        </Link>
        <DangerButton
          onClick={() => {
            setDeleteId(a.id);
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
            <h3 className="text-gray-600">Activities</h3>
            <Link to="/activities/new" className="ml-auto">
              <PrimaryButton>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New
              </PrimaryButton>
            </Link>
          </div>
        </Card.Header>
        <Card.Body className="flex flex-col space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-40">Cover</Table.TH>
                  <Table.TH className="w-60 md:w-full">Title</Table.TH>
                  <Table.TH className="w-60">Created At</Table.TH>
                  <Table.TH className="w-44"></Table.TH>
                </tr>
              </Table.THead>
              <Table.TBody>
                {list.map((a) => {
                  return (
                    <tr key={a.id}>
                      <Table.TD>
                        <div>
                          <img
                            src={`${baseImagePath}/activities%2F${a.cover}?alt=media`}
                            alt="Cover"
                            className="rounded h-24 aspect-video"
                          />
                        </div>
                      </Table.TD>
                      <Table.TD>{a.title}</Table.TD>
                      <Table.TD>{formatTimestamp(a.createdAt)}</Table.TD>
                      <Table.TD>{getActionButtons(a)}</Table.TD>
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
export default ActivityList;
