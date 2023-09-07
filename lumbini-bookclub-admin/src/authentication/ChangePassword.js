import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { PasswordInput } from "../common/FormControls";
import { parseError } from "../common/utils";
import { changePassword } from "./AuthRepo";

function ChangePassword({ handleClose = () => {} }) {
  const [state, requestChange] = useAPIRequest(changePassword);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      let errors = {};
      if (
        !values.currentPassword ||
        values.currentPassword.trim().length === 0
      ) {
        errors.currentPassword = "Please enter current password.";
      }
      if (!values.newPassword || values.newPassword.trim().length === 0) {
        errors.newPassword = "Please enter new password.";
      } else if (values.newPassword.trim().length < 6) {
        errors.newPassword = "Password must be least 6 characters.";
      }

      if (
        !values.confirmPassword ||
        values.confirmPassword.trim().length === 0
      ) {
        errors.confirmPassword = "Please enter confirm password.";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      requestChange(values);
    },
  });

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("Your password changed successfully.");
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
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          placeholder="Enter current password"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          error={formik.errors.currentPassword}
        />
      </div>

      <div className="mb-4">
        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Minimum 6 characters"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={formik.errors.newPassword}
        />
      </div>

      <div className="mb-6">
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Re-enter new password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.errors.confirmPassword}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton
          type="submit"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Change
        </PrimaryButton>
        <DefaultButton disabled={formik.isSubmitting} onClick={handleClose}>
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export default ChangePassword;
