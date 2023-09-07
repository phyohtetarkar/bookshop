import { useFormik } from "formik";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { TextArea } from "../common/FormControls";

function UpdateOrderAddress({ address = "", handleClose }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { address: address },
    validate: (values) => {
      let errors = {};
      if (!values.address || values.address.trim().length === 0) {
        errors.address = "Please enter delivery address.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      formik.setSubmitting(false);
      handleClose(values.address);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      <div className="mb-6">
        <TextArea
          label="Address"
          name="address"
          rows={4}
          placeholder="Enter delivery address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.errors.address}
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
        <DefaultButton
          disabled={formik.isSubmitting}
          onClick={() => handleClose(null)}
        >
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export default UpdateOrderAddress;
