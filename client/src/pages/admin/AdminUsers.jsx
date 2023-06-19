import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import MessageDisplay from "../../components/MessageDisplay";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

export default function AdminUsers() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllUsersQuery({ token });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sets value for filtering through existing users
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleUserDelete = async () => {
    try {
      setDeleteModalOpen(false);
      await deleteUser({ id: userToDelete, token }).unwrap();
      setShowAlert(true);
    } catch (error) {
      setErrorMessage(error.data.message);
      setErrorModalOpen(true);
    }
  };

  const handleClearError = () => {
    setErrorModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin users" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Users</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter name or email..."
          label="Search users"
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
            Generating users...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Products cannot be displayed. Please try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">NAME</th>
                  <th className="p-5 text-left">EMAIL</th>
                  <th className="pr-9 pl-1 text-left">SINCE</th>
                  <th className="p-5 text-left">ADMIN</th>
                  <th className="p-5 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user) =>
                    (user.name.toLowerCase().includes(searchValue) ||
                      user.email.toLowerCase().includes(searchValue)) && (
                      <tr key={user.id} className="border-b">
                        <td className="pr-7 pl-3">
                          {user.id.substring(20, 24)}
                        </td>
                        <td className="p-5">{user.name}</td>
                        <td className="pr-9 pl-1">{user.email}</td>
                        <td className="pr-9 pl-1">
                          {new Date(user.createdAt)
                            .toLocaleString()
                            .substring(0, 10)
                            .replace(",", "")}
                        </td>
                        <td className="pr-2 pl-8">
                          {user.isAdmin ? "YES" : "NO"}
                        </td>
                        <td className="pr-2 pl-4">
                          <Link
                            to={`/admin/user/${user.id}`}
                            className="text-blue-800 hover:text-blue-900 mr-1"
                          >
                            Edit
                          </Link>
                          &nbsp;
                          <button
                            className="text-red-600 hover:text-red-700 active:text-red-800"
                            onClick={() => {
                              setUserToDelete(user.id);
                              setDeleteModalOpen(true);
                            }}
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
        message="User deleted successfully"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Proceed with deletion?"
        titleColor="text-red-600"
        description="Please note, deletion is irreversible and cannot be undone!"
        twoButtons={true}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleUserDelete}
        clearMessage={() => setDeleteModalOpen(false)}
      />
      <Modal
        title="Delete Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        twoButtons={false}
        isOpen={errorModalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
