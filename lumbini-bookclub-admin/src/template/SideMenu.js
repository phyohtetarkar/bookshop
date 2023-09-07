import { Disclosure, Popover, Transition } from "@headlessui/react";
import {
  BellIcon,
  BookOpenIcon,
  ChevronRightIcon,
  CogIcon,
  HomeIcon,
  InboxInIcon,
  TagIcon,
  TemplateIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { usePopper } from "react-popper";
import { NavLink } from "react-router-dom";

const headerHeight = 72;
// const categoryMenus = [
//   { path: "/categories", title: "Categories" },
//   { path: "/sub-categories", title: "Sub Categories" },
// ];

// eslint-disable-next-line no-unused-vars
function SideMenuDisclosure({ list = [], children }) {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const [arrowElement, setArrowElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    strategy: "absolute",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const navLinks = list.map((e) => {
    return (
      <NavLink
        key={e.path}
        to={e.path}
        replace={true}
        className={({ isActive }) =>
          `hover:text-black py-3 ${isActive ? "text-black" : "text-gray-500"}`
        }
      >
        <span className="">{e.title}</span>
      </NavLink>
    );
  });

  return (
    <>
      <div className="lg:hidden">
        <Popover>
          <Popover.Button
            ref={setReferenceElement}
            as="a"
            className="my-4 side-menu-item cursor-pointer"
          >
            {children}
          </Popover.Button>

          <Popover.Panel
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="drop-shadow-2xl z-50"
          >
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <div ref={setArrowElement} style={styles.arrow} className="">
                <div className="bg-white rotate-45 w-5 h-5  ml-3"></div>
              </div>
              <div className="bg-white rounded px-5 py-2 ml-4">
                <div className="flex flex-col">{navLinks}</div>
              </div>
            </Transition>
          </Popover.Panel>
        </Popover>
      </div>
      <div className="hidden lg:inline">
        <Disclosure>
          {({ open }) => {
            return (
              <>
                <Disclosure.Button
                  className="my-4 side-menu-item cursor-pointer"
                  as="a"
                >
                  {children}
                  <ChevronRightIcon
                    className={`w-5 h-5 transition-transform flex-none ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`px-4 py-1 bg-gray-100 mx-3 rounded flex flex-col divide-y`}
                >
                  {navLinks}
                </Disclosure.Panel>
              </>
            );
          }}
        </Disclosure>
      </div>
    </>
  );
}

function SideMenu() {
  return (
    <div className="bg-gray-800 overflow-x-hidden h-screen scrollbar-none">
      <div
        className="absolute w-full flex lg:space-x-3 justify-center lg:justify-start lg:px-3 border-b border-gray-900 items-center bg-gray-800"
        style={{ height: headerHeight }}
      >
        <BookOpenIcon className="w-10 h-10 lg:w-10 lg:h-10 text-gray-300 flex-none" />
        {/* <img src="/logo-precise.png" alt="Logo" className="w-16 aspect-auto" /> */}
        <h3 className="hidden lg:inline text-white text-opacity-90 mb-0">
          {process.env.REACT_APP_APP_NAME}
        </h3>
      </div>

      <div className="mt-[84px] mb-5">
        <ul className="lg:mt-2 lg:space-y-3 h-min">
          <NavLink
            to="/"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <HomeIcon className="icon" />
            <span className="hidden lg:inline">Dashboard</span>
          </NavLink>

          <div className="my-3 lg:my-5 border-b border-gray-900 block"></div>

          {/* <SideMenuDisclosure list={categoryMenus}>
          <TagIcon className="icon" />
          <span className="hidden lg:inline flex-grow">Categories</span>
        </SideMenuDisclosure> */}
          <NavLink
            to="/banners"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <TemplateIcon className="icon" />
            <span className="hidden lg:inline flex-grow">Banners</span>
          </NavLink>

          <NavLink
            to="/categories"
            replace={true}
            className={({ isActive }) =>
              `my-4 side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <TagIcon className="icon" />
            <span className="hidden lg:inline flex-grow">Categories</span>
          </NavLink>

          <NavLink
            to="/authors"
            replace={true}
            className={({ isActive }) =>
              `my-4 side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <UserIcon className="icon" />
            <span className="hidden lg:inline flex-grow">Authors</span>
          </NavLink>

          <NavLink
            to="/books"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <BookOpenIcon className="icon" />
            <span className="hidden lg:inline">Books</span>
          </NavLink>

          <NavLink
            to="/orders"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <InboxInIcon className="icon" />
            <span className="hidden lg:inline">Orders</span>
          </NavLink>

          <NavLink
            to="/app-notifications"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <BellIcon className="icon" />
            <span className="hidden lg:inline">App Notifications</span>
          </NavLink>

          <div className="my-3 lg:my-5 border-b border-gray-900 block"></div>

          <NavLink
            to="/settings"
            replace={true}
            className={({ isActive }) =>
              `side-menu-item ${isActive ? "active" : ""}`
            }
          >
            <CogIcon className="icon" />
            <span className="hidden lg:inline">Settings</span>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
