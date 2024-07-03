import { FunctionComponent } from "react";
import SearchApiBox from "./components/SearchApiBox";

interface AppProps {}

const App: FunctionComponent<AppProps> = () => {
  return (
    <section className="container mx-auto p-4">
      <SearchApiBox />
    </section>
  );
};

export default App;
