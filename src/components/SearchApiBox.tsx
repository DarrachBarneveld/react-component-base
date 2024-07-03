import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
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

interface SearchApiBoxProps {}

const fetchSearchProducts = async (
  query: string
): Promise<AxiosResponse<ProductAPIResponse, any>> => {
  const response = await axios(
    `https://dummyjson.com/products/search?q=${query}`
  );
  // if (!response.status === 200) {
  //   throw new Error("Network response was not ok");
  // }
  // This is fun

  return response;
};

const useDebouncedSearch = (query: string) => {
  return useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchProducts(query),
    staleTime: 5 * 60 * 1000,
  });
};

const SearchApiBox: FunctionComponent<SearchApiBoxProps> = () => {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const {
    data: productData,
    error,
    isFetching,
  } = useDebouncedSearch(debouncedQuery);

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
              {productData?.data.products.length === 0 &&
              debouncedQuery !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                productData?.data?.products.map((product: Product) => (
                  <ComboboxOption
                    key={product.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={product}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {product.title}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
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
