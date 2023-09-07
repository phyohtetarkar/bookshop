import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { DangerButton, PrimaryButton } from "../common/Buttons";
import Card from "../common/Card";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Actions, useAPIRequest } from "../common/api-request";
import { deleteProduct, getProducts } from "./ProductRepo";
import { LoadingContext } from "../common/Contexts";
import { formatPrice, formatTimestamp, parseError } from "../common/utils";
import { toast } from "react-toastify";
import { ConfirmModal } from "../common/Modal";
import { baseImagePath } from "../App";
import Alert from "../common/Alert";
import { CheckBox, Input, Select } from "../common/FormControls";
import { getCategories } from "../category/CategoryRepo";
import { getAuthors } from "../author/AuthorRepo";
import { default as ReactSelect } from "react-select";

function ProductList() {
  const loadingContext = useContext(LoadingContext);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [authorList, setAuthorList] = useState([]);

  const [productListState, requestProducts] = useAPIRequest(getProducts);
  const [categoryListState, requestCategories] = useAPIRequest(getCategories);
  const [authorListState, requestAuthors] = useAPIRequest(getAuthors);

  const [delState, requestDelete] = useAPIRequest(deleteProduct);

  const [productCode, setProductCode] = useState("");

  const [query, setQuery] = useState({
    first: null,
    last: null,
  });

  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  useEffect(() => {
    //requestProducts();
    requestCategories();
    requestAuthors();

    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(productListState.status === Actions.loading);
    if (productListState.status === Actions.success) {
      let payload = productListState.payload?.list ?? [];
      setProductList(payload);
      setPaging({
        hasNext: productListState.payload?.hasNext,
        hasPrev: productListState.payload?.hasPrev,
      });
      if (payload.length === 0) {
        toast.info("No book found.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productListState]);

  useEffect(() => {
    if (categoryListState.status === Actions.success) {
      let payload = categoryListState.payload ?? [];
      setCategoryList(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryListState]);

  useEffect(() => {
    if (authorListState.status === Actions.success) {
      let payload = authorListState.payload ?? [];
      setAuthorList(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorListState]);

  useEffect(() => {
    loadingContext.setLoading(delState.status === Actions.loading);
    if (delState.status === Actions.success) {
      toast.success("Book deleted successfully.");
      requestProducts();
    }
    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delState]);

  useEffect(() => {
    // if (query.first || query.last) {
    //   requestProducts(query);
    // }

    requestProducts(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleQueryChange(value) {
    setQuery((q) => ({
      ...q,
      ...value,
      code: productCode,
      first: null,
      last: null,
    }));
  }

  function getActtionButtons(p) {
    return (
      <div className="flex space-x-2">
        <Link to={p.id}>
          <PrimaryButton>
            <PencilAltIcon className="w-4 h-4" />
          </PrimaryButton>
        </Link>
        <DangerButton
          onClick={() => {
            setDeleteId(p.id);
            setShowConfirm(true);
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </DangerButton>
      </div>
    );
  }

  function getProductImageUrl(p) {
    if (p.images && p.images.length > 0) {
      return `${baseImagePath}/books%2F${p.images[0]}?alt=media`;
    }

    return "/placeholder.png";
  }

  return (
    <div className="flex flex-col space-y-4">
      <ConfirmModal
        message="Are you sure to delete?"
        isOpen={showConfirm}
        handleClose={(result) => {
          setShowConfirm(false);
          if (result) {
            requestDelete(deleteId);
          }
          setDeleteId(undefined);
        }}
      />

      {productListState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(productListState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Books</h3>
            <Link to={"/books/new"} className="ml-auto">
              <PrimaryButton onClick={() => {}}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New
              </PrimaryButton>
            </Link>
          </div>
        </Card.Header>
        <Card.Body className="flex flex-col space-y-2">
          <div className="flex flex-wrap items-center">
            <div className="mr-3 mb-2">
              <Input
                name="productCode"
                placeholder="Search by code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setQuery((q) => ({
                      ...q,
                      code: productCode,
                      first: null,
                      last: null,
                    }));
                  }
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <ReactSelect
                name="author"
                styles={{
                  control: (css, state) => ({
                    ...css,
                    width: "200px",
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
                defaultValue={query.author ?? ""}
                onChange={(newValue, action) => {
                  handleQueryChange({ author: newValue?.id });
                }}
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                placeholder="By author"
                options={authorList}
                getOptionValue={(op) => op.id}
                getOptionLabel={(op) => op.name}
              >
                {/* <option value={""}>All Author</option>
                {authorList.map((e) => {
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  );
                })} */}
              </ReactSelect>
            </div>
            <div className="mr-3 mb-2">
              <Select
                name="category"
                value={query.category ?? ""}
                onChange={(e) => {
                  handleQueryChange({ category: e.target.value });
                }}
              >
                <option value={""}>All Category</option>
                {categoryList.map((e) => {
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div className="mr-3 mb-2">
              <Select
                name="status"
                value={query.status ?? ""}
                onChange={(e) => {
                  handleQueryChange({ status: e.target.value });
                }}
              >
                <option value={""}>All Status</option>
                <option value={"IN_STOCK"}>In Stock</option>
                <option value={"OUT_OF_STOCK"}>Out Of Stock</option>
              </Select>
            </div>
            <div className="mr-3 mb-2">
              <CheckBox
                label="Promotion"
                name="promotion"
                checked={query.promotion ?? false}
                onChange={(e) => {
                  handleQueryChange({ promotion: e.target.checked });
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <CheckBox
                label="New Arrival"
                name="newArrival"
                checked={query.newArrival ?? false}
                onChange={(e) => {
                  handleQueryChange({ newArrival: e.target.checked });
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <CheckBox
                label="Popular"
                name="popular"
                checked={query.popular ?? false}
                onChange={(e) => {
                  handleQueryChange({ popular: e.target.checked });
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <CheckBox
                label="Hidden"
                name="hidden"
                checked={query.hidden ?? false}
                onChange={(e) => {
                  handleQueryChange({ hidden: e.target.checked });
                }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-40">Image</Table.TH>
                  <Table.TH className="w-40 md:w-full">Name</Table.TH>
                  <Table.TH className="w-40">Price</Table.TH>
                  <Table.TH className="w-24">Code</Table.TH>
                  <Table.TH className="w-60">Created At</Table.TH>
                  <Table.TH className="w-44"></Table.TH>
                </tr>
              </Table.THead>
              <Table.TBody>
                {productList.map((p) => {
                  return (
                    <tr key={p.id}>
                      <Table.TD>
                        <div className="">
                          <img
                            src={getProductImageUrl(p)}
                            alt="product"
                            className="w-full aspect-auto rounded drop-shadow-md"
                          />
                        </div>
                      </Table.TD>
                      <Table.TD>{p.name}</Table.TD>
                      <Table.TD>{`${formatPrice(p.price)} Ks`}</Table.TD>
                      <Table.TD>{p.code}</Table.TD>
                      <Table.TD>{formatTimestamp(p.createdAt)}</Table.TD>
                      <Table.TD>{getActtionButtons(p)}</Table.TD>
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>

          <div className="flex flex-row-reverse pt-2">
            <Pagination
              list={productList}
              query={query}
              hasPrev={paging.hasPrev}
              hasNext={paging.hasNext}
              onPrev={(first) => {
                const q = { ...query };
                q.first = first;
                q.last = null;
                setQuery(q);
              }}
              onNext={(last) => {
                const q = { ...query };
                q.last = last;
                q.first = null;
                setQuery(q);
              }}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProductList;
