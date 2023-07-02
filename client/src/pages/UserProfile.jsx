import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  selectUserName,
  selectUserEmail,
  selectToken,
  clearError,
} from "../redux/userSlice";
import {
  useUpdateProfileMutation,
  useCredentialLoginMutation,
} from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);
  const token = useSelector(selectToken);
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [credentialLogin] = useCredentialLoginMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Pre populate the fields with user's existing data for convenience
    setValue("name", name);
    setValue("email", email);
  }, [email, name, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await updateProfile({ name, email, password, token }).unwrap();
      // And re-login with new credentials..
      await credentialLogin({
        email: email,
        // Here I need to enter yet unencrypted password, so login controller can encrypt it!
        password: password,
      }).unwrap();

      navigate("/");
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
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
      <DynamicTitle title={`Profile - ${name}`} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className={`w-full focus:ring ${
              errors.name ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
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
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.password ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="password"
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
          <label htmlFor="confirmPassword">Confirm Password</label>
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
            aria-label="Update profile"
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
                Updating
              </span>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
        <div className="mb-4">
          <button
            aria-label="Delete account"
            className="error-button w-[250px]"
            type="button"
            onClick={() => navigate("/delete-account")}
          >
            Delete Account
          </button>
        </div>
      </form>
      <Alert
        message="Profile updated successfully!"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Error:"
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
