import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectShippingAddress,
  selectPaymentMethod,
  savePaymentMethod,
} from "../redux/cartSlice";
import CheckoutWizard from "../components/CheckoutWizard";
import Modal from "../components/Modal";
import DynamicTitle from "../components/DynamicTitle";

export default function PaymentMethod() {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { handleSubmit, register, setValue } = useForm();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!shippingAddress.address) {
      return navigate("/shipping-address");
    }
    // Pre populate the fields with user's existing data for convenience
    setValue("localPaymentMethod", paymentMethod || "");
  }, [navigate, paymentMethod, setValue, shippingAddress]);

  const submitHandler = ({ localPaymentMethod }) => {
    if (!localPaymentMethod) {
      return setModalOpen(true);
    }
    dispatch(savePaymentMethod(localPaymentMethod));
    // Redirection to final place-order screen
    navigate("/place-order");
  };

  return (
    <CheckoutWizard activeStep={2}>
      <DynamicTitle title="Payment method" />
      <form
        className="mx-auto max-w-screen-md font-roboto"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["PayPal / Credit Card", "Cash on delivery"].map((payment) => (
          <div key={payment} className="mb-4 flex items-center">
            <label htmlFor={payment} className="p-2 font-roboto">
              {payment}
            </label>
            <input
              value={payment}
              name="paymentMethod"
              type="radio"
              className="w-4 h-4 ml-3"
              id={payment}
              {...register("localPaymentMethod", {
                onChange: (e) => setValue("localPaymentMethod", e.target.value),
              })}
            />
          </div>
        ))}
        <div className="mb-4 mt-8 flex justify-between">
          <Link to="/shipping-address" className="outline-button">
            Back
          </Link>
          <button
            aria-label="Navigate to place order"
            className="primary-button"
          >
            Next
          </button>
        </div>
      </form>
      <Modal
        title="Selection Error"
        titleColor="text-red-600"
        description="Payment method is required"
        twoButtons={false}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        clearMessage={() => setModalOpen(false)}
      />
    </CheckoutWizard>
  );
}
