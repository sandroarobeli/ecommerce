import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useUpdatePasswordMutation } from "../redux/apiSlice";
import { clearError } from "../redux/userSlice";
import DynamicTitle from "../components/DynamicTitle";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

export default function PasswordResetForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const updatePasswordHandler = async ({ email, password }) => {
    if (email && password) {
      try {
        await updatePassword({ email, password }).unwrap();
        navigate("/login");
      } catch (error) {
        setErrorMessage(error.data.message);
        setModalOpen(true);
      }
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
    setPasswordVisible(false);
    dispatch(clearError());
    reset();
  };

  return (
    <div className="card max-w-screen-md mx-auto my-4 px-4 py-6">
      <DynamicTitle title="Password reset" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(updatePasswordHandler)}
      >
        <h1 className="mb-4 text-xl">Update Password</h1>
        <div className="mb-4">
          <label htmlFor="email">Current Email</label>
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
        <div className="mb-4">
          <label htmlFor="password">New Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.password ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="password"
            autoFocus
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password must be minimum 6 characters long",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.confirmPassword ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Password must be minimum 6 characters long",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500">Passwords do not match</div>
            )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            onChange={() =>
              setPasswordVisible((passwordVisible) => !passwordVisible)
            }
            id="showPassword"
            className="w-5 h-5 mr-2 cursor-pointer"
          />{" "}
          <label htmlFor="showPassword">Show password</label>
        </div>
        <div className="mb-4">
          <button
            aria-label="Reset password"
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
              "Update"
            )}
          </button>
        </div>
      </form>
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
