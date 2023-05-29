import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectPage } from "../redux/pageSlice";
import {
  cartAddItem,
  cartRemoveItem,
  selectAllItems,
} from "../redux/cartSlice";
import { useGetAllProductsQuery } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import XCircleIcon from "../components/icons/XCircleIcon";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import MessageDisplay from "../components/MessageDisplay";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allItems = useSelector(selectAllItems);
  const page = useSelector(selectPage);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    data: currentlyUnsoldProducts,
    refetch,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetAllProductsQuery(page);

  const removeItemHandler = (item) => {
    dispatch(cartRemoveItem(item));
  };

  const updateCartHandler = async (item, quantity) => {
    refetch();
    // available quantity condition not needed - actually, when it re fetches, it updates
    // unsold products array, thus updating select drop down. so no need for conditional
    const quantityAdded = Number(quantity);
    const currentlyUnsoldProduct = currentlyUnsoldProducts.find(
      (product) => product.slug === item.slug
    );
    // Quantity chosen cannot exceed available stock
    // In case while user is browsing, someone buys the product and the current quantity
    // Drops to zero, I am using very current quantity of products via DB call
    if (currentlyUnsoldProduct?.inStock < quantityAdded) {
      setModalOpen(true);
      return;
    }
    dispatch(cartAddItem({ ...item, quantity: quantityAdded }));
    setShowAlert(true);
  };

  return (
    <>
      <DynamicTitle title="Cart" />
      {isFetching && (
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
      {isSuccess && (
        <div className="font-roboto">
          <h1 className="mb-4 text-xl">Shopping Cart</h1>
          {allItems.length === 0 ? (
            <h4>
              Cart is empty.{" "}
              <Link to="/" className="text-blue-800 hover:text-blue-900">
                Go shopping
              </Link>
            </h4>
          ) : (
            <div className="grid md:grid-cols-4 gap-5">
              <div className="overflow-x-auto mt-4 md:col-span-3">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="p-5 text-right">Quantity</th>
                      <th className="p-5 text-right">Price</th>
                      <th className="p-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.map((item) => (
                      <tr
                        key={item.slug}
                        className={`border-b ${isFetching && "opacity-50"}`}
                      >
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
                        <td className="p-5 text-right">
                          <select
                            value={item.quantity}
                            className="custom-select"
                            onChange={(event) =>
                              updateCartHandler(item, event.target.value)
                            }
                          >
                            {[...Array(item.inStock).keys()].map((number) => (
                              <option
                                key={number + 1}
                                value={number + 1}
                                // className="bg-amber-300 text-gray-900 font-semibold text-right md:text-lg"
                              >
                                {number + 1}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-5 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="p-5 text-center">
                          <button
                            aria-label="Remove item"
                            onClick={() => removeItemHandler(item)}
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card p-5">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({allItems.reduce((a, c) => a + c.quantity, 0)})
                      : $
                      {allItems
                        .reduce((a, c) => a + c.quantity * c.price, 0)
                        .toFixed(2)}
                    </div>
                  </li>
                  <li>
                    <button
                      aria-label="Check out"
                      onClick={() =>
                        navigate("/login?redirect=/shipping-address")
                      }
                      className="primary-button mt-2 w-full"
                    >
                      Check Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      <Alert
        message={"Quantity adjusted"}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Out of Stock!"
        description="Order exceeded currently available quantity"
        textColor="text-red-700"
        twoButtons={false}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        clearMessage={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
}
