// import MessageDisplay from "../components/MessageDisplay";
// import Spinner from "../components/Spinner";
import DynamicTitle from "../components/DynamicTitle";
import SearchIcon from "../components/icons/SearchIcon";

export default function Cart() {
  return (
    <div className="w-60">
      <DynamicTitle title="Cart" />
      <button aria-label="Some text one" className="primary-button w-full">
        Add to Card
      </button>
      <button aria-label="Some text two" className="outline-button mt-4">
        Cancel
      </button>
      <button aria-label="Some text three" className="error-button m-4">
        ok
      </button>
      <button
        aria-label="Some text four"
        className="m-8 p-2 bg-amber-300 hover:bg-amber-400 active:bg-amber-500 active:scale-95"
      >
        <SearchIcon />
      </button>
    </div>
  );
}
