import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { FunctionComponent, useCallback, useMemo, useState } from "react";

interface AppProps {}

const fetchSearchResults = async (query: string) => {
  const response = await axios(
    `https://dummyjson.com/products/search?q=${query}`
  );
  // if (!response.status === 200) {
  //   throw new Error("Network response was not ok");
  // }

  return response;
};

const useDebouncedSearch = (query: string) => {
  return useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchResults(query),
    staleTime: 5 * 60 * 1000,
  });
};

const App: FunctionComponent<AppProps> = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 500),
    []
  );
  const { data, error, isFetching } = useDebouncedSearch(debouncedQuery);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleChange} />
      {isFetching && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <ul>
          {data?.data?.products?.map((product: any) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
