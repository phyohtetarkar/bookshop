function ErrorMessage({ error }) {
  return (
    <div className="d-flex justify-content-center my-5">
      <div className="d-flex flex-column">
        <div className="mb-1">{`${error.message}`}</div>
        {/* <div>Something went wrong.</div> */}
      </div>
    </div>
  );
}

export default ErrorMessage;
