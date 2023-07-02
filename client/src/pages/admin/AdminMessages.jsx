import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  useGetAllMessagesQuery,
  useDeleteMessageMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import MessageDisplay from "../../components/MessageDisplay";
import Alert from "../../components/Alert";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function AdminMessages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: messages,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllMessagesQuery({ token });

  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sets value for filtering through existing users
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleMessageDelete = async (id) => {
    try {
      await deleteMessage({ id: id, token: token }).unwrap();
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
      <DynamicTitle title="Admin messages" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Messages</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter sender email..."
          label="Search messages"
        />
        {isDeleting && (
          <Spinner
            className="spinner"
            strokeColor="#FCD34D"
            strokeWidth="120"
          />
        )}
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Loading messages...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Messages cannot be displayed. Check the internet connection or try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">FROM</th>
                  <th className="pl-10 pr-0 text-left">DATE</th>
                  <th className="p-5 text-center">SUBJECT</th>
                  <th className="pl-2 pr-8 text-center">CONTENT</th>
                  <th className="pl-2 pr-8 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(
                  (message) =>
                    message.sender.toLowerCase().includes(searchValue) && (
                      <tr
                        key={message.id}
                        className={`border-b ${
                          message.hasBeenRead ? "" : "bg-gray-100"
                        }`}
                      >
                        <td className="pl-0 pr-10">{message.sender}</td>
                        <td className="pl-0 pr-10">
                          {new Date(message.createdAt)
                            .toLocaleString()
                            .substring(0, 21)
                            .replace(",", "")}
                        </td>
                        <td
                          className="p-5 cursor-pointer"
                          onClick={() =>
                            navigate(`/admin/message/${message.id}`)
                          }
                        >
                          {message.subject
                            ? message.subject.replaceAll(/&#x27;/gi, "'")
                            : "No subject"}
                        </td>
                        <td
                          className="px-20 cursor-pointer"
                          onClick={() =>
                            navigate(`/admin/message/${message.id}`)
                          }
                        >
                          {message.content.substring(0, 35).length > 20
                            ? message.content
                                .replaceAll(/&#x27;/gi, "'")
                                .substring(0, 35) + "..."
                            : message.content
                                .replaceAll(/&#x27;/gi, "'")
                                .substring(0, 35)}
                        </td>
                        <td className="p-5">
                          <button
                            aria-label="Delete this message"
                            className="text-red-600 hover:text-red-700 active:text-red-800"
                            onClick={() => handleMessageDelete(message.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Alert
        message="Message deleted!"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Delete Error"
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
