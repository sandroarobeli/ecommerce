export default function Pagination({ toPrevPage, toNextPage }) {
  return (
    <div className="mt-10 mb-6">
      <button
        aria-label="Previous page"
        className="w-1/2 px-4 py-2 font-oswald font-bold uppercase rounded-tl-3xl rounded-bl-3xl rounded-tr-none rounded-br-none border-r-[1px] border-white bg-black text-white text-xl hover:text-black hover:bg-amber-300 transition duration-300 active:text-black active:bg-amber-300 active:scale-95"
        onClick={toPrevPage}
      >
        Previous
      </button>
      <button
        aria-label="Next page"
        className="w-1/2 px-4 py-2 font-oswald font-bold uppercase rounded-tr-3xl rounded-br-3xl rounded-tl-none rounded-bl-none border-l-[1px] border-white bg-black text-white text-xl  hover:text-black hover:bg-amber-300 transition duration-300 active:text-black active:bg-amber-300 active:scale-95"
        onClick={toNextPage}
      >
        Next
      </button>
    </div>
  );
}
