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
  selectUserAdmin,
  selectToken,
  selectTokenExpiration,
  logout,
} from "./redux/userSlice.js";
import { cartReset } from "./redux/cartSlice";
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Search = lazy(() => import("./pages/Search"));
const ShippingAddress = lazy(() => import("./pages/ShippingAddress"));
const PaymentMethod = lazy(() => import("./pages/PaymentMethod"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const PayForOrder = lazy(() => import("./pages/PayForOrder"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminNewProduct = lazy(() => import("./pages/admin/AdminNewProduct"));
const AdminEditProduct = lazy(() => import("./pages/admin/AdminEditProduct"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminEditUser = lazy(() => import("./pages/admin/AdminEditUser"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const Inactivity = lazy(() => import("./pages/Inactivity"));
const PasswordResetEmail = lazy(() => import("./pages/PasswordResetEmail"));
const ExpiredLink = lazy(() => import("./pages/ExpiredLink"));
const PasswordResetForm = lazy(() => import("./pages/PasswordResetForm"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isAdmin = useSelector(selectUserAdmin);
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
            <Route path="register" exact element={<Register />} />
            <Route path="search" exact element={<Search />} />
            {token && (
              <Route
                path="shipping-address"
                exact
                element={<ShippingAddress />}
              />
            )}
            {token && (
              <Route path="payment-method" exact element={<PaymentMethod />} />
            )}
            {token && (
              <Route path="place-order" exact element={<PlaceOrder />} />
            )}
            {token && (
              <Route path="order/:id" exact element={<PayForOrder />} />
            )}
            {token && (
              <Route path="order-history" exact element={<OrderHistory />} />
            )}
            {token && (
              <Route path="user-profile" exact element={<UserProfile />} />
            )}
            {token && (
              <Route path="delete-account" exact element={<DeleteAccount />} />
            )}
            {token && isAdmin && (
              <Route
                path="admin/dashboard"
                exact
                element={<AdminDashboard />}
              />
            )}
            {token && isAdmin && (
              <Route path="admin/orders" exact element={<AdminOrders />} />
            )}
            {token && isAdmin && (
              <Route path="admin/products" exact element={<AdminProducts />} />
            )}
            {token && isAdmin && (
              <Route
                path="admin/new-product"
                exact
                element={<AdminNewProduct />}
              />
            )}
            {token && isAdmin && (
              <Route
                path="admin/product/:slug"
                exact
                element={<AdminEditProduct />}
              />
            )}
            {token && isAdmin && (
              <Route path="admin/users" exact element={<AdminUsers />} />
            )}
            {token && isAdmin && (
              <Route path="admin/user/:id" exact element={<AdminEditUser />} />
            )}
            <Route
              path="order-confirmation"
              exact
              element={<OrderConfirmation />}
            />
            <Route
              path="email-confirmation"
              exact
              element={<EmailConfirmation />}
            />
            <Route path="inactivity" exact element={<Inactivity />} />
            <Route
              path="password-reset-email"
              exact
              element={<PasswordResetEmail />}
            />
            <Route path="expired-link" exact element={<ExpiredLink />} />
            <Route path="valid-link" exact element={<PasswordResetForm />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </PayPalScriptProvider>
  );
}

export default App;
