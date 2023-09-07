import { useFormik } from "formik";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input } from "../common/FormControls";

function UpdateDeliveryFee({ fee = "", handleClose }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { fee: fee },
    validate: (values) => {
      let errors = {};
      if (!values.fee || values.fee.trim().length === 0) {
        errors.fee = "Please enter delivery fee.";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      formik.setSubmitting(false);
      handleClose(parseInt(values.fee.trim()));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      <div className="mb-6">
        <Input
          label="Delivery Fee"
          name="fee"
          placeholder="Enter delivery fee"
          value={formik.values.fee}
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              formik.handleChange(e);
            }
          }}
          error={formik.errors.fee}
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

export default UpdateDeliveryFee;
