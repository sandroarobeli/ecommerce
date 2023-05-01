import { Link } from "react-router-dom";

export default function CartIcon() {
  return (
    <Link to="/cart" className="" aria-label="Link to cart page">
      <label
        tabIndex={0}
        className="btn bg-black hover:bg-black hover:scale-110"
      >
        <div className="indicator">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="badge badge-md indicator-item bg-red-600">8</span>
        </div>
      </label>
    </Link>
  );
}
