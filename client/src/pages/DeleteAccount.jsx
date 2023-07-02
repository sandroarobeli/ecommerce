import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  selectToken,
  selectUserId,
  clearError,
  logout,
} from "../redux/userSlice";
import { useDeleteAccountMutation } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const id = useSelector(selectUserId);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const submitHandler = async ({ email }) => {
    try {
      await deleteAccount({ id, email, token }).unwrap();
      // Deleting User's orders will not be performed automatically as the result.
      // That would affect admin's ability to access sales & financial stats
      // Instead per prisma functionality, order.ownerId will be set to Null
      // And instead of user name it will say DELETED USER.
      // Deleting deleted user's orders will be under admin functionality anyway
      dispatch(logout());
      navigate("/");
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
    dispatch(clearError());
    reset();
  };

  return (
    <div className="card max-w-screen-md mx-auto my-4 px-4 py-6">
      <DynamicTitle title="Delete account" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Delete Account</h1>
        <h2 className="alert-error my-3 p-3 rounded-lg">
          Please note, deleting this account is irreversible and cannot be
          undone! For security purposes, verify your current email.
        </h2>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.email ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4 mt-6">
          <button
            aria-label="Delete account"
            className="error-button w-[250px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <Spinner
                  className="mr-4"
                  strokeColor="#FFFFFF"
                  strokeWidth="18"
                />
                Processing
              </span>
            ) : (
              "Delete Account"
            )}
          </button>
        </div>
      </form>
      <Modal
        title="Delete Error"
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
