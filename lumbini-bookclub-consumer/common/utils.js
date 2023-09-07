import dayjs from "dayjs";

export function formatTimestamp(timestamp, withTime = true) {
  let date = dayjs(timestamp);
  if (withTime) {
    return date.format("MMM DD, YYYY hh:mm A");
  }

  return date.format("MMM DD, YYYY");
}

export function formatPrice(value) {
  if (isNaN(value) || `${value}`.trim().length === 0) {
    return "";
  }

  return Intl.NumberFormat("en-US").format(value);
}

export function transformDiscount(
  price = 0,
  discount = { value: 0, type: "fixed" }
) {
  if (discount.type === "fixed") {
    return formatPrice(parseInt(discount.value, 10));
  }

  const percent = discount.value;
  const discountPrice = (percent * price) / 100;
  return formatPrice(price - discountPrice);
}

export function debounce(callback, timeout = 2000) {
  if (typeof window === "undefiend") {
    return () => {};
  }
  let timer;

  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback && callback.apply(null, args);
    }, timeout);
  };
}
