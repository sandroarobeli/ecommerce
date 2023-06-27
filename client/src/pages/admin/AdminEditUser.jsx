import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import MessageDisplay from "../../components/MessageDisplay";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [adminStatus, setAdminStatus] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit } = useForm();

  const { user, isLoading, isSuccess, isError, error } = useGetAllUsersQuery(
    { token },
    {
      selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
        isLoading: isLoading,
        isSuccess: isSuccess,
        isError: isError,
        error: error,
        user: data?.find((user) => user.id === id),
      }),
    }
  );

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    // Pre populate the fields with user's existing data for convenience
    setAdminStatus(user.isAdmin);
  }, [user.isAdmin]);

  const userUpdateHandler = async () => {
    try {
      // Only runs if status has been changed
      if (adminStatus !== user.isAdmin) {
        await updateUser({ id: user.id, token, isAdmin: adminStatus }).unwrap();
      }
      navigate("/admin/users");
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
      <DynamicTitle title="Edit user status" />
      <AdminNav pathname="/admin/users" />
      <div className="md:col-span-3">
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">Loading user...</p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "User cannot be displayed. Please try later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(userUpdateHandler)}
          >
            <h1 className="mb-4 text-xl">{`Set User Admin Status for ${user?.name}`}</h1>
            <div className="card mx-auto my-4 px-4 py-6">
              <div>
                <button
                  aria-label="Set user as admin"
                  type="button"
                  className={`mb-6 w-[250px] ${
                    adminStatus ? "primary-button" : "outline-button"
                  }`}
                  onClick={() => setAdminStatus(true)}
                >
                  Admin User
                </button>
              </div>
              <div>
                <button
                  aria-label="Set user as regular"
                  type="button"
                  className={`mb-6 w-[250px] ${
                    adminStatus ? "outline-button" : "primary-button"
                  }`}
                  onClick={() => setAdminStatus(false)}
                >
                  Regular User
                </button>
              </div>
              <div className="my-6">
                <button
                  aria-label="Set user status"
                  className="primary-button w-[250px]"
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
                    "Update Status"
                  )}
                </button>
              </div>
            </div>
            <div className="my-6">
              <Link
                to="/admin/users"
                className="text-lg font-oswald text-blue-800 hover:text-blue-900"
              >
                Back to users
              </Link>
            </div>
          </form>
        )}
      </div>
      <Modal
        title="Update Error"
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
