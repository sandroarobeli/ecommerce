import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useUpdateTaxNShippingMutation,
  useGetTaxNShippingQuery,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import MessageDisplay from "../../components/MessageDisplay";
import Alert from "../../components/Alert";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function TaxNShipping() {
  const token = useSelector(selectToken);
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    data: taxNShipping,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTaxNShippingQuery();

  const [updateTaxNShipping, { isLoading: isUpdating }] =
    useUpdateTaxNShippingMutation();

  useEffect(() => {
    if (taxNShipping) {
      // Pre populate the fields with existing data for convenience
      setValue("taxRate", taxNShipping.taxRate.toFixed(2));
      setValue("shippingRate", taxNShipping.shippingRate.toFixed(2));
    }
  }, [setValue, taxNShipping]);

  const rateUpdateHandler = async ({ taxRate, shippingRate }) => {
    try {
      await updateTaxNShipping({
        token,
        taxRate: parseFloat(taxRate),
        shippingRate: parseFloat(shippingRate),
      }).unwrap();
      setShowAlert(true);
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Set Tax & Shipping rates" />
      <AdminNav pathname="/admin/tax-and-shipping" />
      <div className="md:col-span-3">
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Loading rates...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Unable to retrieve current rates. Check the internet connection or try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(rateUpdateHandler)}
          >
            <h1 className="mb-4 text-xl">Set Tax & Shipping Rates</h1>
            <div className="card mx-auto my-4 px-4 py-6">
              <div className="mb-6 w-60">
                <label htmlFor="taxRate">Tax Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="XX.XX"
                  className={`w-1/3 ml-16 focus:ring ${
                    errors.taxRate ? "ring-red-500" : "ring-indigo-300"
                  }`}
                  id="taxRate"
                  {...register("taxRate", {
                    required: "Please enter tax rate",
                    validate: (value) =>
                      value >= 0 || "Rate cannot be negative",
                  })}
                />
                <span className="ml-1 text-xl font-bold">%</span>
                {errors.taxRate && (
                  <div className="text-red-500">{errors.taxRate.message}</div>
                )}
              </div>
              <div className="mb-6 w-60">
                <label htmlFor="shippingRate">Shipping Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="XX.XX"
                  className={`w-1/3 ml-6 focus:ring ${
                    errors.shippingRate ? "ring-red-500" : "ring-indigo-300"
                  }`}
                  id="shippingRate"
                  {...register("shippingRate", {
                    required: "Please enter shipping rate",
                    validate: (value) =>
                      value >= 0 || "Rate cannot be negative",
                  })}
                />
                <span className="ml-1 text-xl font-bold">$</span>
                {errors.shippingRate && (
                  <div className="text-red-500">
                    {errors.shippingRate.message}
                  </div>
                )}
              </div>
              <div className="my-6 w-60">
                <button
                  aria-label="Update tax and or shipping rate"
                  className="primary-button w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex justify-center items-center">
                      <Spinner
                        className="mr-4"
                        strokeColor="#000000"
                        strokeWidth="18"
                      />
                      Please wait
                    </span>
                  ) : (
                    "Update Rate"
                  )}
                </button>
              </div>
            </div>
            <div className="my-6">
              <Link
                to="/admin/dashboard"
                className="text-lg font-oswald text-blue-800 hover:text-blue-900"
              >
                Back to dashboard
              </Link>
            </div>
          </form>
        )}
      </div>
      <Alert
        message={"Rate updated successfully!"}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Update Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "Unknown error has ocurred. Check the internet connection or try again later"
        }
        twoButtons={false}
        isOpen={modalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
