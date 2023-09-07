import Spinner from "./Spinner";

function Button({
  type = "button",
  onClick,
  disabled,
  className,
  small = false,
  children,
}) {
  return (
    <button
      type={type}
      className={`font-medium inline-flex items-center justify-center disabled:bg-opacity-70 disabled:cursor-wait ${
        small ? "px-2 py-1 text-sm" : "px-3 py-2"
      } rounded ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
  loading = false,
}) {
  return (
    <Button
      type={type}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </Button>
  );
}

export function PrimaryOutlineButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
}) {
  return (
    <Button
      type={type}
      className={`border border-indigo-600 hover:bg-indigo-600 text-indigo-600 hover:text-white ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
}) {
  return (
    <Button
      type={type}
      className={`bg-indigo-200 hover:bg-indigo-300 text-indigo-600 ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {children}
    </Button>
  );
}

export function DangerButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
  loading = false,
}) {
  return (
    <Button
      type={type}
      className={`bg-red-600 hover:bg-red-800 text-white ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </Button>
  );
}

export function DangerOutlineButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
}) {
  return (
    <Button
      type={type}
      className={`border border-red-600 hover:bg-red-600 text-red-600 hover:text-white ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {children}
    </Button>
  );
}

export function DefaultButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
  small,
}) {
  return (
    <Button
      type={type}
      className={`bg-gray-200 hover:bg-gray-300 text-gray-700 ${className}`}
      disabled={disabled}
      onClick={onClick}
      small={small}
    >
      {children}
    </Button>
  );
}
