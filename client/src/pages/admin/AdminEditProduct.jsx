import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useGetProductBySlugQuery,
  useUpdateProductMutation,
  useGetCloudinarySignatureQuery,
  useUploadImageMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import MessageDisplay from "../../components/MessageDisplay";
import Alert from "../../components/Alert";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

export default function AdminEditProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductBySlugQuery({ slug });

  // Gets the signature generated on page load, so by the time user selects an
  // Image, signature is ready to authenticate the upload
  const {
    data: credentials,
    isError: isSignatureError,
    error: signatureError,
  } = useGetCloudinarySignatureQuery({ token });

  const [uploadImage, { isLoading: isUploading, isError: isUploadError }] =
    useUploadImageMutation();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (product) {
      // Pre populate the fields with product's existing data for convenience
      setValue("name", product.name.replaceAll(/&#x27;/gi, "'"));
      setValue("slug", product.slug);
      setValue("price", product.price);
      setValue("image", product.image);
      setValue("category", product.category);
      setValue("brand", product.brand);
      setValue("inStock", product.inStock);
      setValue("description", product.description.replaceAll(/&#x27;/gi, "'"));
    }
  }, [product, setValue]);

  const imageUploadHandler = async (event, imageField = "image") => {
    try {
      // api call to to receive signature & timestamp credentials
      if (isSignatureError) {
        setErrorMessage(signatureError.data.message);
        setModalOpen(true);
      }
      // Capture the file from PC and prep formData object
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", credentials.signature);
      formData.append("timestamp", credentials.timestamp);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
      // api call to upload the image  to Cloudinary and receive new image
      const imageOnCloud = await uploadImage(formData).unwrap();
      if (isUploadError) {
        setErrorMessage(
          "Error ocurred while uploading the image. Please try again later."
        );
        setModalOpen(true);
      }
      // Change url in image field from old to new url from cloudinary
      if (imageOnCloud) {
        setValue(imageField, imageOnCloud.secure_url);
        setShowAlert(true);
      }
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const productUpdateHandler = async ({
    name,
    slug,
    price,
    image,
    category,
    brand,
    inStock,
    description,
  }) => {
    try {
      await updateProduct({
        id: product.id,
        token,
        name,
        slug,
        price: parseFloat(price),
        image,
        category,
        brand,
        inStock: parseInt(inStock),
        description,
      }).unwrap();
      navigate("/admin/products");
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
      <DynamicTitle title="Product profile" />
      <AdminNav pathname="/admin/products" />
      <div className="md:col-span-3">
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Loading product...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Product cannot be displayed. Please try later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(productUpdateHandler)}
          >
            <h1 className="mb-4 text-xl">{`Edit Product ${product?.id}`}</h1>
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
                  required: "Product name must be present",
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.slug ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="slug"
                {...register("slug", {
                  required: "Product slug must be present",
                })}
              />
              {errors.slug && (
                <div className="text-red-500">{errors.slug.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.category ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="category"
                {...register("category", {
                  required: "Please enter product category",
                })}
              />
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.brand ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="brand"
                {...register("brand", {
                  required: "Product brand must be present",
                })}
              />
              {errors.brand && (
                <div className="text-red-500">{errors.brand.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.description ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="description"
                {...register("description", {
                  required: "Product description must be present",
                })}
              />
              {errors.description && (
                <div className="text-red-500">{errors.description.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="image">Image</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.image ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="image"
                {...register("image", {
                  required: "Product image must be present",
                })}
              />
              {errors.image && (
                <div className="text-red-500">{errors.image.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="imageFile">Upload image</label>
              <input
                type="file"
                className="w-full"
                id="imageFile"
                onChange={imageUploadHandler}
              />
              {isUploading && (
                <div className="animate-pulse text-blue-800">Uploading..</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.price ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="price"
                {...register("price", {
                  required: "Product price must be present",
                })}
              />
              {errors.price && (
                <div className="text-red-500">{errors.price.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="inStock">Stock Count</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.inStock ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="inStock"
                {...register("inStock", {
                  required: "Product stock count must be present",
                })}
              />
              {errors.inStock && (
                <div className="text-red-500">{errors.inStock.message}</div>
              )}
            </div>
            <div className="mb-4">
              <button
                aria-label="Create product"
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
                  "Update Product"
                )}
              </button>
            </div>
            <div className="my-6">
              <Link
                to="/admin/products"
                className="text-lg font-oswald text-blue-800 hover:text-blue-900"
              >
                Back to products
              </Link>
            </div>
          </form>
        )}
      </div>
      <Alert
        message="Image upload successful"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
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
