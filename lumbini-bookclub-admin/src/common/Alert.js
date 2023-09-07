import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";

function Alert({
  alertClass = "alert-success",
  closeable,
  onClosed = () => {},
  children,
}) {
  const [isClosed, setClosed] = useState(false);

  if (isClosed) {
    return null;
  }

  return (
    <div className={"flex items-center " + alertClass}>
      {children}
      <div className="ml-2"></div>
      {closeable && (
        <button
          className="ml-auto"
          onClick={() => {
            onClosed();
            setClosed(true);
          }}
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
