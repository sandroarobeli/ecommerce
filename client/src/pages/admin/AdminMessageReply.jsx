import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  useGetMessageByIdQuery,
  useSendReplyMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import MessageDisplay from "../../components/MessageDisplay";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function AdminMessageReply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const {
    data: message,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMessageByIdQuery({ id: id, token: token });

  const [sendReply, { isLoading: isReplying }] = useSendReplyMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Pre populate the fields for convenience
    setValue("subject", "Re: " + message?.subject.replaceAll(/&#x27;/gi, "'"));
    setValue("content", message?.content.replaceAll(/&#x27;/gi, "'"));
  }, [setValue, message]);

  const handleReplyMessage = async ({ subject, content }) => {
    try {
      await sendReply({
        emailTo: message.sender,
        subject: subject,
        content: content,
        token: token,
      }).unwrap();
      navigate("/admin/messages");
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const handleClearError = () => {
    setModalOpen(false);
    setErrorMessage("");
    reset();
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Reply to message" />
      <AdminNav pathname="/admin/messages" />
      <div className="md:col-span-3">
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Generating form...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Message cannot be displayed. Please try later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(handleReplyMessage)}
          >
            <h1 className="mb-4 text-xl">Reply To: {message.sender}</h1>
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
                rows="10"
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
                aria-label="Send reply"
                className="primary-button w-[250px]"
                disabled={isLoading}
              >
                {isReplying ? (
                  <span className="flex justify-center items-center">
                    <Spinner
                      className="mr-4"
                      strokeColor="#000000"
                      strokeWidth="18"
                    />
                    Please wait
                  </span>
                ) : (
                  "Reply"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <Modal
        title="Reply Error"
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
