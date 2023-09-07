import { useEffect, useState } from "react";
import useSWR from "swr";
import { pageSizeLimit } from "../../common/app.config";
import { useLocalization } from "../../common/localization";
import ActivityListItem from "../../components/activity/ActivityListItem";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { getActivities } from "../../repo/ActivityRepo";

function ActivityList() {
  const { localize } = useLocalization();
  const [list, setList] = useState([]);
  const [pageEnd, setPageEnd] = useState(false);
  const [query, setQuery] = useState({ last: null });

  const { data, error } = useSWR([query, "/activities"], getActivities, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Activities`;
  });

  useEffect(() => {
    setList([]);
  }, []);

  useEffect(() => {
    if (data) {
      setList((old) => [...old, ...data]);
      setPageEnd(data.length < pageSizeLimit);
    }
  }, [data]);

  function loadMore() {
    if (list.length === 0 || pageEnd) {
      return;
    }

    const last = list[list.length - 1];

    setQuery({ last: last.id });
  }

  let content = <Loading />;

  if (error) {
    content = <ErrorMessage error={error} />;
  } else if (list && list && list.length > 0) {
    content = (
      <>
        <h4 className="fw-semibold my-3">{localize("activities")}</h4>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 pb-2">
          {list.map((e, i) => {
            return (
              <div className="col" key={i}>
                <ActivityListItem data={e} />
              </div>
            );
          })}
        </div>

        {!pageEnd && data && !error && (
          <div className="d-flex justify-content-center py-4">
            <button
              className="btn btn-outline-primary rounded-pill px-3"
              onClick={loadMore}
            >
              Load more items
            </button>
          </div>
        )}

        {!data && !error && <Loading />}
      </>
    );
  } else if (data && !error && list.length === 0) {
    content = (
      <div className="text-muted text-center py-3">No activities found.</div>
    );
  }

  return <div className="container pt-3 pb-5">{content}</div>;
}

export default ActivityList;
