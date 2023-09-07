import { useFormik } from "formik";
import { useEffect } from "react";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input, TextArea } from "../common/FormControls";
import { parseError } from "../common/utils";
import { saveNotification } from "./NotificationRepo";

function NotificationCreate({
  notification = { title: "", description: "" },
  handleClose,
}) {
  const [state, requestSave] = useAPIRequest(saveNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...notification },
    validate: (values) => {
      let errors = {};
      if (!values.title || values.title.trim().length === 0) {
        errors.title = "Please enter title.";
      }
      if (!values.description || values.description.trim().length === 0) {
        errors.description = "Please enter description.";
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
      handleClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      {state.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(state.error)}
        </Alert>
      )}

      <div className="mb-4">
        <Input
          label="Title *"
          name="title"
          placeholder="Enter title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.errors.title}
        />
      </div>
      <div className="mb-6">
        <TextArea
          label="Description *"
          name="description"
          placeholder="Message here..."
          rows={6}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.errors.description}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton
          type="submit"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Push
        </PrimaryButton>
        <DefaultButton onClick={handleClose} disabled={formik.isSubmitting}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export default NotificationCreate;
