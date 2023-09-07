import { useEffect, useState } from "react";
import { pageSizeLimit } from "./app.config";

function Pagination({
  query,
  list = [],
  onPrev = (id) => {},
  onNext = (id) => {},
  hasPrev,
  hasNext,
}) {
  const [paging, setPaging] = useState({
    top: null,
    end: null,
  });

  useEffect(() => {
    if (!query.first && !query.last) {
      setPaging({
        top: null,
        end: null,
      });
    }
  }, [query]);

  useEffect(() => {
    if (list.length > 0) {
      const top = list[0].id;
      const end = list[list.length - 1].id;
      setPaging({
        top: top,
        end: end,
      });
    } else {
      setPaging((old) => ({ top: null, end: null }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  if (list.length === 0) {
    return null;
  }

  if (!hasPrev && list.length < pageSizeLimit) {
    return null;
  }

  if (!hasNext && !hasPrev) {
    return null;
  }

  return (
    <nav className="page-container" aria-label="Pagination">
      {!hasPrev ? (
        <span className={"page-nav disabled select-none"}>Prev</span>
      ) : (
        <button
          className={"page-nav"}
          onClick={() => {
            onPrev(paging.top);
          }}
        >
          Prev
        </button>
      )}

      {!hasNext ? (
        <span className={"page-nav disabled select-none"}>Next</span>
      ) : (
        <button
          className={"page-nav"}
          onClick={() => {
            onNext(paging.end);
          }}
        >
          Next
        </button>
      )}
    </nav>
  );
}

export default Pagination;
