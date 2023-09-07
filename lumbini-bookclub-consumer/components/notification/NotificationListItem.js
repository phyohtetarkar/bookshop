import { formatTimestamp } from "../../common/utils";

function NotificationListItem({ data = {} }) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="vstack">
          <h5 className="">{data.title}</h5>
          <p className="text-muted mb-0">{data.description}</p>
        </div>
      </div>
      <div className="card-footer">
        <div className="text-muted">
          <small>{formatTimestamp(data.createdAt)}</small>
        </div>
      </div>
    </div>
  );
}

export default NotificationListItem;
