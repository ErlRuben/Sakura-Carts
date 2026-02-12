import { useState, useEffect } from 'react';

function SearchBar({ value, onChange }) {
  const [input, setInput] = useState(value || '');

  useEffect(() => {
    setInput(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input-field pl-10"
      />
    </div>
  );
}

export default SearchBar;
