import { useState } from "react";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input } from "../common/FormControls";

function AddPhoneNoDialog({ handleClose }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState();

  function addPhone() {
    setError(null);
    if (!phone || phone.trim().length === 0) {
      setError("Please enter phone number.");
      return;
    }
    handleClose(phone);
  }
  return (
    <div>
      <form className="flex flex-col mt-4">
        <div className="mb-6">
          <Input
            label="Phone No"
            name="phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => {
              if (!isNaN(e.target.value)) {
                setPhone(e.target.value);
              }
            }}
            error={error}
          />
        </div>
        <div className="flex flex-row-reverse space-x-reverse space-x-2">
          <PrimaryButton onClick={addPhone}>Add</PrimaryButton>
          <DefaultButton onClick={handleClose}>Cancel</DefaultButton>
        </div>
      </form>
    </div>
  );
}

export default AddPhoneNoDialog;
