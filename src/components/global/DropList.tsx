import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface itemsProps {
  items?:
    | { description?: string; code?: string; name?: string }[]
    | []
    | undefined;
  target: string;
  onAddDescription: (item: string, target: string) => void;
}

export const DropList = (props: itemsProps) => {
  const { items, target, onAddDescription } = props;
  const [query, setQuery] = useState("");
  const [values, setValues] = useState("");

  const filteredPeople =
    query === ""
      ? items
      : items?.filter((item) => {
          if (target === "Description") {
            return (
              item.description !== undefined &&
              item?.description.toLowerCase().includes(query.toLowerCase())
            );
          } else if (target === "Code") {
            return (
              item.code !== undefined &&
              item?.code.toLowerCase().includes(query.toLowerCase())
            );
          } else if (target === "customerId") {
            return (
              item.name !== undefined &&
              item?.name.toLowerCase().includes(query.toLocaleLowerCase())
            );
          }
        });
  const handleChange = (value: string, target: string) => {
    onAddDescription(value, target);
  };

  return (
    <div>
      <Combobox
        value={query}
        onChange={(val) => {
          setValues(val);
          handleChange(val, target);
        }}
      >
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              className="w-auto rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={`Enter ${target ? target : ""}`}
              onChange={(event) => setQuery(event.target.value)}
              value={
                target === "Code" || target === "Description" ? "" : values
              }
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople?.map((person, idx) => (
                  <Combobox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative cursor-default select-none p-2 ${
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={
                      target === "Description"
                        ? person.description
                        : target === "customerId"
                        ? person.name
                        : person.code
                    }
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {target === "Description"
                          ? person.description
                          : target === "customerId"
                          ? person.name
                          : person.code}
                      </span>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
