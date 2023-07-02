import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useSendMessageMutation } from "../redux/apiSlice";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DynamicTitle from "../components/DynamicTitle";

export default function ContactForm() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submitHandler = async ({ sender, subject, content }) => {
    if (sender && content && !isLoading) {
      try {
        await sendMessage({ sender, subject, content }).unwrap();
        navigate("/contact-confirmation");
      } catch (error) {
        setErrorMessage(error.data.message);
        setModalOpen(true);
      }
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
    reset();
  };

  return (
    <div className="card max-w-screen-md mx-auto my-4 px-4 py-6">
      <DynamicTitle title="Contact us" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Contact Form</h1>
        <div className="mb-4">
          <label htmlFor="sender">Email</label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.sender ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="sender"
            autoFocus
            {...register("sender", {
              required: "Please enter email",
            })}
          />
          {errors.sender && (
            <div className="text-red-500">{errors.sender.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            className="w-full focus:ring ring-indigo-300"
            id="subject"
            autoFocus
            {...register("subject")}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content">Message</label>
          <textarea
            className={`w-full focus:ring ${
              errors.content ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="content"
            name="content"
            rows="7"
            {...register("content", {
              required: "Please type your message",
            })}
          />
          {errors.content && (
            <div className="text-red-500">{errors.content.message}</div>
          )}
        </div>
        <div className="my-6">
          <button
            aria-label="Send your message"
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
              "Send"
            )}
          </button>
        </div>
      </form>
      <Modal
        title="Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        twoButtons={false}
        isOpen={modalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
