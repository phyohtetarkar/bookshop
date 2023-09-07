import { useEffect, useRef } from "react";

function Body({ children }) {
  return <div className="modal-body">{children}</div>;
}

function Footer({ children }) {
  return <div className="modal-footer">{children}</div>;
}

function Modal({ id, title, visible, handleClose = () => {}, children }) {
  const stateRef = useRef();
  const openRef = useRef();
  const closeRef = useRef();

  useEffect(() => {
    if (visible && !stateRef.current) {
      openRef.current?.click();
    } else if (!visible) {
      closeRef.current?.click();
    }

    stateRef.current = visible;
  }, [visible]);

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              {title ?? ""}
            </h5>
            <button
              type="button"
              className="btn-close shadow-none"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          {children}
          <button
            ref={openRef}
            className="d-none"
            data-bs-toggle="modal"
            data-bs-target={`#${id}`}
          ></button>
          <button
            ref={closeRef}
            className="d-none"
            data-bs-dismiss="modal"
            data-bs-target={`#${id}`}
          ></button>
        </div>
      </div>
    </div>
  );
}

Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
