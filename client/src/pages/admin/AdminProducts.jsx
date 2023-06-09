import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import { setPage, selectPage } from "../../redux/pageSlice";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import Spinner from "../../components/Spinner";
import DynamicTitle from "../../components/DynamicTitle";
import MessageDisplay from "../../components/MessageDisplay";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import Pagination from "../../components/Pagination";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const page = useSelector(selectPage);

  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productToDelete, setProductToDelete] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllProductsQuery(page);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sets value for filtering through existing products
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleProductDelete = async () => {
    try {
      setDeleteModalOpen(false);
      await deleteProduct({ id: productToDelete, token }).unwrap();
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
      <DynamicTitle title="Admin products" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <Pagination
          toPrevPage={() => dispatch(setPage(page - 1))}
          toNextPage={() => dispatch(setPage(page + 1))}
        />
        <h1 className="mb-4 text-xl">Products</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter name or category..."
          label="Search products"
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
            Generating products..
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
                  <th className="p-5 text-left">PRICE</th>
                  <th className="p-5 text-left">CATEGORY</th>
                  <th className="p-5 text-left">COUNT</th>
                  <th className="p-5 text-left">RATING</th>
                  <th className="p-5 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map(
                  (product) =>
                    (product.name.toLowerCase().includes(searchValue) ||
                      product.category.toLowerCase().includes(searchValue)) && (
                      <tr key={product.id} className="border-b">
                        <td className="pr-6 pl-4">
                          {product.id.substring(20, 24)}
                        </td>
                        <td className="p-5">{product.name}</td>
                        <td className="p-5">${product.price.toFixed(2)}</td>
                        <td className="pr-2 pl-8">{product.category}</td>
                        <td className="pr-2 pl-8">{product.inStock}</td>
                        <td className="pr-2 pl-8">{product.productRating}</td>
                        <td className="pr-2 pl-4">
                          <Link
                            to={`/admin/product/${product.id}`}
                            className="text-blue-800 hover:text-blue-900 mr-1"
                          >
                            Edit
                          </Link>
                          &nbsp;
                          <button
                            className="text-red-600 hover:text-red-700 active:text-red-800"
                            onClick={() => {
                              setProductToDelete(product.id);
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
        message="Product deleted successfully"
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
        onSubmit={handleProductDelete}
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
