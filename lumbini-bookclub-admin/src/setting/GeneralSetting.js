import { PlusIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
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
import PhoneNumberEditDialog from "./PhoneNumberEditDialog";
import { getGeneralSetting, saveGeneralSetting } from "./SettingRepo";

const initialSetting = {
  aboutUs: "",
  termsAndConditions: "",
  appStoreUrl: "",
  playStoreUrl: "",
  contact: {
    phoneNumbers: [],
    email: "",
    address: "",
    location: {
      lat: "",
      lon: "",
    },
  },
  socialMedias: {
    facebook: "",
    twitter: "",
    instagram: "",
    messengerUrl: "",
  },
};

function GeneralSetting() {
  const [showDialog, setShowDialog] = useState(false);

  const [state, requestSave] = useAPIRequest(saveGeneralSetting);
  const [setting, requestSetting] = useAPIRequest(getGeneralSetting);

  const loadingContext = useContext(LoadingContext);

  const [generalSetting, setGeneralSetting] = useState(initialSetting);

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
      setGeneralSetting(payLoad ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("General setting saved successfully.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...generalSetting },
    onSubmit: (values) => {
      requestSave(values);
    },
  });

  function removePhone(i) {
    let list = [...formik.values.contact.phoneNumbers];
    list.splice(i, 1);
    formik.setFieldValue("contact.phoneNumbers", list);
  }

  return (
    <div>
      <Modal title="Add Phone Number" isOpen={showDialog}>
        <PhoneNumberEditDialog
          handleClose={(value) => {
            setShowDialog(false);
            if (value && value.length !== 0) {
              let list = [...formik.values.contact.phoneNumbers];
              list.push(value);
              formik.setFieldValue("contact.phoneNumbers", list);
            }
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
              <h6 className="text-lg font-bold text-gray-900">Contact Info</h6>
              <hr className="mt-1 mb-3" />
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Email"
                    name="contact.email"
                    type="email"
                    placeholder="Enter email address"
                    value={formik.values.contact.email}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-span-2">
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
                  <div className="flex flex-wrap">
                    {formik.values.contact.phoneNumbers.map((p, i) => (
                      <Chip.Default key={i} className="mr-2 mb-2">
                        {p}
                        <Chip.DeleteAction onClick={() => removePhone(i)} />
                      </Chip.Default>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    label="Location"
                    name="contact.location.lat"
                    type="text"
                    placeholder="Enter latitude"
                    value={formik.values.contact.location.lat}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    label="&nbsp;"
                    name="contact.location.lon"
                    type="text"
                    placeholder="Enter longitude"
                    value={formik.values.contact.location.lon}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <TextArea
                    label="Address"
                    name="contact.address"
                    placeholder="Enter address"
                    rows={6}
                    value={formik.values.contact.address}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <h6 className="text-lg font-bold text-gray-900 mt-5">
                Social Setting
              </h6>
              <hr className="mt-1 mb-3" />
              <div className="grid lg:grid-cols-1 gap-4">
                <div>
                  <Input
                    label="Facebook"
                    name="socialMedias.facebook"
                    placeholder="Enter facebook url"
                    value={formik.values.socialMedias.facebook}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <Input
                    label="Twitter"
                    name="socialMedias.twitter"
                    placeholder="Enter twitter url"
                    value={formik.values.socialMedias.twitter}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <Input
                    label="Instagram"
                    name="socialMedias.instagram"
                    placeholder="Enter instagram url"
                    value={formik.values.socialMedias.instagram}
                    onChange={formik.handleChange}
                  />
                </div>

                <div>
                  <Input
                    label="Messenger Link"
                    name="socialMedias.messengerUrl"
                    placeholder="https://m.me/facebookpagename"
                    value={formik.values.socialMedias.messengerUrl}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <h6 className="text-lg font-bold text-gray-900 mt-5">
                App Setting
              </h6>
              <hr className="mt-1 mb-3" />
              <div className="grid lg:grid-cols-1 gap-4">
                <div>
                  <Input
                    label="App Store Url"
                    name="appStoreUrl"
                    placeholder="Enter app store download url"
                    value={formik.values.appStoreUrl}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <Input
                    label="Play Store Url"
                    name="playStoreUrl"
                    placeholder="Enter play store download url"
                    value={formik.values.playStoreUrl}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <h6 className="text-lg font-bold text-gray-900 mt-5">
                Front-end Setting
              </h6>
              <hr className="mt-1 mb-3" />
              <div className="grid lg:grid-cols-1 gap-2">
                <div>
                  <TextArea
                    label="About Us"
                    name="aboutUs"
                    placeholder="Enter about us"
                    rows={6}
                    value={formik.values.aboutUs}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <TextArea
                    label="Terms and Conditions"
                    name="termsAndConditions"
                    placeholder="Enter terms and conditions"
                    rows={6}
                    value={formik.values.termsAndConditions}
                    onChange={formik.handleChange}
                  />
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

export default GeneralSetting;
