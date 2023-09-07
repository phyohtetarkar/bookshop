import { PencilAltIcon, RefreshIcon, TrashIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { baseImagePath } from "../App";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DangerButton, DefaultButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { Select } from "../common/FormControls";
import Modal, { ConfirmModal } from "../common/Modal";
import { formatPrice, formatTimestamp, parseError } from "../common/utils";
import {
  getOrder,
  removeOrderItem,
  restoreOrderItem,
  updateOrderAddress,
  updateOrderDeliveryFee,
  updateOrderStatus,
} from "./OrderRepo";
import UpdateDeliveryFee from "./UpdateDeliveryFee";
import UpdateOrderAddress from "./UpdateOrderAddress";

const cancelledState = "CANCELLED";
const REMOVE_ITEM = "remove_item";
const RESTORE_ITEM = "restore_item";

function OrderDetail() {
  let params = useParams();
  const navigate = useNavigate();
  const [state, requestSave] = useAPIRequest(updateOrderStatus);
  const [dataState, requestData] = useAPIRequest(getOrder);
  const [confirmUpdate, setConfirmUpdate] = useState({
    show: false,
    message: "",
    for: "",
    item: undefined,
  });

  const [editAddress, setEditAddress] = useState(false);
  const [editDeliveryFee, setEditDeliveryFee] = useState(false);

  const loadingContext = useContext(LoadingContext);

  const [showConfirm, setShowConfirm] = useState(false);
  const [order, setOrder] = useState({
    items: [],
  });

  useEffect(() => {
    if (params.id) {
      requestData(params.id);
    }

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    loadingContext.setLoading(dataState.status === Actions.loading);
    if (dataState.status === Actions.success) {
      setOrder(dataState.payload ?? {});
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
      navigate("/orders", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState]);

  useEffect(() => {
    if (state.status === Actions.success) {
      toast.success("Order status updated successfully.");
      requestData(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function updateStatus(s) {
    requestSave({ id: params.id, status: s });
  }

  function updateAddress(value) {
    updateOrderAddress(order, value)
      .then((result) => {
        toast.success("Address updated successfully.");
        setOrder(result);
        loadingContext.setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update address.");
        loadingContext.setLoading(false);
      });
  }

  function updateDeliveryFee(fee) {
    updateOrderDeliveryFee(order, fee)
      .then((result) => {
        toast.success("Delivery fee updated successfully.");
        setOrder(result);
        loadingContext.setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update delivery fee.");
        loadingContext.setLoading(false);
      });
  }

  function removeItem(item) {
    loadingContext.setLoading(true);
    removeOrderItem(order, item)
      .then((result) => {
        toast.success("Item removed successfully.");
        setOrder(result);
        loadingContext.setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to remove item.");
        loadingContext.setLoading(false);
      });
  }

  function restoreItem(item) {
    loadingContext.setLoading(true);
    restoreOrderItem(order, item)
      .then((result) => {
        toast.success("Item restored successfully.");
        setOrder(result);
        loadingContext.setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to restore item.");
        loadingContext.setLoading(false);
      });
  }

  function getProductImageUrl(p) {
    if (p.product.images && p.product.images.length > 0) {
      return `${baseImagePath}/books%2F${p.product.images[0]}?alt=media`;
    }

    return "/placeholder.png";
  }
  if (dataState.status !== Actions.success) {
    return <div></div>;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <ConfirmModal
        message="Are you sure to cancel order?"
        isOpen={showConfirm}
        handleClose={(result) => {
          setShowConfirm(false);
          if (result) {
            updateStatus(cancelledState);
          }
        }}
      />

      <ConfirmModal
        message={confirmUpdate.message}
        isOpen={confirmUpdate.show}
        handleClose={(result) => {
          const update = { ...confirmUpdate };

          setConfirmUpdate({
            show: false,
            message: "",
            for: "",
            item: undefined,
          });

          if (!result) {
            return;
          }

          if (update.for === REMOVE_ITEM) {
            removeItem(update.item);
          } else if (update.for === RESTORE_ITEM) {
            restoreItem(update.item);
          }
        }}
      />

      <Modal title="Edit Address" isOpen={editAddress}>
        <UpdateOrderAddress
          address={order.address}
          handleClose={(result) => {
            if (result) {
              updateAddress(result);
            }
            setEditAddress(false);
          }}
        />
      </Modal>

      <Modal title="Edit Delivery Fee" isOpen={editDeliveryFee}>
        <UpdateDeliveryFee
          fee={order.deliveryFee}
          handleClose={(result) => {
            if (result) {
              updateDeliveryFee(result);
            }
            setEditDeliveryFee(false);
          }}
        />
      </Modal>

      {dataState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(dataState.error)}
        </Alert>
      )}

      <div className="lg:col-span-3">
        <Card>
          <Card.Header className="h-16 flex">
            <div className="flex flex-grow items-center justify-between">
              <h4 className="mb-0">{order.orderNumber}</h4>
              {order.status !== cancelledState && order.status !== "COMPLETED" && (
                <DangerButton
                  className="ml-auto whitespace-nowrap"
                  onClick={() => setShowConfirm(true)}
                  disabled={
                    state.status === Actions.loading ||
                    dataState.status === Actions.loading
                  }
                >
                  Cancel Order
                </DangerButton>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <h6 className="font-semibold text-lg mb-1">Delivery Info</h6>
                <div className="text-gray-600">
                  Name:&nbsp;
                  <span className="text-black">{order.customer}</span>
                </div>
                <div className="text-gray-600">
                  Phone:&nbsp;
                  <span className="text-black">{order.phoneNumber}</span>
                </div>
                {/* <div className="text-gray-600">
                  Township:&nbsp;
                  <span className="text-black">
                    {order.deliveryRegion ? order.deliveryRegion.region : ""}
                  </span>
                </div> */}
                <div className="text-gray-600 flex items-center">
                  Address:&nbsp;
                  <span className="text-black">{order.address}</span>
                  <button
                    type="button"
                    className="text-indigo-500 ml-2 hover:text-indigo-600"
                    onClick={() => {
                      setEditAddress(true);
                    }}
                  >
                    <PencilAltIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-4">
                <h6 className="font-semibold text-lg mb-1">Payment Info</h6>
                <div className="text-gray-600">
                  {`Total Products:  ${order.totalProduct}`}
                </div>
                <div className="text-gray-600">
                  {`Subtotal:  ${formatPrice(order.subtotal)} Ks`}
                </div>
                <div className="text-red-600">
                  {`Discount:  -${formatPrice(order.discount)}  Ks`}
                </div>
                <div className="text-green-600 flex items-center">
                  {`Delivery fee:  +${formatPrice(order.deliveryFee)} Ks`}
                  <button
                    className="text-indigo-500 ml-2 hover:text-indigo-600"
                    onClick={() => {
                      setEditDeliveryFee(true);
                    }}
                  >
                    <PencilAltIcon className="w-4 h-4" />
                  </button>
                </div>
                <h5 className="text-gray-900 font-semibold">
                  {`Total Price:  ${formatPrice(order.totalPrice)}  Ks`}
                </h5>
              </div>
              <div className="lg:col-span-3">
                <h6 className="font-semibold text-lg mb-1">Status</h6>
                <div className="flex">
                  {order.status === cancelledState && (
                    <h6 className="font-semibold text-lg text-red-600">
                      {cancelledState}
                    </h6>
                  )}
                  {order.status !== cancelledState && (
                    <Select
                      onChange={(event) => {
                        updateStatus(event.target.value);
                      }}
                      value={order.status}
                      disabled={
                        state.status === Actions.loading ||
                        dataState.status === Actions.loading
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="DELIVERING">Delivering</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                  )}
                </div>
              </div>
            </div>
            <hr className="my-5 lg:col-span-12"></hr>
            <div className="grid lg:grid-cols-2 gap-4 lg:col-span-12">
              {order.items.map((p, i) => {
                return (
                  <div key={i} className="flex space-x-3">
                    <div className="rounded flex items-center relative">
                      <img
                        src={getProductImageUrl(p)}
                        alt="product"
                        style={{ height: 150, width: 120 }}
                        className={`object-cover ${
                          p.removed ? "opacity-50" : ""
                        }`}
                      />

                      {!p.removed && (
                        <DangerButton
                          className="absolute top-0 left-0"
                          onClick={() => {
                            setConfirmUpdate({
                              show: true,
                              message: "Are you sure to remove item?",
                              for: REMOVE_ITEM,
                              item: p,
                            });
                          }}
                          small
                        >
                          <TrashIcon className="w-4 h-4" />
                        </DangerButton>
                      )}
                      {p.removed && (
                        <DefaultButton
                          className="absolute top-0 left-0"
                          onClick={() => {
                            setConfirmUpdate({
                              show: true,
                              message: "Are you sure to restore item?",
                              for: RESTORE_ITEM,
                              item: p,
                            });
                          }}
                          small
                        >
                          <RefreshIcon className="w-4 h-4" />
                        </DefaultButton>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h6
                        className={`text-gray-800 font-medium mb-1 ${
                          p.removed ? "line-through" : ""
                        }`}
                      >
                        {p.product.name}
                      </h6>
                      <div
                        className={`text-gray-500 text-sm ${
                          p.removed ? "line-through" : ""
                        }`}
                      >
                        {p.product.author.name}
                      </div>
                      <div
                        className={`text-gray-900 font-semibold mt-auto ${
                          p.removed ? "line-through" : ""
                        }`}
                      >
                        {p.quantity} x{" "}
                        {`${formatPrice(p.price / p.quantity)} Ks`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
          <Card.Footer>
            <h6 className="text-gray-400">
              Order Date: {formatTimestamp(order.createdAt)}
            </h6>
          </Card.Footer>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="h-full">
          <Card.Header className="h-16">
            <div className="flex items-center py-2">
              <h4>Note</h4>
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600">{order.note ?? ""}</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default OrderDetail;
