export default function MessageDisplay({ title, message, className }) {
  return (
    <div className={`card w-auto mx-auto p-4 font-roboto ${className}`}>
      <h2 className="text-xl">{title}</h2>
      <p>{message}</p>
    </div>
  );
}
