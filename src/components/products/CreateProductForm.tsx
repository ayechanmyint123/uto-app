/* eslint-disable react-hooks/exhaustive-deps */
import { CldUploadWidget } from "next-cloudinary";
import { type FormEvent, type MouseEvent, useState, useEffect } from "react";
import { DEFAULT_PRODUCT } from ".";
import { usePrompt, useBranch } from "../../contexts";
import { api } from "~/utils/api";

type CldResult = {
  info: {
    secure_url: string;
  };
};

type CldWidget = {
  close: () => void;
};

export const CreateProductForm = () => {
  const { hidePrompt } = usePrompt();
  const { branch } = useBranch();
  const [productInfo, setProductInfo] = useState({ ...DEFAULT_PRODUCT });
  const ctx = api.useContext();

  useEffect(() => {
    setProductInfo({
      ...productInfo,
      industryId: branch?.industryId,
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setProductInfo({
      ...productInfo,
      [e.target.name]:
        e.target.name === "status"
          ? e.target.value === "true"
            ? true
            : false
          : e.target.value,
    });
  };

  const handleOnUpload = (result: CldResult, widget: CldWidget) => {
    setProductInfo({
      ...productInfo,
      imageSrc: result.info.secure_url,
    });
    widget.close();
  };

  const { mutate } = api.products.create.useMutation({
    onSuccess: () => {
      setProductInfo({ ...DEFAULT_PRODUCT });
      void ctx.products.getProductsByIndustry.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to create! Please try again later.");
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    productInfo.costPrice = Number(productInfo.costPrice);
    productInfo.salePrice = Number(productInfo.salePrice);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    mutate(productInfo);
    hidePrompt();
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProductInfo({ ...DEFAULT_PRODUCT });
    hidePrompt();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={productInfo.code}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="brand"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Brand
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={productInfo.brand}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={productInfo.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Sale Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="salePrice"
                  id="salePrice"
                  value={productInfo.salePrice}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="costPrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cost Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="costPrice"
                  id="costPrice"
                  value={productInfo.costPrice}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="unit"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Unit
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  value={productInfo.unit}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="packing"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Packing
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="packing"
                  id="packing"
                  value={productInfo.packing}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  value={String(productInfo.status)}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="true">TRUE</option>
                  <option value="false">FALSE</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="imageSrc"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image URL
              </label>
              <div className="mt-2">
                <input
                  id="imageSrc"
                  name="imageSrc"
                  type="text"
                  value={productInfo.imageSrc}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <CldUploadWidget
                onUpload={handleOnUpload}
                uploadPreset="next-cloudinary-unsigned"
              >
                {({ open }) => {
                  function handleOnClick(
                    e: React.MouseEvent<HTMLButtonElement>
                  ) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleOnClick}
                    >
                      Upload an Image
                    </button>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};
