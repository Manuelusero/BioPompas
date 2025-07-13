import { useState, useEffect } from "react";
import axios from "axios";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState([]);

  // Get product suggestions on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/products?isFeatured=true`)
      .then(res => setSuggested(res.data.slice(0, 4)))
      .catch(() => setSuggested([]));
  }, []);

  return (
    <div className="searchPage">
      <div className="searchHeaderRow">
        <h1 className="searchTitle">Search products</h1>
        <img src="/src/assets/Icons/Cart.svg" alt="Cart" className="searchCartIcon" />
      </div>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="searchInput"
      />
      {/* Product suggestions */}
      {suggested.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="suggestionLabel">Suggestions:</div>
          <div className="suggestionPills">
            {suggested.map(prod => (
              <span key={prod._id || prod.id} className="suggestionPill">{prod.name}</span>
            ))}
          </div>
        </div>
      )}
      {/* Search results placeholder */}
      <div className="searchResultsPlaceholder">
        (Search results will appear here)
      </div>
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/src/assets/Icons/Home.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/src/assets/Icons/Searchseccion.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default Search;
