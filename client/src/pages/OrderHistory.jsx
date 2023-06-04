import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetOrderHistoryQuery } from "../redux/apiSlice";
import { selectToken } from "../redux/userSlice";
import Spinner from "../components/Spinner";
import DynamicTitle from "../components/DynamicTitle";
import MessageDisplay from "../components/MessageDisplay";

export default function OrderHistory() {
  const token = useSelector(selectToken);

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrderHistoryQuery({ token });

  return (
    <>
      <DynamicTitle title="Order history" />
      {isLoading && (
        <Spinner className="spinner" strokeColor="#FCD34D" strokeWidth="120" />
      )}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Unknown error has ocurred. Please try again later"
          }
          className="alert-error"
        />
      )}
      {isSuccess &&
        (orders.length === 0 ? (
          <h3 className="mb-4 text-lg">No orders found for this customer</h3>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">DATE</th>
                  <th className="p-5 text-left">TOTAL</th>
                  <th className="p-5 text-left">PAID</th>
                  <th className="p-5 text-left">DELIVERED</th>
                  <th className="p-5 text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-5">{order.id.substring(20, 24)}</td>
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
                            .substring(0, 11)
                            .replace(",", "")
                        : "not paid"}
                    </td>
                    <td className="p-5">
                      {order.isDelivered
                        ? new Date(order.deliveredAt)
                            .toLocaleString()
                            .substring(0, 11)
                            .replace(",", "")
                        : "not delivered"}
                    </td>
                    <td className="p-5">
                      <Link
                        to={`/order/${order.id}`}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </>
  );
}
