import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

import { useGetProductBySlugQuery } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import Spinner from "../components/Spinner";
import MessageDisplay from "../components/MessageDisplay";
import AddToCartButton from "../components/AddToCartButton";

export default function ProductDetail() {
  const { slug } = useParams();
  const [showReviews, setShowReviews] = useState(true);

  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductBySlugQuery(slug);

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
            <Link to="/" className="text-xl font-semibold">
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
                  <li className="mb-2 text-lg">No reviews</li>
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
                            .substring(0, 11)
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
                        <p>{review.content}</p>
                      </div>
                    </li>
                  ))
                )}
                {/* Review form, if user is logged in. Otherwise login link */}
                {/* TO BE ADDED ONCE TOKEN AND LOGIN FUNCTIONALITY GETS IMPLEMENTED*/}
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
                    initialValue={Number.parseFloat(product.rating).toFixed(1)}
                    allowFraction
                    readonly
                    fillColor="#fcd34d"
                    size={25}
                    SVGstyle={{ display: "inline" }}
                  />
                  <a
                    href="#reviews"
                    className={`${
                      product.reviews === 0
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
    </div>
  );
}
