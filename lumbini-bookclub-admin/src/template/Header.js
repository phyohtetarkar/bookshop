import { Menu, Transition } from "@headlessui/react";
import { KeyIcon, LogoutIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Fragment, useContext, useEffect, useState } from "react";
import { logout } from "../authentication/AuthRepo";
import { AuthContext, LoadingContext } from "../common/Contexts";
import { Actions, useAPIRequest } from "../common/api-request";
import ChangePassword from "../authentication/ChangePassword";
import Modal from "../common/Modal";

const navBarHeight = 71;

function Header() {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [state, requestSignOut] = useAPIRequest(logout);
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    loadingContext.setLoading(state.status === Actions.loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <nav
      className="flex items-center space-x-4 shadow bg-white w-full px-5 absolute z-10"
      style={{ height: navBarHeight }}
    >
      {/* <div className="hidden md:inline-flex flex-1">
      <input
        type="text"
        className="lg:w-1/3 border border-r-0 border-gray-300 rounded-none rounded-l-md font-light focus:ring-0 focus:border-indigo-500"
        placeholder="Search..."
      />
      <button className="px-3 rounded-none rounded-r-md bg-indigo-600 hover:bg-indigo-700 text-indigo-200 focus:outline-none">
        <SearchIcon className="w-5 h-5" />
      </button>
    </div> */}

      <div className="flex-grow"></div>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <AuthContext.Consumer>
            {({ user }) => {
              return (
                <Menu.Button className="inline-flex justify-center w-full items-center text-gray-500 hover:text-gray-800 focus:outline-none">
                  <UserCircleIcon className="w-8 h-8" />
                  <div className="font-medium ml-2 mr-1 hidden sm:inline">
                    {user !== null && user.displayName}
                  </div>
                  <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                </Menu.Button>
              );
            }}
          </AuthContext.Consumer>
          {/* <Menu.Button className="inline-flex justify-center w-full items-center text-gray-500 hover:text-gray-800 focus:outline-none">
            <UserCircleIcon className="w-8 h-8" />
            <span className="font-medium ml-2 mr-1">Super User</span>
            <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
          </Menu.Button> */}
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenChangePassword(true)}
                    className={`dropdown-item ${active ? "active" : ""}`}
                  >
                    <KeyIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                    Change Password
                  </button>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <button className={`dropdown-item ${active ? "active" : ""}`}>
                    <AdjustmentsIcon
                      className="w-5 h-5 mr-2"
                      aria-hidden="true"
                    />
                    Setting
                  </button>
                )}
              </Menu.Item> */}
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`dropdown-item ${active ? "active" : ""}`}
                    onClick={() => requestSignOut()}
                  >
                    <LogoutIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <Modal title="Change Password" isOpen={openChangePassword}>
        <ChangePassword handleClose={() => setOpenChangePassword(false)} />
      </Modal>
    </nav>
  );
}

export default Header;
