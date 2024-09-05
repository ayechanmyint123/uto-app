import React, { useState } from "react";
import Image from "next/image";
import { type Product } from "../../components";
import Link from "next/link";
import { useProduct, useWareHouse } from "~/contexts";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

type Props = {
  products: Product[];
  handleEditProduct: () => void;
};

export const ProductList = (props: Props) => {
  const { products, handleEditProduct } = props;
  const { setCurrentProduct } = useProduct();
  const { warehouses } = useWareHouse();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Packing
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  <span>Option</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-t border-gray-300">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(idx)}
                        >
                          {activeIndex !== idx ? (
                            <ChevronDownIcon
                              className="mr-3 h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronUpIcon
                              className="mr-3 h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                        <div className="h-11 w-11 flex-shrink-0">
                          <Image
                            className="h-11 w-11 rounded-full"
                            src={product.imageSrc}
                            alt="product image"
                            width={285}
                            height={218}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {product.code}
                          </div>
                          <div className="mt-1 text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{product.unit}</div>
                      <div className="mt-1 text-gray-500">
                        {product.packing}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {product.salePrice}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {product.status ? (
                        <div className="text-green-500">TRUE</div>
                      ) : (
                        <div className="text-red-300">FALSE</div>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium">
                      <Link
                        href=""
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          setCurrentProduct(product);
                          handleEditProduct();
                        }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                  {idx === activeIndex && (
                    <tr key={`warehouse-${idx}`}>
                      <td colSpan={Number(5)}>
                        <div className="flex flex-col px-10 py-3">
                          <div className="overflow-x-auto">
                            <div className="inline-block w-full p-1.5 align-middle">
                              <div className="overflow-hidden rounded-lg border">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Location
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Qty
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Shelf
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    <tr>
                                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                        {warehouses && warehouses[0]?.name}
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                        120
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                        L-101
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
