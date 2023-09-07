import { Tab } from "@headlessui/react";
import Card from "../common/Card";
import GeneralSetting from "./GeneralSetting";
import OrderSetting from "./OrderSetting";
import ProductSetting from "./ProductSetting";

const tabList = ["General Setting", "Product Setting", "Order Setting"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Settings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <Tab.Group>
            <Card.Header withTab={true}>
              <Tab.List className="flex overflow-clip -mb-[1.1px]">
                {tabList.map((tab, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) =>
                      classNames(
                        "text-lg font-medium mr-2 px-4 py-2 truncate focus:outline-none",
                        selected
                          ? "text-gray-900 bg-white border-t border-r border-l rounded-t"
                          : "text-gray-600 hover:text-gray-900"
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
            </Card.Header>
            <Tab.Panels>
              <Tab.Panel>
                <GeneralSetting />
              </Tab.Panel>
              <Tab.Panel>
                <ProductSetting />
              </Tab.Panel>
              <Tab.Panel>
                <OrderSetting />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
