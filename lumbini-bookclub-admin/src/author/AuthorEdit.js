import { useFormik } from "formik";
import { useEffect } from "react";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input } from "../common/FormControls";
import { parseError } from "../common/utils";
import { saveAuthor } from "./AuthorRepo";

function AuthorEdit({ author = { name: "" }, handleClose }) {
  const [state, requestSave] = useAPIRequest(saveAuthor);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...author },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter author name.";
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

      <div className="mb-6">
        <Input
          label="Name"
          name="name"
          placeholder="Enter author name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton
          type="submit"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Save
        </PrimaryButton>
        <DefaultButton disabled={formik.isSubmitting} onClick={handleClose}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export default AuthorEdit;
