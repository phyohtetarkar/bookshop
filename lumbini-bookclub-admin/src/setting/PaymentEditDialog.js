import { useFormik } from "formik";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input } from "../common/FormControls";

function PaymentEditDialog({
  index,
  payment = { method: "", number: "" },
  handleClose,
  list = [],
}) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...payment },
    validate: (values) => {
      let errors = {};
      if (!values.method || values.method.trim().length === 0) {
        errors.method = "Please enter payment method.";
      }
      if (!values.number || values.number.trim().length === 0) {
        errors.number = "Please enter payment number.";
      }
      if (values.payment) {
        let i = list.findIndex(
          (t) =>
            t.method.toLowerCase().trim().replace(/\s+/g, "") ===
            values.method.toLowerCase().trim().replace(/\s+/g, "")
        );
        if (i !== index) {
          let duplicate = list.find(
            (t) =>
              t.method.toLowerCase().trim().replace(/\s+/g, "") ===
              values.method.toLowerCase().trim().replace(/\s+/g, "")
          );
          if (duplicate) {
            errors.payment = "Payment method already exits.";
          }
        }
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let d = { ...values };
      handleClose(d);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col mt-4">
      <div className="mb-6">
        <Input
          label="Payment Method *"
          name="method"
          placeholder="Enter payment method"
          value={formik.values.method}
          error={formik.errors.method}
          onChange={formik.handleChange}
        />
      </div>
      <div className="mb-6">
        <Input
          label="Payment Number *"
          name="number"
          placeholder="Enter payment number"
          value={formik.values.number}
          error={formik.errors.number}
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              formik.handleChange(e);
            }
          }}
        />
      </div>
      <div className="flex flex-row-reverse space-x-reverse space-x-2">
        <PrimaryButton type="submit">
          {index === -1 ? "Add" : "Change"}
        </PrimaryButton>
        <DefaultButton
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </DefaultButton>
      </div>
    </form>
  );
}

export default PaymentEditDialog;
