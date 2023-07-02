import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectToken, selectUserAdmin } from "../redux/userSlice";
import {
  useGetOrderByIdQuery,
  useUpdatePaidStatusMutation,
  useUpdateDeliveredStatusMutation,
} from "../redux/apiSlice";
import PaypalButton from "../components/PaypalButton";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import DynamicTitle from "../components/DynamicTitle";
import MessageDisplay from "../components/MessageDisplay";

export default function PayForOrder() {
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const isAdmin = useSelector(selectUserAdmin);
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: order,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrderByIdQuery({ id, token });

  const [updatePaidStatus] = useUpdatePaidStatusMutation();
  const [updateDeliveredStatus, { isLoading: isDeliveredLoading }] =
    useUpdateDeliveredStatusMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.grandTotal },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (orderDetails) {
      try {
        await updatePaidStatus({ id: order.id, token, orderDetails }).unwrap();
        navigate("/order-confirmation");
      } catch (error) {
        setErrorMessage(error.data.message);
        setModalOpen(true);
      }
    });
  };

  const onError = (error) => {
    setErrorMessage(
      error?.data?.message ||
        "Failed to process your payment. Please contact our customer support at 1 800 777 7777"
    );
    setModalOpen(true);
  };

  const onCancel = () => {
    setShowAlert(true);
    setAlertMessage("Payment Cancelled");
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  const deliverOrder = async () => {
    try {
      await updateDeliveredStatus({ id: order.id, token }).unwrap();
      setShowAlert(true);
      setAlertMessage("Order delivery complete!");
    } catch (error) {
      setErrorMessage(error?.data?.message || "Error updating delivery status");
      setModalOpen(true);
    }
  };

  return (
    <>
      <DynamicTitle title="Order review & payment" />
      {isLoading && (
        <Spinner className="spinner" strokeColor="#FCD34D" strokeWidth="120" />
      )}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Order cannot be displayed. Check the internet connection or try again later"
          }
          className="alert-error"
        />
      )}
      {isSuccess && (
        <>
          <h1
            className={`mb-4 text-lg md:text-xl ${
              order.isPaid ? "text-green-800" : "text-red-800"
            }`}
          >{`Order: ${id}`}</h1>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5 mb-4">
                <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
                <div>
                  {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city},
                  {order.shippingAddress.state}, {order.shippingAddress.zip}
                </div>
                {order.isDelivered ? (
                  <div className="alert-success my-3 p-3 rounded-lg">
                    Delivered: {new Date(order.deliveredAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="alert-error my-3 p-3 rounded-lg">
                    Not delivered
                  </div>
                )}
              </div>

              <div className="card p-5 mb-4">
                <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
                <div>{order.paymentMethod}</div>
                {order.isPaid ? (
                  <div className="alert-success my-3 p-3 rounded-lg">
                    Paid: {new Date(order.paidAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="alert-error my-3 p-3 rounded-lg">
                    Not paid
                  </div>
                )}
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
                    {order.orderItems.map((item) => (
                      <tr key={item.name} className="border-b">
                        <td>
                          <div className="flex flex-wrap items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-[50px] h-[50px]"
                            />
                            &nbsp;
                            <span>{item.name}</span>
                          </div>
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
              </div>
            </div>

            <div>
              <div className="card p-5 mb-4">
                <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${order.itemsTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${order.taxTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${order.shippingTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${order.grandTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  {!order.isPaid && (
                    <li>
                      <div className="w-full">
                        <PaypalButton
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          onCancel={onCancel}
                        />
                      </div>
                    </li>
                  )}
                  {isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      <button
                        aria-label="Mark order as delivered"
                        className="primary-button w-full"
                        onClick={deliverOrder}
                        disabled={isDeliveredLoading}
                      >
                        {isDeliveredLoading ? (
                          <span className="flex justify-center items-center">
                            <Spinner
                              className="mr-4"
                              strokeColor="#000000"
                              strokeWidth="18"
                            />
                            Updating
                          </span>
                        ) : (
                          "Deliver"
                        )}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
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
    </>
  );
}
