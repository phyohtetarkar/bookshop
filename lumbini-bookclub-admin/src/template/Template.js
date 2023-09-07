import { LoadingContext } from "../common/Contexts";
import PrivateOutlet from "../common/PrivateOutlet";
import Spinner from "../common/Spinner";
import Footer from "./Footer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { ToastContainer } from "react-toastify";

function Template(props) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-0 h-full">
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <div className="relative">
          <SideMenu />
        </div>
      </div>
      <div className="col-span-5 md:col-span-11 lg:col-span-10 h-full">
        <div className="relative">
          <Header />
          <div className="overflow-y-auto h-screen flex flex-col">
            <div className="flex-shrink-0 p-5" style={{ marginTop: 72 }}>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                theme="colored"
              />
              <PrivateOutlet />
            </div>
            <div className="mt-auto"></div>

            <Footer />
          </div>

          <LoadingContext.Consumer>
            {({ loading, setLoading }) => {
              if (loading) {
                return (
                  <div
                    className="absolute bottom-0 right-0 mr-6 p-3 shadow-lg bg-gray-700 rounded-md"
                    style={{ marginBottom: 48 }}
                  >
                    <Spinner />
                  </div>
                );
              }
            }}
          </LoadingContext.Consumer>
        </div>
      </div>
    </div>
  );
}

export default Template;
