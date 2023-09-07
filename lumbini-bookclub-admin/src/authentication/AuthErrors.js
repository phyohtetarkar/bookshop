export function parseAuthError(code) {
  if (code === "auth/user-not-found") {
    return "Incorrect email address.";
  }

  if (code === "auth/wrong-password") {
    return "Incorrect password.";
  }

  if (code === "auth/network-request-failed") {
    return "Network connection error.";
  }

  return "Something went wrong. Please try again.";
}
