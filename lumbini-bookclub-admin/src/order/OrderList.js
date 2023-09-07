import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../common/Alert";
import { Actions, useAPIRequest } from "../common/api-request";
import Card from "../common/Card";
import { LoadingContext } from "../common/Contexts";
import { DatePickerInput, Input, Select } from "../common/FormControls";
import Pagination from "../common/Pagination";
import Table from "../common/Table";
import { formatPrice, formatTimestamp, parseError } from "../common/utils";
import { getOrders } from "./OrderRepo";

function OrderList() {
  const loadingContext = useContext(LoadingContext);

  const [list, setList] = useState([]);
  const [listState, requestOrders] = useAPIRequest(getOrders);

  const [query, setQuery] = useState({
    first: null,
    last: null,
  });

  const [paging, setPaging] = useState({ hasPrev: false, hasNext: false });

  const [orderNumber, setOrderNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    return () => {
      loadingContext.setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadingContext.setLoading(listState.status === Actions.loading);
    if (listState.status === Actions.success) {
      let payload = listState.payload?.list ?? [];
      setList(payload);
      setPaging({
        hasNext: listState.payload?.hasNext,
        hasPrev: listState.payload?.hasPrev,
      });
      if (payload.length === 0) {
        toast.info("No order found.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState]);

  useEffect(() => {
    requestOrders(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleQueryChange(value) {
    setQuery((q) => ({
      ...q,
      ...value,
      orderNumber: orderNumber,
      phoneNumber: phoneNumber,
      first: null,
      last: null,
    }));
  }

  return (
    <div className="flex flex-col space-y-4">
      {listState.status === Actions.failure && (
        <Alert alertClass="alert-error mb-4" closeable>
          {parseError(listState.error)}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <div className="flex items-center">
            <h3 className="text-gray-600">Orders</h3>
          </div>
        </Card.Header>
        <Card.Body className="flex flex-col space-y-2">
          <div className="flex flex-wrap items-center">
            <div className="mr-3 mb-2">
              <Select
                name="staus"
                value={query.status ?? ""}
                onChange={(e) => {
                  handleQueryChange({ status: e.target.value });
                }}
              >
                <option value={""}>All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DELIVERING">Delivering</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>
            <div className="mr-3 mb-2">
              <Input
                name="orderNumber"
                placeholder="By order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setQuery((q) => ({
                      ...q,
                      orderNumber: orderNumber,
                      first: null,
                      last: null,
                    }));
                  }
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <Input
                name="phoneNumber"
                placeholder="By phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setQuery((q) => ({
                      ...q,
                      phoneNumber: phoneNumber,
                      first: null,
                      last: null,
                    }));
                  }
                }}
              />
            </div>
            <div className="mr-3 mb-2">
              <DatePickerInput
                name="orderDate"
                placeholder="By order date"
                onChange={(date) => handleQueryChange({ orderDate: date })}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Table.THead>
                <tr>
                  <Table.TH className="w-40">Order No.</Table.TH>
                  <Table.TH className="w-44 md:w-full">Name</Table.TH>
                  <Table.TH className="w-44">Contact No.</Table.TH>
                  <Table.TH className="w-44">Total Price</Table.TH>
                  <Table.TH className="w-36">Status</Table.TH>
                  <Table.TH className="w-60">Ordered At</Table.TH>
                </tr>
              </Table.THead>

              <Table.TBody>
                {list.map((o) => {
                  return (
                    <tr key={o.id}>
                      <Table.TD>
                        <Link to={`/orders/${o.id}`} className="underline">
                          {o.orderNumber}
                        </Link>
                      </Table.TD>
                      <Table.TD>{o.customer}</Table.TD>
                      <Table.TD>{o.phoneNumber}</Table.TD>
                      <Table.TD>{`${formatPrice(o.totalPrice)} Ks`}</Table.TD>
                      <Table.TD>{o.status}</Table.TD>
                      <Table.TD>{formatTimestamp(o.createdAt)}</Table.TD>
                    </tr>
                  );
                })}
              </Table.TBody>
            </Table>
          </div>

          <div className="flex flex-row-reverse">
            <Pagination
              list={list}
              query={query}
              hasNext={paging.hasNext}
              hasPrev={paging.hasPrev}
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

export default OrderList;
