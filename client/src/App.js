import { Routes, Route } from "react-router-dom";
import "@fontsource/oswald/variable.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
// START DEVELOPING LAYOUT AND SEE THE NOTES IN INDEX.CSS ABOUT MOVING BODY CSS TO LAYOUT'S
// OUTER DIV CSS. ALSO, TEST LIGHTHOUSE EVERY STEP OF THE WAY. GOOD LUCK!!!
// TODAY, SUNDAY: DO THE HOME PAGE. START WITH SERVER, DB, GET WITH PAGINATION, UI PAGINATION
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="" exact element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
