import SearchIcon from "./icons/SearchIcon";

export default function SearchBar({ onSubmit, onChange }) {
  return (
    <form onSubmit={onSubmit} className="mx-auto">
      <div className="flex justify-center">
        <input
          type="text"
          id="search"
          onChange={onChange}
          className="rounded-tr-none rounded-br-none text-md sm:text-lg focus:ring-0"
          placeholder="Search products.."
        />
        <button
          type="submit"
          className="rounded-tl-none rounded-bl-none p-2 bg-amber-300 hover:bg-amber-300"
          id="button-addon"
          aria-label="search button"
        >
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}
