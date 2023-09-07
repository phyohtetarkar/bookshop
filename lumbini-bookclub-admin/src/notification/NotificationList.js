import { TrashIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DangerButton, PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import Modal, { ConfirmModal } from "../common/Modal";
import Pagination from "../common/Pagination";
import Table from "../common/Table";
import { formatTimestamp, parseError } from "../common/utils";
import NotificationCreate from "./NotificationCreate";
import { deleteNotification, getNotifications } from "./NotificationRepo";

function NotificationList() {
  const [showCreateNoti, setShowCreateNoti] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [notification, setNotification] = useState();
  const [deleteId, setDeleteId] = useState();

  const [listState, requestNotifications] = useAPIRequest(getNotifications);
  const [delState, requestDelete] = useAPIRequest(deleteNotification);

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
        toast.info("No notification found.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Notification deleted successfully.");
      requestNotifications();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  useEffect(() => {
    requestNotifications(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function getActtionButtons(n) {
    return (
      <div className="flex space-x-2">
        <DangerButton
          onClick={() => {
            setDeleteId(n.id);
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
      <Modal title="Create Notification" isOpen={showCreateNoti}>
        <NotificationCreate
          notification={notification}
          handleClose={(result) => {
            setShowCreateNoti(false);
            setNotification(undefined);
            if (result === true) {
              toast.success("Notification saved successfully.");
              requestNotifications();
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
            <h3 className="text-gray-600">App Notification</h3>
            <PrimaryButton
              className="ml-auto"
              onClick={() => setShowCreateNoti(true)}
            >
              New Notification
            </PrimaryButton>
          </div>
        </Card.Header>
        <Card.Body className="flex flex-col space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-60">Title</Table.TH>
                  <Table.TH className="w-40 md:w-full">Description</Table.TH>
                  <Table.TH className="w-60">Created At</Table.TH>
                  <Table.TH className="w-32"></Table.TH>
                </tr>
              </Table.THead>
              <Table.TBody>
                {list.map((n) => {
                  return (
                    <tr key={n.id}>
                      <Table.TD>{n.title}</Table.TD>
                      <Table.TD>{n.description}</Table.TD>
                      <Table.TD>{formatTimestamp(n.createdAt)}</Table.TD>
                      <Table.TD>{getActtionButtons(n)}</Table.TD>
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
              hasNext={paging.hasNext}
              hasPrev={paging.hasPrev}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NotificationList;
