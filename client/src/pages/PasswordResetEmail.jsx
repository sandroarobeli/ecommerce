import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { usePasswordResetEmailMutation } from "../redux/apiSlice";
import { clearError } from "../redux/userSlice";
import DynamicTitle from "../components/DynamicTitle";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function PasswordResetEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [passwordResetEmail, { isLoading }] = usePasswordResetEmailMutation();

  const submitEmailHandler = async ({ email }) => {
    try {
      await passwordResetEmail({ email }).unwrap();
      navigate("/email-confirmation");
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
      <DynamicTitle title="Password reset email" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitEmailHandler)}
      >
        <h1 className="mb-4 text-xl font-roboto">Reset Password</h1>
        <div className="mb-4 font-roboto">
          <label htmlFor="email">
            Enter email associated with this account and we will send you a link
            to reset your password.
          </label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.email ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="email"
            autoFocus
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
        <div className="mb-4">
          <button
            aria-label="Submit your email for password reset link"
            className="primary-button w-[250px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <Spinner
                  className="mr-4"
                  strokeColor="#000000"
                  strokeWidth="18"
                />
                Please wait
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
      <Modal
        title="Submission Error"
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
