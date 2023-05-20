export default function CartIcon() {
  return (
    <div className="relative hover:scale-105">
      <svg
        className="h-7 w-7 sm:h-8 sm:w-8"
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
      <span className="absolute -top-3 -right-3 inline-block min-w-2 m-auto py-1 px-2 rounded-full text-xs align-middle font-bold bg-red-600">
        8
      </span>
    </div>
  );
}
