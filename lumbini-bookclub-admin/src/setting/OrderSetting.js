import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import {
  DangerButton,
  PrimaryButton,
  PrimaryOutlineButton,
} from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { Input } from "../common/FormControls";
import Modal from "../common/Modal";
import { parseError } from "../common/utils";
import PaymentEditDialog from "./PaymentEditDialog";
import { getOrderSetting, saveOrderSetting } from "./SettingRepo";

function OrderSetting() {
  const [showDialog, setShowDialog] = useState(false);

  const [state, requestSave] = useAPIRequest(saveOrderSetting);
  const [setting, requestSetting] = useAPIRequest(getOrderSetting);

  const loadingContext = useContext(LoadingContext);

  const [payment, setPayment] = useState({
    data: undefined,
    index: -1,
  });

  const [orderSetting, setOrderSetting] = useState({
    minimumOrderLimitPerProduct: 1,
    deliveryRegions: [],
    payments: [],
  });

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
      setOrderSetting(setting.payload ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("Order Setting saved successfully.");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...orderSetting },
    validate: (values) => {
      let errors = {};
      if (values.minimumOrderLimitPerProduct < 1) {
        errors.name = "Must be greater than or equal 1.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      // values.deliveryFees.sort((a, b) =>
      //   a.township.toLowerCase() > b.township.toLowerCase()
      //     ? 1
      //     : b.township.toLowerCase() > a.township.toLowerCase()
      //     ? -1
      //     : 0
      // );
      requestSave(values);
    },
  });

  function removeDeliveryFees(i) {
    let list = [...formik.values.deliveryFees];
    list.splice(i, 1);
    formik.setFieldValue("deliveryRegions", list);
  }

  return (
    <div>
      <Modal
        title={
          payment.index === -1 ? "Add Delivery Fees" : "Edit Delivery Fees"
        }
        isOpen={showDialog}
      >
        <PaymentEditDialog
          payment={payment.data}
          list={formik.values.deliveryFees}
          index={payment.index}
          handleClose={(value) => {
            setShowDialog(false);
            if (value && value.length !== 0) {
              if (payment.index >= 0) {
                let list = [...formik.values.payments];
                list[payment.index] = value;
                formik.setFieldValue("payments", list);
              } else {
                let list = [...formik.values.payments];
                list.push(value);
                formik.setFieldValue("payments", list);
              }
            }
            setPayment({ data: undefined, index: -1 });
          }}
        />
      </Modal>
      <div>
        <form onSubmit={formik.handleSubmit}>
          {state.status === Actions.failure && (
            <Alert alertClass="alert-error mb-4" closeable>
              {parseError(state.error)}
            </Alert>
          )}

          <Card>
            <Card.Body>
              <div>
                <div>
                  <Input
                    label="Minimum Order Limit"
                    name="minimumOrderLimitPerProduct"
                    type="number"
                    placeholder="Enter minimum order limit"
                    value={formik.values.minimumOrderLimitPerProduct}
                    onChange={formik.handleChange}
                    error={formik.errors.name}
                  />
                </div>
                <div>
                  <div className="flex items-center mt-5 mb-2">
                    <h6 className="text-lg font-bold text-gray-900">
                      Payments
                    </h6>
                    <PrimaryOutlineButton
                      className="ml-auto"
                      small={true}
                      onClick={() => setShowDialog(true)}
                    >
                      <PlusIcon className="w-4 h-4 mr-2"></PlusIcon>
                      Add New
                    </PrimaryOutlineButton>
                  </div>
                  {formik.values.payments.length > 0 && (
                    <div className="col-span-2 border border-gray-300">
                      <div className="h-[300px] overflow-y-auto scrollbar-custom">
                        {formik.values.payments.map((p, i) => (
                          <div
                            key={i}
                            className="flex flex-1 p-[10px] items-center border-b border-b-gray-300"
                          >
                            <div className="w-60 md:w-full">{p.method}</div>
                            <div className="w-60">{p.number}</div>
                            <div className="w- 60 flex space-x-2">
                              <PrimaryButton
                                onClick={() => {
                                  setPayment({ data: p, index: i });
                                  setShowDialog(true);
                                }}
                              >
                                <PencilAltIcon className="w-4 h-4" />
                              </PrimaryButton>
                              <DangerButton
                                onClick={() => removeDeliveryFees(i)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </DangerButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex">
                <PrimaryButton
                  className="ml-auto"
                  type="submit"
                  disabled={
                    formik.isSubmitting || setting.status === Actions.loading
                  }
                  loading={formik.isSubmitting}
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

export default OrderSetting;
