import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectShippingAddress, saveShippingAddress } from "../redux/cartSlice";
import { states } from "../utils/states";
import { phoneFormatter } from "../utils/phoneFormatter";
import CheckoutWizard from "../components/CheckoutWizard";
import DynamicTitle from "../components/DynamicTitle";

export default function ShippingAddress() {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Pre populate the fields with user's existing data for convenience
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("state", shippingAddress.state);
    setValue("zip", shippingAddress.zip);
    setValue("phone", shippingAddress.phone);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, state, zip, phone }) => {
    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        state,
        zip: zip.toString(),
        phone,
      })
    );
    navigate("/payment-method");
  };

  return (
    <CheckoutWizard activeStep={1}>
      <DynamicTitle title="Shipping address" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            className={`w-full focus:ring ${
              errors.fullName ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className={`w-full focus:ring ${
              errors.address ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="address"
            {...register("address", {
              required: "Please enter address",
              minLength: {
                value: 3,
                message: "Address must be more than 3 characters",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className={`w-full focus:ring ${
              errors.city ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="city"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="state">State</label>
          <select
            className={`custom-select w-full focus:ring ${
              errors.state ? "ring-red-500" : "ring-indigo-300"
            }`}
            name="state"
            id="state"
            {...register("state", {
              required: "Please select a state",
            })}
          >
            <option value="" className="text-left">
              Please select a state
            </option>
            {states.map((state) => (
              <option key={state} value={state} className="text-left">
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <div className="text-red-500">{errors.state.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="zip">Zip Code</label>
          <input
            type="number"
            placeholder="XXXXX"
            className={`w-full focus:ring ${
              errors.zip ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="zip"
            {...register("zip", {
              required: "Please enter zip code",
              validate: (value) =>
                value.length === 5 || "Must contain 5 digits",
            })}
          />
          {errors.zip && (
            <div className="text-red-500">{errors.zip.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            placeholder="XXX XXX XXXX"
            className={`w-full focus:ring ${
              errors.phone ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="phone"
            {...register("phone", {
              required: "Please enter a phone number",
              onChange: (e) =>
                setValue("phone", phoneFormatter(e.target.value)),
              minLength: {
                value: 14,
                message: "Please enter a valid phone number",
              },
            })}
          />
          {errors.phone && (
            <div className="text-red-500">{errors.phone.message}</div>
          )}
        </div>

        <div className="mb-4 mt-8">
          <button
            aria-label="Navigate to payment method"
            className="primary-button"
          >
            Next
          </button>
        </div>
      </form>
    </CheckoutWizard>
  );
}
