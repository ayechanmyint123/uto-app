import React, { Fragment } from "react";

interface optionProps {
  title: string;
  value: string;
  select?: boolean;
}

interface fieldProp {
  title?: string;
  label: string;
  type: string;
  placeholder?: string;
  id: string;
  value: string | number | undefined;
  onChange: (name: string, value: string) => void;
  option?: optionProps[];
}

export const Searchfield = (props: fieldProp) => {
  const { title, label, type, placeholder, id, value, option, onChange } =
    props;

  return (
    <Fragment>
      {title && (
        <label htmlFor={label} className="font-medium capitalize">
          {title}
        </label>
      )}

      {type === "text" || type === "number" ? (
        <input
          type={type}
          name={label}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.name, e.target.value);
          }}
          placeholder={placeholder}
          min={0}
          className={`${
            value ? "border-indigo-500" : "border-gray-200"
          } block w-full border-b-4 border-gray-200 px-1.5 py-1.5 text-gray-900 shadow-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-indigo-500 sm:text-sm sm:leading-6`}
        />
      ) : null}

      {type === "select" && (
        <select
          name={id}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.name, e.target.value);
          }}
          className={`${
            value ? "border-indigo-500" : "border-gray-200"
          } block border-b-4 border-gray-200 px-1.5 py-1.5 text-gray-900 shadow-sm outline-none transition duration-200 placeholder:text-gray-400 focus:border-indigo-500 sm:text-sm sm:leading-6`}
        >
          {option?.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.title}
            </option>
          ))}
        </select>
      )}
    </Fragment>
  );
};
