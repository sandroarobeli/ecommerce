import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  useGetMessageByIdQuery,
  useDeleteMessageMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import MessageDisplay from "../../components/MessageDisplay";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function AdminMessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: message,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMessageByIdQuery({ id: id, token: token });

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const handleMessageDelete = async (id) => {
    try {
      await deleteMessage({ id: id, token: token }).unwrap();
      navigate("/admin/messages");
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
      <DynamicTitle title="Message from customer" />
      <AdminNav pathname="/admin/messages" />
      <div className="md:col-span-3">
        {isDeleting && (
          <Spinner
            className="spinner"
            strokeColor="#FCD34D"
            strokeWidth="120"
          />
        )}
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Loading message...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Message cannot be displayed. Check the internet connection or try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <div className="mx-auto max-w-screen-md">
            <div className="w-40 mb-4 flex justify-between">
              <Link
                to={`/admin/reply/${message.id}`}
                className="rounded px-4 py-2 shadow outline outline-offset-0 outline-1 text-blue-700 outline-blue-700 font-oswald font-semibold uppercase bg-white hover:text-white hover:bg-blue-700"
              >
                Reply
              </Link>
              <button
                aria-label="Delete this message"
                className="error-button"
                onClick={() => handleMessageDelete(message.id)}
              >
                Delete
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {message.subject
                  ? message.subject.replaceAll(/&#x27;/gi, "'")
                  : "No subject"}
              </h2>
              <p>{message.content.replaceAll(/&#x27;/gi, "'")}</p>
            </div>
            <div className="my-6">
              <Link
                to="/admin/messages"
                className="text-lg font-oswald text-blue-800 hover:text-blue-900"
              >
                Back to messages
              </Link>
            </div>
          </div>
        )}
      </div>
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
