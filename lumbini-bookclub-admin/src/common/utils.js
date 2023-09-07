export function formatTimestamp(timestamp, withTime = true) {
  let date = new Date(timestamp);
  if (withTime) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function parseError(error) {
  if (!(error instanceof Error)) {
    return error;
  }

  if (
    error.code === "auth/network-request-failed" ||
    error.code === "unknown"
  ) {
    return "Internet connection error.";
  }

  return error.message;
}

export function getFileExtension(fileName = "") {
  if (!fileName || fileName.trim().length <= 0) {
    throw Error("Invalid file.");
  }

  return fileName.substring(fileName.lastIndexOf("."));
}

export function parseNumber(value) {
  if (isNaN(value) || `${value}`.trim().length === 0) {
    return "";
  }
  return Number.isInteger(value) ? parseInt(value) : parseFloat(value);
}

export function formatPrice(value) {
  if (isNaN(value) || `${value}`.trim().length === 0) {
    return "";
  }

  return Intl.NumberFormat("en-US").format(value);
}
