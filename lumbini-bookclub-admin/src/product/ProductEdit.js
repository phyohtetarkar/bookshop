import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import { PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { CheckBox, Input, Select } from "../common/FormControls";
import { parseError, parseNumber } from "../common/utils";
import ProductImages from "../product/ProductImages";
import { getProductEdit, saveProduct } from "./ProductRepo";
import { default as ReactSelect } from "react-select";

// const statusList = ["AVAILABLE", "OUT OF STOCK"];

export const initialProductData = {
  id: undefined,
  name: "",
  price: "",
  discount: {
    value: "",
    type: "fixed",
  },
  isDiscount: false,
  newArrival: false,
  popular: false,
  category: "",
  author: "",
  publisher: "",
  publishedYear: "",
  numberOfPages: "",
  edition: "",
  available: true,
  barcode: "",
  code: "",
  images: [],
  hidden: false,
  description: "",
  urls: [],
  files: [],
};

function ProductEdit() {
  let params = useParams();
  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const [dataState, requestData] = useAPIRequest(getProductEdit);
  const [state, requestSave] = useAPIRequest(saveProduct);
  const [categoryList, setCategoryList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [publisherList, setPublisherList] = useState([]);
  const [editionList, setEditionList] = useState([]);

  const [initialValues, setInitialValues] = useState({ ...initialProductData });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validate: (values) => {
      let errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "Please enter book name.";
      }

      if (!values.price || values.price.length === 0) {
        errors.price = "Please enter book price.";
      }

      // if (!values.code || values.code.length === 0) {
      //   errors.code = "Please enter code number.";
      // }

      if (!values.category) {
        errors.category = "Please select category.";
      }

      if (!values.author) {
        errors.author = "Please select author.";
      }

      // if (!values.publisher) {
      //   errors.publisher = "Please select publisher.";
      // }

      if (
        values.isDiscount &&
        (!values.discount.value || isNaN(values.discount.value))
      ) {
        errors.discount = "Please enter discount price.";
      } else if (
        values.isDiscount &&
        values.discount.type === "percent" &&
        values.discount.value > 100
      ) {
        errors.discount = "Discount percentage must not exceed 100%.";
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let product = { ...values };
      product["price"] = parseNumber(values.price);
      if (product.isDiscount || product.discount.value) {
        product.discount.value = parseNumber(product.discount.value);
      }
      requestSave(product);
      //console.log(product);
      //formik.setSubmitting(false);
    },
  });

  useEffect(() => {
    requestData(params.id);

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(dataState.status === Actions.loading);

    if (dataState.status === Actions.success) {
      const payload = dataState.payload;
      setCategoryList(payload.categories ?? []);
      setAuthorList(payload.authors ?? []);
      setPublisherList(payload.productSetting.publishers ?? []);
      setEditionList(payload.productSetting.editions ?? []);

      let product = payload.product ?? {};
      product.urls = [...product.images];
      setInitialValues({ ...initialProductData, ...product });
    }

    if (dataState.status === Actions.failure) {
      toast.error(parseError(dataState.error));
      navigate("/books", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState]);

  useEffect(() => {
    if (state.status !== Actions.loading) {
      formik.setSubmitting(false);
    }

    if (state.status === Actions.success) {
      toast.success("Book saved successfully.");
      navigate("/books", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <h3>{`${params.id ? "Update" : "Add"} Book`}</h3>
                <PrimaryButton
                  type="submit"
                  className={"ml-auto"}
                  disabled={
                    formik.isSubmitting || dataState.status === Actions.loading
                  }
                  loading={formik.isSubmitting}
                >
                  Save
                </PrimaryButton>
              </div>
            </Card.Header>
            <Card.Body>
              {state.status === Actions.failure && (
                <Alert alertClass="alert-error mb-4" closeable>
                  {parseError(state.error)}
                </Alert>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    label="Name *"
                    name="name"
                    placeholder="Enter book name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.errors.name}
                  />
                </div>

                <div className="lg:col-span-1 hidden">
                  <Input
                    label="Code *"
                    name="code"
                    placeholder="Enter code number"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    error={formik.errors.code}
                  />
                </div>
                <div className="lg:col-span-1 hidden">
                  <Input
                    label="Barcode"
                    name="barcode"
                    placeholder="Enter barcode"
                    value={formik.values.barcode}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Select
                    label="Category *"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.errors.category}
                  >
                    {categoryList.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="lg:col-span-1">
                  <label className="form-control-label">Author *</label>
                  <ReactSelect
                    name="author"
                    styles={{
                      control: (css, state) => ({
                        ...css,
                        padding: 2,
                        boxShadow: "none",
                      }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#e0e7ff",
                        primary: "#6366f1",
                      },
                    })}
                    value={
                      authorList
                        ? authorList.find((a) => a.id === formik.values.author)
                        : ""
                    }
                    onChange={(newValue, action) => {
                      formik.setFieldValue("author", newValue?.id);
                    }}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    placeholder="Select author"
                    options={authorList}
                    getOptionValue={(op) => op.id}
                    getOptionLabel={(op) => op.name}
                  />
                  {formik.errors.author && (
                    <div className="form-control-error">
                      {formik.errors.author}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <Input
                    label="Published Year"
                    name="publishedYear"
                    placeholder="Enter published year"
                    value={formik.values.publishedYear}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Input
                    label="Number Of Pages"
                    name="numberOfPages"
                    placeholder="Enter number of pages"
                    value={formik.values.numberOfPages}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Input
                    label="Price *"
                    name="price"
                    placeholder="Enter price amount"
                    value={formik.values.price}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.errors.price}
                  />
                </div>
                <div className="lg:col-span-2">
                  <div>
                    <label className="form-control-label">Discount</label>
                    <div className="flex items-center">
                      <input
                        className={
                          "form-control-group-end " +
                          (formik.errors.discount ? "invalid" : "")
                        }
                        id="discount.value"
                        name="discount.value"
                        type="text"
                        placeholder={`Enter discount ${
                          formik.values.discount.type === "percent"
                            ? "percentage"
                            : "value"
                        }`}
                        onChange={(e) => {
                          if (!isNaN(e.target.value)) {
                            formik.handleChange(e);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.discount.value}
                      />
                      <select
                        className="border-l-0 focus:border-gray-300 border-gray-300 focus:ring-0 bg-gray-100"
                        id="discount.type"
                        name="discount.type"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.discount.type}
                      >
                        <option value="fixed">.00</option>
                        <option value="percent">%</option>
                      </select>
                      <div className="border border-l-0 bg-gray-100 border-gray-300 rounded-r h-[42px] px-4 flex items-center justify-center">
                        <input
                          name="isDiscount"
                          checked={formik.values.isDiscount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="checkbox"
                          className={
                            "focus:ring-0 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          }
                        />
                        <label className="ml-2 text-gray-700">Apply</label>
                      </div>
                    </div>
                    {formik.errors.discount && (
                      <div className="form-control-error">
                        {formik.errors.discount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <Select
                    label="Publisher"
                    name="publisher"
                    value={formik.values.publisher}
                    onChange={formik.handleChange}
                    error={formik.errors.publisher}
                  >
                    <option value=""></option>
                    {publisherList.map((p, i) => (
                      <option value={p} key={i}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="lg:col-span-1">
                  <Select
                    label="Edition"
                    name="edition"
                    value={formik.values.edition}
                    onChange={formik.handleChange}
                    error={formik.errors.edition}
                  >
                    <option value=""></option>
                    {editionList.map((e, i) => (
                      <option value={e} key={i}>
                        {e}
                      </option>
                    ))}
                  </Select>
                </div>

                <hr className="lg:col-span-2 my-2" />

                <div className="lg:col-span-1">
                  <CheckBox
                    label="Available"
                    name="available"
                    helperText={
                      formik.values.available ? "In Stock" : "Out Of Stock"
                    }
                    checked={formik.values.available}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="lg:col-span-1">
                  <CheckBox
                    label="New Arrival"
                    name="newArrival"
                    helperText="Mark as new arrival"
                    checked={formik.values.newArrival}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="lg:col-span-1">
                  <CheckBox
                    label="Popular"
                    name="popular"
                    helperText="Mark as popular"
                    checked={formik.values.popular}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="lg:col-span-1">
                  <CheckBox
                    label="Hidden"
                    name="hidden"
                    helperText="Do not show in listing"
                    checked={formik.values.hidden}
                    onChange={formik.handleChange}
                  />
                </div>

                <hr className="lg:col-span-2 my-2" />

                <div className="lg:col-span-2">
                  <label className="form-control-label mb-2">
                    Book Images *
                  </label>
                  <ProductImages
                    images={formik.values.images}
                    onImagesChange={(blobs, urls) => {
                      formik.setFieldValue("files", blobs);
                      formik.setFieldValue("urls", urls);
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  {/* <TextArea
                    label="Description"
                    name="description"
                    placeholder="Enter description"
                    rows={6}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  /> */}

                  <Editor
                    tinymceScriptSrc={`${
                      window.location.protocol + "//" + window.location.host
                    }/tinymce/tinymce.min.js`}
                    value={formik.values.description}
                    onEditorChange={(newValue, editor) =>
                      formik.setFieldValue("description", newValue)
                    }
                    init={{
                      height: 280,
                      menubar: false,
                      placeholder: "Enter description",
                      plugins: [
                        "preview",
                        "fullscreen",
                        "wordcount",
                        "link",
                        "lists",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic underline blockquote | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | fullscreen",
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </form>
      </div>
      <div></div>
    </div>
  );
}

export default ProductEdit;
