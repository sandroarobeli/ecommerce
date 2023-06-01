import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  selectAllItems,
  selectShippingAddress,
  selectPaymentMethod,
  clearCartError,
  clearCartItems,
} from "../redux/cartSlice";
import { selectToken } from "../redux/userSlice";
import { usePlaceOrderMutation } from "../redux/apiSlice";
import CheckoutWizard from "../components/CheckoutWizard";
import DynamicTitle from "../components/DynamicTitle";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const allItems = useSelector(selectAllItems);
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Auxillary rounding function
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  /* PRICING VARIABLES */
  // Sums up all the items prices times each item quantity and rounds it to 2 digits after decimal
  const itemsTotalBeforeRounding = useMemo(
    () => allItems.reduce((a, c) => a + c.quantity * c.price, 0),
    [allItems]
  );
  const itemsTotal = round2(itemsTotalBeforeRounding);
  // Tax cost is variable, depending on the jurisdiction and will be set by the user
  const taxTotal = round2(itemsTotal * 0.11);
  // Shipping and Handling cost is arbitrary and can be set at the user's discretion
  const shippingTotal = itemsTotal > 200 ? 0 : 15;
  const grandTotal = round2(itemsTotal + taxTotal + shippingTotal);

  useEffect(() => {
    if (!paymentMethod) {
      return navigate("/payment-method");
    }
  }, [navigate, paymentMethod]);

  const placeOrderHandler = async () => {
    if (!isLoading) {
      try {
        const order = await placeOrder({
          token: token,
          orderItems: allItems,
          shippingAddress,
          paymentMethod,
          itemsTotal,
          taxTotal,
          shippingTotal,
          grandTotal,
        }).unwrap();
        // DO NOT CLEAR ITEMS! WE NEED TO ITERATE THEM TO DEDUCT QUANTITIES FROM DB
        // WHEN A USER COMPLETES PAYMENT IN PAY-FOR-ORDER
        // await dispatch(clearCartItems());
        // Send another email with the receipt and order confirmation info + possible shipping info
        navigate(`/order/${order.id}`);
      } catch (error) {
        setErrorMessage(error.data.message); // Local Error state get populated by Redux error
        setModalOpen(true);
      }
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    dispatch(clearCartError());
    setErrorMessage("");
  };

  return (
    <CheckoutWizard activeStep={3}>
      <DynamicTitle title="Place order" />
      <h1 className="mb-4 text-xl font-roboto">Place Order</h1>
      {allItems.length === 0 ? (
        <h4 className="font-roboto">
          Cart is empty. <Link to="/">Go shopping</Link>
        </h4>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 font-roboto">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5 mb-4">
              <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city},{shippingAddress.state},{" "}
                {shippingAddress.zip}
              </div>
              <div>
                <Link to="/shipping-address">Edit</Link>
              </div>
            </div>
            <div className="card p-5 mb-4">
              <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link to="/payment-method">Edit</Link>
              </div>
            </div>
            <div className="card p-5 mb-4 overflow-x-auto">
              <h2 className="mb-2 text-lg font-semibold">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td>
                        <Link
                          to={`/product/${item.slug}`}
                          className="flex flex-wrap items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[50px] h-[50px]"
                          />
                          &nbsp;
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td className="p-5 text-center md:text-right">
                        {item.quantity}
                      </td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Link to="/cart" className="text-blue-800 hover:text-blue-900">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5 mb-4">
              <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${grandTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <button
                    aria-label="Place order"
                    className="primary-button w-full"
                    onClick={placeOrderHandler}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex justify-center items-center">
                        <Spinner
                          className="mr-4"
                          strokeColor="#000000"
                          strokeWidth="18"
                        />
                        Processing
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Processing Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "Failed to process your order. Please contact our customer support at 1 800 777 7777"
        }
        twoButtons={false}
        isOpen={modalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </CheckoutWizard>
  );
}
