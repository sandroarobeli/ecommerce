export default function ErrorMessage({ message }) {
  return (
    <div className="card w-auto mx-auto bg-red-100 text-red-800 shadow-xl">
      <div className="card-body font-roboto">
        <h2 className="card-title">Error:</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
