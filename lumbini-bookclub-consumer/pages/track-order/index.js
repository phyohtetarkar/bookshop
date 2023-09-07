import { useEffect, useState } from "react";
import { useLocalization } from "../../common/localization";
import Loading from "../../components/Loading";
import TrackOrderCard from "../../components/track-order/TrackOrderCard";
import { getOrder } from "../../repo/OrderRepo";

function TrackOrder() {
  const { localize } = useLocalization();
  const [orderNumber, setOrderNumber] = useState("");
  const [dataState, setDataState] = useState({
    order: null,
    error: null,
    fetching: false,
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Track Order`;
  });

  const find = async () => {
    return await getOrder(orderNumber);
  };

  const searchOrder = (event) => {
    event.preventDefault();
    if (!orderNumber && !orderNumber.length > 0) {
      return;
    }
    setDataState({
      order: null,
      error: null,
      fetching: true,
    });
    find()
      .then((o) => {
        setDataState({ order: o, error: null, fetching: false });
      })
      .catch((e) => {
        setDataState({ order: null, error: e.message, fetching: false });
      });
  };

  return (
    <div className="container py-3">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="my-3">{localize("track_order")}</h4>
          <form
            className="d-flex align-items-center flex-nowrap justify-content-start"
            onSubmit={searchOrder}
          >
            <div className="input-group w-auto">
              <input
                type="search"
                name="orderNumber"
                className="form-control"
                placeholder={localize("order_number")}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                }}
              />
              <button
                className="btn btn-primary shadow-none py-2"
                type="submit"
              >
                {localize("search")}
              </button>
            </div>
          </form>
        </div>
      </div>
      {dataState.fetching && <Loading />}
      {dataState.error && (
        <div className="text-center"> {dataState.error} </div>
      )}
      {dataState.order && <TrackOrderCard data={dataState.order} />}
    </div>
  );
}

export default TrackOrder;
