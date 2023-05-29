import { Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "@fontsource/oswald/variable.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Spinner from "./components/Spinner";

import {
  selectToken,
  selectTokenExpiration,
  logout,
} from "./redux/userSlice.js";
import { cartReset } from "./redux/cartSlice";
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  // const isAdmin = useSelector(selectUserAdmin);
  const tokenExpiration = useSelector(selectTokenExpiration);

  // function defining what to do due to inactivity
  const onIdle = () => {
    if (token) {
      dispatch(cartReset());
      localStorage.removeItem("cart");
      dispatch(logout());
      navigate("/inactivity");
    }
  };

  // Method defining when to invoke the above function
  useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 30, // 30 minutes to inactivity logout
    throttle: 500,
  });

  // Remaining time till auto logout (user privacy, in case user forgets to log out)
  // Not to be confused with inactivity logout. Auto logout is set to 2 hrs.
  let remainingTime = tokenExpiration - new Date().getTime();

  // If both variables are present, meaning user is logged in, the countdown to auto logout begins.
  if (token && tokenExpiration) {
    setTimeout(() => {
      dispatch(cartReset());
      localStorage.removeItem("cart");
      dispatch(logout());
      navigate("/login");
    }, remainingTime);
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <Layout>
        <Suspense
          fallback={
            <Spinner
              className="spinner"
              strokeColor="#FCD34D"
              strokeWidth="120"
            />
          }
        >
          <Routes>
            <Route path="" exact element={<Home />} />
            <Route path="product/:slug" exact element={<ProductDetail />} />
            <Route path="cart" exact element={<Cart />} />
            <Route path="login" exact element={<Login />} />
          </Routes>
        </Suspense>
      </Layout>
    </PayPalScriptProvider>
  );
}

export default App;
