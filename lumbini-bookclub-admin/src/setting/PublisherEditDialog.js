import { useState } from "react";
import { DefaultButton, PrimaryButton } from "../common/Buttons";
import { Input } from "../common/FormControls";

function PublisherEditDialog({ handleClose, list = [] }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState();

  function addPublisher() {
    if (!value || value.trim().length === 0) {
      setError("Please enter publisher name.");
      return;
    } else {
      let duplicate = checkDuplicate(list);
      if (duplicate) {
        setError("Publisher already exists.");
        return;
      }
    }
    handleClose(value);
  }

  function checkDuplicate(list) {
    return list.find(
      (s) =>
        s.toLowerCase().trim().replace(/\s+/g, "") ===
        value.toLowerCase().trim().replace(/\s+/g, "")
    );
  }

  return (
    <div>
      <form className="flex flex-col mt-4" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6">
          <Input
            label="Publisher"
            name="publisher"
            placeholder="Enter publisher name"
            value={value}
            error={error}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            type="text"
          />
        </div>
        <div className="flex flex-row-reverse space-x-reverse space-x-2">
          <PrimaryButton onClick={addPublisher}>Add</PrimaryButton>
          <DefaultButton
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </DefaultButton>
        </div>
      </form>
    </div>
  );
}

export default PublisherEditDialog;
