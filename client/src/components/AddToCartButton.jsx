import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { cartAddItem, selectAllItems } from "../redux/cartSlice";
import { useGetProductBySlugQuery } from "../redux/apiSlice";
import MessageDisplay from "./MessageDisplay";
import Modal from "./Modal";
import Alert from "./Alert";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const allItems = useSelector(selectAllItems);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { slug } = product;
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  /* 
  IMPORTANT! THIS GET PRODUCT HAPPENS EVERY CLICK TO MAKE SURE 
  THERE IS MOST UP TO DATE QUANTITY AVAILABLE. OTHER USERS MAYBE SHOPPING
  AND BUYING PRODUCTS AT THE SAME TIME AND THAT AFFECTS ACTUAL AVAILABLE QUANTITY 
  */

  const { currentQuantity, refetch, isFetching, isError, error } =
    useGetProductBySlugQuery(slug, {
      selectFromResult: ({ data, refetch, isFetching, isError, error }) => ({
        currentQuantity: data?.inStock,
        refetch: refetch,
        isFetching: isFetching,
        isError: isError,
        error: error,
      }),
    });

  const addToCartHandler = async () => {
    // refetch here so nothing gets added before unsold quantity is determined!
    refetch();
    const existingItem = allItems.find((item) => item.slug === product.slug);

    // If item is already in the cart, we increment, otherwise we add 1
    const quantityChosen = existingItem ? existingItem.quantity + 1 : 1;
    // Quantity chosen cannot exceed available stock
    // In case while user is browsing, someone buys the product and the current quantity
    // Drops to zero, I am using very current quantity of products via DB call
    if (currentQuantity < quantityChosen) {
      setModalOpen(true);
      return;
    }
    // Payload is selected products with added property: quantity
    await dispatch(cartAddItem({ ...product, quantity: quantityChosen }));
    // Deploy a mini modal to show user a product has been added
    setShowAlert(true);
    // Redirect user to cart page only if added via Product.jsx, otherwise keep'em at home page
    if (pathname !== "/") {
      navigate("/cart");
    }
  };

  return (
    <>
      {isError ? (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Unknown error has ocurred. Please try again later"
          }
          className="alert-error"
        />
      ) : (
        <button
          aria-label="Add to cart"
          className="primary-button w-full"
          onClick={addToCartHandler}
          disabled={isFetching}
        >
          Add to Cart
        </button>
      )}
      <Alert
        message={`${product.name} has been added!`}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Out of Stock!"
        titleColor="text-red-600"
        description="Order exceeded currently available quantity"
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
