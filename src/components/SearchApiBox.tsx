import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Fragment, useCallback, useMemo, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

// Debounce function using react-query to fetch data
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
export type RenderComponent<T> = (data: T) => JSX.Element;

interface SearchApiBoxProps<T> {
  fetchFn: (query: string) => Promise<any>;
  renderComponent: RenderComponent<T>;
  displayValue: (data: any) => string;
}

const SearchApiBox = <T,>({
  fetchFn,
  renderComponent,
  displayValue,
}: SearchApiBoxProps<T>) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<T | null>(null);

  // Fetch data using useDebouncedSearch hook on component mount/render using search query and props fetch function
  const { data } = useDebouncedSearch<AxiosResponse, AxiosError>(
    debouncedQuery,
    fetchFn
  );

  // Memoize the debounced search function and delay setterFunc by 500ms
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 250),
    []
  );

  // Handle change event and call debounced search function
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      debouncedSearch(value);
    },
    []
  );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <div className="relative mx-auto bg-white rounded-full">
          <ComboboxInput
            className="w-full border-none py-2 pl-3 pr-10 text-sm  shadow-md leading-5 text-gray-900 rounded-full focus:ring-0 outline-indigo-600 caret-indigo-600"
            displayValue={(item) => displayValue(item)}
            onChange={handleChange}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 hover:text-indigo-600 text-gray-400 focus:text-indigo-600">
            <HiOutlineChevronUpDown className="h-5 w-5" aria-hidden="true" />
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
            {data?.data && renderComponent(data.data)}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SearchApiBox;
