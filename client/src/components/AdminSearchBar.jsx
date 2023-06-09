export default function AdminSearchBar({
  value,
  onChange,
  placeholder,
  label,
}) {
  return (
    <div className="mb-4 px-2">
      <label htmlFor="search">{label}</label>
      <div className="flex items-center mt-1">
        <input
          className="focus:ring ring-indigo-300"
          type="text"
          id="admin-search"
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
