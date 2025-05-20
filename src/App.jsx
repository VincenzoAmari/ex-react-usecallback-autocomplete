const debounce = (callback, delay) => {
  let timeout;
  return (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

import React, { useState, useEffect, useCallback } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState([]);

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setSuggestion([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3333/products?search=${query}`);
      const data = await res.json();
      setSuggestion(data);
    } catch (error) {
      console.log(error);
    }
  };

  const debounceFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  useEffect(() => {
    debounceFetchProducts(query);
  }, [query]);

  return (
    <div>
      <h1>Autocomplete</h1>
      <input
        type="text"
        placeholder="cerca un prodotto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestion.length > 0 && (
        <div className="dropdown">
          {suggestion.map((product) => (
            <p key={product.id}>{product.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
