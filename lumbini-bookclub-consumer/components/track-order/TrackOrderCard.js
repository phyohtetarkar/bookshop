import { formatPrice, formatTimestamp } from "../../common/utils";
import ReviewCartItem from "../confirm-checkout/ReviewCartItem";

function TrackOrderCard({ data }) {
  const order = { ...data };
  let color = "text-muted";
  if (
    order.status === "PENDING" ||
    order.status === "CONFIRMED" ||
    order.status === "DELIVERING"
  ) {
    color = "text-warning";
  } else if (order.status === "COMPLETED") {
    color = "text-success";
  } else if (order.status === "CANCELLED") {
    color = "text-danger";
  }
  return (
    <div className="mb-5">
      <div className="card mb-3 h-100">
        <div className="card-header py-3 bg-white">
          <div className="col d-flex align-items-center">
            <span className="fw-bold h5 mb-0 ms-1">{order.orderNumber}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <h4 className="fw-semibold">Delivery Info</h4>
              <div className="vstack text-muted small">
                <div>
                  Name:&nbsp;
                  <span className="text-dark fw-semibold">
                    {order.customer}
                  </span>
                </div>
                <div>
                  Phone:&nbsp;
                  <span className="text-dark fw-semibold">
                    {order.phoneNumber}
                  </span>
                </div>
                <div>
                  Address:&nbsp;
                  <span className="text-dark fw-semibold">{order.address}</span>
                </div>
                <div>
                  Note:&nbsp;
                  <span className="text-dark fw-semibold">
                    {order.note ? order.note : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="fw-semibold">Payment Info</h4>
              <div className="vstack text-muted small">
                <div>
                  Total Products:&nbsp;
                  <span className="text-dark fw-semibold">
                    {order.totalProduct}
                  </span>
                </div>
                <div>
                  Subtotal:&nbsp;
                  <span className="text-dark fw-semibold">
                    {formatPrice(order.subtotal)}Ks
                  </span>
                </div>
                <div>
                  Discount:&nbsp;
                  <span className="text-danger fw-semibold">
                    -{formatPrice(order.discount)}Ks
                  </span>
                </div>
                <div>
                  Delivery Fee:&nbsp;
                  <span className="text-success fw-semibold">
                    +{formatPrice(order.deliveryFee)}Ks
                  </span>
                </div>
                <div>
                  Total Price:&nbsp;
                  <span className="text-dark fw-semibold">
                    {formatPrice(order.totalPrice)}Ks
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <h4 className="fw-semibold">Status</h4>
              <div className="vstack small fw-semibold">
                <span className={color}>{order.status}</span>
              </div>
            </div>
          </div>
          <hr className="text-muted" />
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {order.items &&
              order.items.map((p, i) => <ReviewCartItem key={i} data={p} />)}
          </div>
        </div>
        <div className="card-footer small border-0 py-3 text-muted">
          <div>
            Order Date:&nbsp;
            <span className="fw-semibold">
              {formatTimestamp(order.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderCard;
