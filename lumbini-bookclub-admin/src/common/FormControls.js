import { Popover, Switch } from "@headlessui/react";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import Calendar from "react-calendar";
import { formatTimestamp } from "./utils";

export function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  onKeyPress,
  error,
  placeholder,
}) {
  return (
    <div>
      {label && <label className="form-control-label">{label}</label>}
      <input
        className={"form-control " + (error ? "invalid" : "")}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value ?? ""}
        onKeyUp={onKeyPress}
      />
      {error && <div className="form-control-error">{error}</div>}
    </div>
  );
}

export function Select({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  children,
}) {
  return (
    <div>
      {label && <label className="form-control-label">{label}</label>}
      <select
        className={"form-control " + (error ? "invalid" : "")}
        id={name}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
      >
        {children}
      </select>
      {error && <div className="form-control-error">{error}</div>}
    </div>
  );
}

export function CheckBox({
  label,
  name,
  checked,
  onChange,
  onBlur,
  helperText,
}) {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex items-center h-6">
        <input
          id={name}
          name={name}
          checked={checked ?? false}
          onChange={onChange}
          onBlur={onBlur}
          type="checkbox"
          className={
            "focus:ring-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          }
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-800">{label}</label>
        {helperText && (
          <span className="text-xs text-gray-400">{helperText}</span>
        )}
      </div>
    </div>
  );
}

export function SwitchBox({ label, name, checked, onChange, onBlur }) {
  return (
    <Switch.Group>
      <div className="flex items-center py-2">
        <Switch
          id={name}
          checked={checked}
          onChange={onChange}
          name={name}
          onBlur={onBlur}
          className={`${
            checked ? "bg-indigo-600" : "bg-gray-200"
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-0`}
        >
          <span
            className={`${
              checked ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
        <Switch.Label className="ml-2 text-sm" passive>
          {label}
        </Switch.Label>
      </div>
    </Switch.Group>
  );
}

export function TextArea({
  label,
  name,
  rows,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) {
  return (
    <div>
      {label && <label className="form-control-label">{label}</label>}
      <textarea
        className={"form-control " + (error ? "invalid" : "")}
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {error && <div className="form-control-error">{error}</div>}
    </div>
  );
}

export function PasswordInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) {
  const [inputType, setInputType] = useState("password");

  function toggleType() {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }

  return (
    <div>
      <label className="form-control-label">{label}</label>
      <div className="flex rounded-md">
        <input
          className={
            "w-full focus:ring-0 rounded-none rounded-l " +
            (error
              ? "border-red-600 focus:border-red-600"
              : "border-gray-300 focus:border-indigo-500")
          }
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
        <button
          type="button"
          onClick={toggleType}
          className="border border-l-0 border-gray-300 bg-gray-100 focus:ring-0 focus:border-gray-300 rounded-none rounded-r px-3"
        >
          {inputType === "text" ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <EyeOffIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <div className="form-control-error">{error}</div>}
    </div>
  );
}

export function DatePickerInput({
  label,
  name,
  value,
  onChange = (d) => {},
  onBlur,
  error,
  placeholder,
}) {
  const [date, setDate] = useState();

  function handleDateChange(date) {
    onChange(date);
    setDate(date);
  }

  return (
    <>
      {label && <label className="form-control-label">{label}</label>}
      <Popover className="relative">
        <Popover.Button as={Fragment}>
          <div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
              className={"form-control bg-gray-50" + (error ? "invalid" : "")}
              id={name}
              name={name}
              type="text"
              placeholder={placeholder}
              onChange={() => {}}
              value={date ? formatTimestamp(date, false) : ""}
              onKeyUp={(e) => {
                if (e.key === "Backspace") {
                  onChange(null);
                  setDate(null);
                }
              }}
            />
          </div>
        </Popover.Button>

        <Popover.Panel className="absolute z-10">
          {({ close }) => (
            <Calendar
              onChange={(v) => {
                handleDateChange(v);
                close();
              }}
              value={date}
              locale="en-US"
              className={"shadow-lg rounded mt-1 !border-gray-300"}
              tileClassName={"rounded"}
            />
          )}
        </Popover.Panel>
      </Popover>

      {error && <div className="form-control-error">{error}</div>}
    </>
  );
}
