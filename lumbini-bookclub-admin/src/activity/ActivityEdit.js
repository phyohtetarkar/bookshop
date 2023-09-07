import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { Input } from "../common/FormControls";
import { parseError } from "../common/utils";
import ActivityCover from "./ActivityCover";
import { getActivity, saveActivity } from "./ActivityRepo";

function ActivityEdit() {
  const params = useParams();
  const navigate = useNavigate();

  const [state, requestSave] = useAPIRequest(saveActivity);
  const [dataState, requestData] = useAPIRequest(getActivity);

  const loadingContext = useContext(LoadingContext);
  const [initialValue, setInitialValue] = useState({
    id: undefined,
    title: "",
    cover: "",
    body: "",
    file: undefined,
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
    if (dataState.status === Actions.success) {
      setInitialValue(dataState.payload);
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
      navigate("/activities", { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValue },
    validate: (values) => {
      let errors = {};
      if (!values.title || values.title.trim().length === 0) {
        errors.title = "Please enter title.";
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      requestSave(values);
    },
  });

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      navigate("/activities");
      toast.success("Activity saved successfully.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
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
            } Activity`}</h3>
            <PrimaryButton
              type="submit"
              disabled={
                formik.isSubmitting || dataState.status === Actions.loading
              }
              loading={formik.isSubmitting}
              className="ml-auto"
            >
              Save
            </PrimaryButton>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Editor
                tinymceScriptSrc={`${
                  window.location.protocol + "//" + window.location.host
                }/tinymce/tinymce.min.js`}
                value={formik.values.body}
                onEditorChange={(newValue, editor) =>
                  formik.setFieldValue("body", newValue)
                }
                init={{
                  height: 480,
                  menubar: false,
                  plugins: [
                    "preview",
                    "fullscreen",
                    "wordcount",
                    "link",
                    "lists",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic link | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | fullscreen",
                }}
              />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="mb-4">
                <Input
                  label="Title *"
                  name="title"
                  placeholder="Enter title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.errors.title}
                ></Input>
              </div>
              <div>
                <label className="form-control-label">Cover</label>
                <ActivityCover
                  cover={formik.values.cover}
                  onFileChange={(file) => formik.setFieldValue("file", file)}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </form>
  );
}
export default ActivityEdit;
