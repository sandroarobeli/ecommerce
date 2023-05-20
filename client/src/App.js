import { Routes, Route } from "react-router-dom";
import "@fontsource/oswald/variable.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="" exact element={<Home />} />
        <Route path="cart" exact element={<Cart />} />
      </Routes>
    </Layout>
  );
}

export default App;
