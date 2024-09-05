import { Fragment } from "react";
import { Menubutton } from "./Menubutton";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Productfilter } from "../search/Productfilter";
import Receiptfilter from "../search/Receiptfilter";

interface dropdownProps {
  currentPage?: string;
}

export const Dropdownfilter = (props: dropdownProps) => {
  const { currentPage } = props;
  let renderedComponent = null;

  const textArea = (
    <div className="flex">
      Filter
      <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
    </div>
  );

  switch (currentPage) {
    case "/products":
      renderedComponent = <Productfilter />;
      break;
    case "/receipts":
      renderedComponent = <Receiptfilter />;
      break;
    default:
      return null;
  }

  return (
    <>
      <Menubutton title={textArea} menu={renderedComponent} />
      {renderedComponent && (
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Search
        </button>
        // <MagnifyingGlassIcon className="duration-3000 h-10 w-10 cursor-pointer rounded-full border border-gray-700 p-2 font-semibold text-black opacity-50 transition hover:opacity-60" />
      )}
    </>
  );
};
