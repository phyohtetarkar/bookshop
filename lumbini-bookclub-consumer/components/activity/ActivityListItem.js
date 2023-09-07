import Link from "next/link";
import { baseImagbaePath } from "../../common/app.config";
import { formatTimestamp } from "../../common/utils";

function ActivityListItem({ data = {} }) {
  let detailPath = `/activities/${data.id}`;

  return (
    <div className="card shadow-sm h-100 border-0">
      <Link href={detailPath}>
        <a className="text-decoration-none">
          <div
            className="position-relative"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="ratio ratio-16x9 rounded bg-light">
              <img
                src={`${baseImagbaePath}/activities%2F${data.cover}?alt=media`}
                alt="Activity image."
                className="rounded-top"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </a>
      </Link>

      <div className="card-body">
        <div className="vstack">
          <Link href={detailPath}>
            <a
              className="fw-semibold text-decoration-none text-truncate"
              style={{ color: "black" }}
            >
              {data.title}
            </a>
          </Link>
          <label
            className="pt-2"
            style={{ color: "gray", fontSize: 14, fontWeight: 500 }}
          >
            {formatTimestamp(data.createdAt, false)}
          </label>
        </div>
      </div>
    </div>
  );
}

export default ActivityListItem;
