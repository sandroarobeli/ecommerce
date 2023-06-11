import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

import {
  useGetProductBySlugQuery,
  usePostReviewMutation,
} from "../redux/apiSlice";
import { selectToken } from "../redux/userSlice";
import DynamicTitle from "../components/DynamicTitle";
import Spinner from "../components/Spinner";
import MessageDisplay from "../components/MessageDisplay";
import AddToCartButton from "../components/AddToCartButton";
import Modal from "../components/Modal";
import Alert from "../components/Alert";

export default function ProductDetail() {
  const { slug } = useParams();
  const token = useSelector(selectToken);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showReviews, setShowReviews] = useState(true);

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductBySlugQuery({ slug });

  const [postReview, { isLoading: submitLoading }] = usePostReviewMutation();

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await postReview({ id: product.id, token, content, rating }).unwrap();
      // Deploy a mini modal to show user a product has been added
      setShowAlert(true);
      setContent("");
      setRating(0);
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
    <div>
      <DynamicTitle title={product?.name || "Product Page"} />
      {isLoading && (
        <Spinner className="spinner" strokeColor="#FCD34D" strokeWidth="120" />
      )}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Unknown error has ocurred. Please try again later"
          }
          className="alert-error"
        />
      )}
      {isSuccess && (
        <div className="font-roboto">
          <div className="py-2">
            <Link
              to="/"
              className="text-xl font-oswald text-blue-800 hover:text-blue-900"
            >
              Back to products
            </Link>
          </div>
          <div className="grid md:grid-cols-4 md:gap-3">
            <div className="md:col-span-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-[500px] h-[500px] object-cover rounded-t"
              />
              {/* REVIEWS GO HERE */}
              <ul>
                <li className="mb-2">
                  {isError ? (
                    <MessageDisplay
                      title="Error:"
                      message={
                        error?.data?.message ||
                        "Unknown error has ocurred. Unable to display comments"
                      }
                      className="alert-error"
                    />
                  ) : (
                    <h2 name="reviews" id="reviews" className="text-lg">
                      {isLoading ? (
                        "Loading reviews.."
                      ) : (
                        <div className="flex">
                          Customer Reviews
                          {product.numberOfReviews !== 0 && (
                            <button
                              className={`ml-4 ${
                                showReviews ? "text-amber-600" : "text-gray-500"
                              }`}
                              onClick={() =>
                                setShowReviews((prevState) => !prevState)
                              }
                            >
                              {showReviews ? (
                                <span>hide reviews</span>
                              ) : (
                                <span>show reviews</span>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </h2>
                  )}
                </li>
                {/* List of reviews, if any */}
                {product.numberOfReviews === 0 ? (
                  <li className="mb-2 text-lg font-semibold">No reviews</li>
                ) : (
                  product.reviews.map((review) => (
                    <li
                      key={review.id}
                      className={`mb-8 flex ${
                        showReviews ? "block" : "hidden"
                      }`}
                    >
                      <div className="mr-4 pr-4 border-r-2 border-gray-300">
                        <h3 className="font-bold">{review.authorName}</h3>
                        <h4>
                          {new Date(review.createdAt)
                            .toLocaleString()
                            .substring(0, 10)
                            .replace(",", "")}
                        </h4>
                      </div>
                      <div>
                        <Rating
                          initialValue={review.reviewRating}
                          allowFraction
                          readonly
                          fillColor="#fcd34d"
                          size={15}
                          SVGstyle={{ display: "inline" }}
                        />
                        <p>{review.content.replaceAll(/&#x27;/gi, "'")}</p>
                      </div>
                    </li>
                  ))
                )}
                {/* Review form, if user is logged in. Otherwise login link */}
                <li className="mb-2">
                  {token ? (
                    <form
                      onSubmit={submitHandler}
                      className="md:ml-8 flex flex-col"
                    >
                      <label htmlFor="review" className="my-2 text-xl">
                        Leave your review
                      </label>
                      <textarea
                        id="review"
                        name="review"
                        rows="2"
                        className="mb-2 focus:ring ring-indigo-300"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                      />
                      <Rating
                        onClick={(rate) => setRating(rate)}
                        initialValue={rating}
                        allowFraction
                        fillColor="#fcd34d"
                        size={30}
                        SVGstyle={{ display: "inline" }}
                        className="mb-2"
                      />
                      <button
                        aria-label="Submit your review"
                        type="submit"
                        className="mb-8 primary-button w-[250px]"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <span className="flex justify-center items-center">
                            <Spinner
                              className="mr-4"
                              strokeColor="#000000"
                              strokeWidth="18"
                            />
                            Submitting
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </form>
                  ) : (
                    <h2>
                      Please{" "}
                      <Link
                        to={`/login?redirect=/product/${product.slug}`}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        login
                      </Link>{" "}
                      to write a review
                    </h2>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <ul className="mb-2">
                <li>
                  <h1 className="text-lg">{product.name}</h1>
                </li>
                <li>Category: {product.category}</li>
                <li>Brand: {product.brand}</li>
                <li>
                  <Rating
                    initialValue={Number.parseFloat(
                      product.productRating
                    ).toFixed(1)}
                    allowFraction
                    readonly
                    fillColor="#FCD34D"
                    size={25}
                    SVGstyle={{ display: "inline" }}
                  />
                  <a
                    href="#reviews"
                    className={`${
                      product.numberOfReviews === 0
                        ? "text-gray-300 hover:text-gray-400 active:text-gray-500"
                        : "text-amber-300 hover:text-amber-400 active:text-amber-500"
                    }`}
                  >
                    ({product.numberOfReviews} reviews)
                  </a>
                </li>
                <li>Description: {product.description}</li>
              </ul>
            </div>
            <div>
              <div className="card p-5">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>${product.price.toFixed(2)}</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  <div>{product.inStock > 0 ? "In stock" : "Sold out"}</div>
                </div>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </div>
      )}
      <Alert
        message="Review added!"
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <Modal
        title="Submission Error"
        titleColor="text-red-600"
        description={
          errorMessage ||
          "An error ocurred while submitting your review. Please try again later"
        }
        twoButtons={false}
        isOpen={modalOpen}
        onClose={handleClearError}
        clearMessage={handleClearError}
      />
    </div>
  );
}
