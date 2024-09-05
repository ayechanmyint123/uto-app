import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { api } from "~/utils/api";
import { useShelves, useWareHouse } from "~/contexts";


interface Objarray {
  id:string,
  name:string
}

interface SelectProps {
  query?: string;
  menu?: Objarray[] | undefined;
  initialValue?: string | null;
  name: string;
  size?: string;
  restart?: boolean;
  index?: number;
  onhandleChange: (val: string, id: string, idx?: number) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Selectmenu = (props: SelectProps) => {
  const { index,initialValue,query,menu, name, size, restart, onhandleChange } = props;
  const {shelves} = useShelves();
  const {warehouses} = useWareHouse();
  const [selected, setSelected] = useState(" ");
  const [listData,setListData] = useState<Objarray[]>([{id:" ",name:"Loading..."}]);

  const {data : customers} = api.customers.getAll.useQuery();

  useEffect(() => {
    initialValue ? setSelected(initialValue) : setSelected(' ');

    if (restart) {
      setSelected(" ");
    }
    
    if(menu){
      setListData(menu)
    }

  }, [restart,query,menu,initialValue] );

  const onhandleupdate = (val: string) => {
    setSelected(val);

    const selectedObj = listData?.find((value) => value.name === val);

    if (selectedObj) {
      const { id } = selectedObj;
      onhandleChange(id, name, Number(index) +1);
    }
  };

  const onHandleChange = () => {
    if(query === 'customer'){
      const transformedCustomers = customers?.map((cus) => {
        return {
          id: cus.name,
          name: cus.name,
        };
      });

      transformedCustomers && setListData(transformedCustomers)
    }else if(menu){
      setListData(menu)
    }else if(query === 'wareHouse'){
      const transformedWareHouses = warehouses?.map((war) => {
        return {
          id: war?.id,
          name: war.name,
        };
      });
      console.log(warehouses)
      transformedWareHouses && setListData(transformedWareHouses)
    }else if(query === 'shelves'){
      const transformedShelves = shelves?.map((shel) => {
        return {
          id: shel.name,
          name: shel.name,
        };
      });

      transformedShelves && setListData(transformedShelves)      
    }
  }
  
  return (
    <Listbox value={selected} onChange={(val) => onhandleupdate(val)}>
      {({ open }) => (
        <>
          <div className="relative max-w-md">
            <Listbox.Button
              className={`flex ${
                selected !== " " ? "w-full" : "w-20"
              }cursor-pointer border-b-4 border-indigo-200 text-left text-gray-900 outline-none sm:text-sm sm:leading-6 print:border-0`}
              onClick={onHandleChange}
            >
              <span className="flex items-center">
                <span
                  className={`ml-3 block text-${size ? size : ""} truncate`}
                >
                  {selected}
                </span>
              </span>
              <span className="pointer-events-none inset-y-0 right-0 ml-3 flex items-center print:hidden">
                <ChevronUpDownIcon
                  className={`h-5 w-5 text-gray-400 ${
                    selected === " " ? "ml-12" : ""
                  }`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                 {
                  listData.length === 0 ? (
                    <Listbox.Option
                      className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9"
                      value=""
                      disabled={true}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              Loading...
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ) : (
                  listData?.map((data, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      disabled={data.name === "Loading..." ? true : false}
                      value={data.name}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {data.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  )))
                }
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
