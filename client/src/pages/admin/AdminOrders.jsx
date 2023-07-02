import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectToken } from "../../redux/userSlice";
import {
  useGetAdminOrdersQuery,
  useDeleteOrderMutation,
} from "../../redux/apiSlice";
import AdminSearchBar from "../../components/AdminSearchBar";
import DynamicTitle from "../../components/DynamicTitle";
import MessageDisplay from "../../components/MessageDisplay";
import AdminNav from "../../components/AdminNav";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

export default function AdminOrders() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdminOrdersQuery({ token });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sets value for filtering through existing orders
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleOrderDelete = async () => {
    try {
      setDeleteModalOpen(false);
      await deleteOrder({ id: orderToDelete, token }).unwrap();
      setShowAlert(true);
    } catch (error) {
      setErrorMessage(error.data.message);
      setErrorModalOpen(true);
    }
  };

  const handleClearError = () => {
    setErrorModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin orders" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Orders</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter customer name..."
          label="Search orders"
        />
        {isDeleting && (
          <Spinner
            className="spinner"
            strokeColor="#FCD34D"
            strokeWidth="120"
          />
        )}
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Generating orders...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Orders cannot be displayed. Check the internet connection or try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">USER</th>
                  <th className="p-5 text-left">DATE</th>
                  <th className="p-5 text-left">TOTAL</th>
                  <th className="p-5 text-left">PAID</th>
                  <th className="p-5 text-left">DELIVERED</th>
                  <th className="p-5 text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* Filters to show existing users' orders */}
                {orders
                  .filter((order) => order.owner !== null)
                  .map(
                    (order) =>
                      order.owner.name.toLowerCase().includes(searchValue) && (
                        <tr key={order.id} className="border-b">
                          <td className="p-5">{order.id.substring(20, 24)}</td>
                          <td className="p-5">{order.owner.name}</td>
                          <td className="pl-3 pr-7">
                            {new Date(order.createdAt)
                              .toLocaleString()
                              .substring(0, 10)
                              .replace(",", "")}
                          </td>
                          <td className="p-5">
                            ${order.grandTotal.toFixed(2)}
                          </td>
                          <td className="pl-3 pr-7">
                            {order.isPaid
                              ? new Date(order.paidAt)
                                  .toLocaleString()
                                  .substring(0, 10)
                                  .replace(",", "")
                              : "not paid"}
                          </td>
                          <td className="p-5">
                            {order.isDelivered
                              ? new Date(order.deliveredAt)
                                  .toLocaleString()
                                  .substring(0, 10)
                                  .replace(",", "")
                              : "not delivered"}
                          </td>
                          <td>
                            <Link
                              to={`/order/${order.id}`}
                              className="text-blue-800 hover:text-blue-900"
                            >
                              Details
                            </Link>
                            &nbsp;
                            <button
                              className="text-red-600 hover:text-red-700 active:text-red-800"
                              onClick={() => {
                                setOrderToDelete(order.id);
                                setDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                {/* Filters to show deleted users' orders */}
                {orders
                  .filter((order) => order.owner === null)
                  .map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-5">{order.id.substring(20, 24)}</td>
                      <td className="p-5">DELETED USER</td>
                      <td className="p-5">
                        {new Date(order.createdAt)
                          .toLocaleString()
                          .substring(0, 10)
                          .replace(",", "")}
                      </td>
                      <td className="p-5">${order.grandTotal.toFixed(2)}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? new Date(order.paidAt)
                              .toLocaleString()
                              .substring(0, 10)
                              .replace(",", "")
                          : "not paid"}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? new Date(order.deliveredAt)
                              .toLocaleString()
                              .substring(0, 10)
                              .replace(",", "")
                          : "not delivered"}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order.id}`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          Details
                        </Link>
                        &nbsp;
                        <button
                          className="text-red-600 hover:text-red-700 active:text-red-800"
                          onClick={() => {
                            setOrderToDelete(order.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Alert
        message="Order deleted successfully"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Proceed with deletion?"
        titleColor="text-red-600"
        description="Please note, removing an order will affect sales summary and order count. deletion is irreversible and cannot be undone!"
        twoButtons={true}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleOrderDelete}
        clearMessage={() => setDeleteModalOpen(false)}
      />
      <Modal
        title="Delete Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "Unknown error has ocurred. Check the internet connection or try again later"
        }
        twoButtons={false}
        isOpen={errorModalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
