import { FunctionComponent } from "react";
import SearchApiBox from "./components/SearchApiBox";
import axios, { AxiosResponse } from "axios";
import { ProductAPIResponse } from "./types/products";

interface AppProps {}

const fetchSearchProducts = async (
  query: string
): Promise<AxiosResponse<ProductAPIResponse, any>> => {
  return await axios(`https://dummyjson.com/producs/search?q=${query}`);
};

const App: FunctionComponent<AppProps> = () => {
  return (
    <section className="container mx-auto p-4">
      <SearchApiBox fetchFn={fetchSearchProducts} />
    </section>
  );
};

export default App;
