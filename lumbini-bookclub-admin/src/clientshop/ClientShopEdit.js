import { PlusIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { PrimaryButton, PrimaryOutlineButton } from "../common/Buttons";
import Card from "../common/Card";
import { Chip } from "../common/Chips";
import { LoadingContext } from "../common/Contexts";
import { Input, TextArea } from "../common/FormControls";
import Modal from "../common/Modal";
import { parseError } from "../common/utils";
import AddPhoneNoDialog from "./AddPhoneNoDialog";
import { getClientShop, saveClientShop } from "./ClientShopRepo";

function ClientShopEdit() {
  let params = useParams();
  let navigate = useNavigate();
  const [state, requestSave] = useAPIRequest(saveClientShop);
  const [dataState, requestData] = useAPIRequest(getClientShop);

  const loadingContext = useContext(LoadingContext);
  const [showDialog, setShowDialog] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [initialValue, setInitialValue] = useState({
    id: undefined,
    name: "",
    township: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (params.id) {
      requestData({ id: params.id });
    }

    return () => {
      loadingContext.setLoading(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    loadingContext.setLoading(dataState.status === Actions.loading);
    if (!dataState.error && dataState.payload) {
      setPhoneNumbers(dataState.payload.phoneNumbers);
      setInitialValue(dataState.payload);
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
      navigate("/client-shops", { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValue },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter shop name.";
      }
      // if (!values.township || values.township.trim().length === 0) {
      //   errors.township = "Please enter township name.";
      // }
      // if (!values.city || values.city.trim().length === 0) {
      //   errors.city = "Please enter city name.";
      // }
      if (!values.address || values.address.trim().length === 0) {
        errors.address = "Please enter address.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let cs = { ...values };
      cs["phoneNumbers"] = [...phoneNumbers];
      //console.log(cs);
      requestSave(cs);
    },
  });

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      navigate("/client-shops");
      toast.success("Client shop saved successfully.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function addPhoneNo(value) {
    if (value && value.length > 0) {
      let phList = [...phoneNumbers, value];
      setPhoneNumbers(phList);
    }
    setShowDialog(false);
  }

  function handleRemove(i) {
    const phList = [...phoneNumbers];
    phList.splice(i, 1);
    setPhoneNumbers(phList);
  }

  return (
    <div>
      <Modal title="Add Phone Number" isOpen={showDialog}>
        <AddPhoneNoDialog handleClose={addPhoneNo} />
      </Modal>
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form onSubmit={formik.handleSubmit}>
            <Card>
              {state.status === Actions.failure && (
                <Alert alertClass="alert-error mb-4" closeable>
                  {parseError(state.error)}
                </Alert>
              )}
              <Card.Header>
                <div className="flex items-center">
                  <h3 className="text-gray-600">{`${
                    params.id ? "Update" : "Add"
                  } Client Shop`}</h3>
                  <PrimaryButton
                    type="submit"
                    disabled={
                      formik.isSubmitting ||
                      dataState.status === Actions.loading
                    }
                    loading={formik.isSubmitting}
                    className="ml-auto"
                  >
                    Save
                  </PrimaryButton>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-2">
                    <Input
                      label="Name *"
                      name="name"
                      placeholder="Enter shop name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.errors.name}
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <Input
                      label="City"
                      name="city"
                      placeholder="Enter city name"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      error={formik.errors.city}
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <Input
                      label="Township"
                      name="township"
                      placeholder="Enter township name"
                      value={formik.values.township}
                      onChange={formik.handleChange}
                      error={formik.errors.township}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center mb-2">
                      <h6 className="font-medium text-gray-900">Phone No</h6>
                      <PrimaryOutlineButton
                        className="ml-auto"
                        small={true}
                        onClick={() => {
                          setShowDialog(true);
                        }}
                      >
                        <PlusIcon className="w-4 h-4 mr-2"></PlusIcon>
                        Add New
                      </PrimaryOutlineButton>
                    </div>
                    <hr className="mb-2" />
                    <div className="flex flex-wrap">
                      {phoneNumbers.map((p, i) => (
                        <Chip.Default key={i} className="mr-2 mb-2">
                          {p}
                          <Chip.DeleteAction onClick={() => handleRemove(i)} />
                        </Chip.Default>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <TextArea
                      label="Address *"
                      name="address"
                      placeholder="Enter street address"
                      rows={6}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      error={formik.errors.address}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ClientShopEdit;
