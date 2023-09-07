import { faPhoneSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ClientShopListItem(data = {}) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="vstack">
          <h5>{data.data.name}</h5>
          {data.data.phoneNumbers && data.data.phoneNumbers.length > 0 && (
            <div className="hstack mb-3">
              <FontAwesomeIcon
                icon={faPhoneSquare}
                size="sm"
                className="me-2 text-muted"
              />
              <small className="text-muted">
                {data.data.phoneNumbers.join(", ")}
              </small>
            </div>
          )}
          <div className="text-muted">
            {`${data.data.address} ${
              !data.data.township ? "" : data.data.township
            }${!data.data.city ? "" : `, ${data.data.city}`}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientShopListItem;
