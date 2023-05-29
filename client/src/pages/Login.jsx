import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { clearError, selectToken } from "../redux/userSlice";
import {
  useGoogleLoginMutation,
  useCredentialLoginMutation,
} from "../redux/apiSlice";
import Modal from "../components/Modal";
import DynamicTitle from "../components/DynamicTitle";
import Spinner from "../components/Spinner";

export default function Login() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const whence = params.get("redirect");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [googleLogin] = useGoogleLoginMutation();
  const [credentialLogin, { isLoading }] = useCredentialLoginMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (token) {
      navigate(whence || "/");
    }
  }, [navigate, token, whence]);

  const submitWithCredentialsHandler = async ({ email, password }) => {
    if (email && password && !isLoading) {
      try {
        await credentialLogin({ email, password }).unwrap();
      } catch (error) {
        setErrorMessage(error.data.message);
        setModalOpen(true);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGoogleLogin = async (googleResponse) => {
    try {
      const userData = await googleLogin({
        credential: googleResponse.credential,
      }).unwrap();

      if (!userData) {
        throw new Error(userData.message);
      }
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: 250,
      });
    }
  }, [handleGoogleLogin]);

  const handleClearError = () => {
    setModalOpen(false);
    setPasswordVisible(false);
    dispatch(clearError());
    setErrorMessage("");
    reset();
  };

  return (
    <div className="card max-w-screen-md mx-auto my-4 px-4 py-6">
      <DynamicTitle title="Login" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitWithCredentialsHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
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
          <Link
            to="/password-reset-email"
            className="text-xs text-blue-800 hover:text-blue-900"
          >
            Forgot password?
          </Link>
        </div>
        <div className="mb-4">
          <button
            aria-label="Login with credentials"
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
              "Login"
            )}
          </button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          {/* If we end up registering via page other than home, we return to that page */}
          <Link
            to={`/register?redirect=${whence || "/"}`}
            className="text-blue-800 hover:text-blue-900"
          >
            Register
          </Link>
        </div>
      </form>
      <div className="mx-auto max-w-screen-md mb-4 flex justify-between items-center">
        <span className="h-0.5 w-1/2 mr-3 bg-gray-200"></span>
        <span>or</span>
        <span className="h-0.5 w-1/2 ml-3 bg-gray-200"></span>
      </div>
      <div className="mx-auto mt-8 max-w-screen-md">
        <button
          id="signInDiv"
          data-text="signin_with"
          aria-label="Login with Google"
        ></button>
      </div>

      <Modal
        title="Login Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        textColor="text-red-700"
        twoButtons={false}
        isOpen={modalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
