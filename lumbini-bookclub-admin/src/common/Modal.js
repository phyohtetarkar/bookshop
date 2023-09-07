import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DefaultButton, PrimaryButton } from "./Buttons";

export function ConfirmModal({
  message,
  isOpen,
  handleClose = (result) => {},
}) {
  return (
    <Modal title="Confirm" isOpen={isOpen}>
      <div className="flex flex-col mt-4">
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex flex-row-reverse space-x-reverse space-x-2">
          <PrimaryButton onClick={() => handleClose(true)}>
            Confirm
          </PrimaryButton>
          <DefaultButton onClick={() => handleClose(false)}>
            Cancel
          </DefaultButton>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ title, isOpen, onClose = () => {}, children }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />

          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span
            className="inline-block h-screen align-top"
            aria-hidden="true"
          >
            &#8203;
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
              <Dialog.Title
                as="h3"
                className="text-xl font-semibold leading-6 text-gray-700 mb-3"
              >
                {title}
              </Dialog.Title>

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
