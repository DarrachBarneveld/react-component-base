import { FunctionComponent } from "react";
import SearchApiBox, { RenderComponent } from "./components/SearchApiBox";
import axios, { AxiosResponse } from "axios";
import { Product, ProductAPIResponse } from "./types/products";
import { ComboboxOption } from "@headlessui/react";
import { MdCheckCircleOutline } from "react-icons/md";

interface AppProps {}

const fetchSearchProducts = async (
  query: string
): Promise<AxiosResponse<ProductAPIResponse, any>> => {
  return await axios(`https://dummyjson.com/products/search?q=${query}`);
};

const App: FunctionComponent<AppProps> = () => {
  return (
    <section className="container mx-auto p-4">
      <SearchApiBox
        fetchFn={fetchSearchProducts}
        renderComponent={RenderProducts}
        displayValue={(product: Product) => product?.title || ""}
      />
    </section>
  );
};

export default App;

const RenderProducts: RenderComponent<ProductAPIResponse> = (data) => {
  return (
    <>
      {data.products.length === 0 ? (
        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
          Nothing found.
        </div>
      ) : (
        data?.products.map((product: Product) => (
          <ComboboxOption
            key={product.id}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-indigo-600 data-[focus]:text-white"
            value={product}
          >
            <MdCheckCircleOutline className="invisible size-4 fill-indigo-600 group-data-[focus]:fill-white group-data-[selected]:visible" />
            <div className="text-sm/6 group-data-[selected]:font-bold">
              {product.title}
            </div>
          </ComboboxOption>
        ))
      )}
    </>
  );
};
