import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { BiChevronDown } from "react-icons/bi";
import { MdCheckCircleOutline } from "react-icons/md";
import { Product, ProductAPIResponse } from "../types/products";
import { AxiosError } from "axios";

const useDebouncedSearch = <T, E>(
  query: string,
  fetchFn: (query: string) => Promise<T>
) => {
  return useQuery<T, E>({
    queryKey: ["searchResults", query],
    queryFn: () => fetchFn(query),
    staleTime: 5 * 60 * 1000,
  });
};

interface SearchApiBoxProps {
  fetchFn: (query: string) => Promise<any>;
}

const SearchApiBox: FunctionComponent<SearchApiBoxProps> = ({ fetchFn }) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const { data, error } = useDebouncedSearch<ProductAPIResponse, AxiosError>(
    debouncedQuery,
    fetchFn
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 500),
    []
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      debouncedSearch(value);
    },
    []
  );

  return (
    <div className="fixed top-16 w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <ComboboxInput
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(product: Product) => product?.title || ""}
              onChange={handleChange}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <BiChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setDebouncedQuery("")}
          >
            <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data?.data.products.length === 0 ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                data?.data?.products.map((product: Product) => (
                  <ComboboxOption
                    key={product.id}
                    className=" relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-teal-600 data-[focus]:text-white"
                    value={product}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {product.title}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600 data-[focus]:text-white">
                            <MdCheckCircleOutline
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchApiBox;
