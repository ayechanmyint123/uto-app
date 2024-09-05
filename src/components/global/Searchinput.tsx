import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Dropdownfilter } from "./Dropdownfilter";

interface inputProps {
  currentPage?: string;
}

export const Searchinput = (props: inputProps) => {
  const { currentPage } = props;

  return (
    <div className="my-auto">
      <div className="flex w-60 justify-between space-x-4 rounded-lg bg-gray-100 p-2 md:hidden">
        <input
          className="bg-gray-100 outline-none"
          type="text"
          placeholder="Article name or keyword..."
        />
        <div className="cursor-pointer">
          <MagnifyingGlassIcon className="h-6 w-6 opacity-30" />
        </div>
      </div>
      {currentPage !== "/cart" ? (
        <div className="hidden rounded-xl bg-white md:flex md:items-center">
          <Dropdownfilter currentPage={currentPage} />
        </div>
      ) : null}
    </div>
  );
};
