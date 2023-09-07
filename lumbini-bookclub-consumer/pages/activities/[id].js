import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { baseImagbaePath } from "../../common/app.config";
import { formatTimestamp } from "../../common/utils";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/layout";
import { getActivity } from "../../repo/ActivityRepo";

function ActivityDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id, getActivity, {
    revalidateOnFocus: false,
    errorRetryCount: 0,
  });

  useEffect(() => {
    document.title = `${process.env.NEXT_PUBLIC_APP_NAME} | Activity Detail`;
  });

  if (error) {
    return (
      <div className="container py-3">
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (!data && !error) {
    return <div></div>;
  }

  return (
    <div className="container py-3 ">
      <div className="row mb-4 mb-lg-5">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <h3 className="fw-semibold text-truncate text-wrap py-3">
                {data.title}
              </h3>
              <div
                className="position-relative"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="ratio ratio-16x9 bg-light">
                  <img
                    src={`${baseImagbaePath}/activities%2F${data.cover}?alt=media`}
                    alt="Activity image."
                    className="rounded"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className="py-3 mb-2">
                <div className="text-muted">
                  <small>{formatTimestamp(data.createdAt)}</small>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: `${data.body}` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ActivityDetail.getLayout = (page) => (
  <Layout extended whiteBackground>
    {page}
  </Layout>
);

export default ActivityDetail;
