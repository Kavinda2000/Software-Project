import React, { useState, useEffect } from 'react';
import './Nav.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Update debouncedQuery 300ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim()) {
        try {
          const res = await axios.get(`/api/products/search?search=${encodeURIComponent(debouncedQuery)}`);
          setSuggestions(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (productTitle) => {
    setQuery(productTitle);
    setSuggestions([]);
    navigate(`/Parts?search=${encodeURIComponent(productTitle)}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/Parts?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSuggestions([]);
    }
  };

  return (
    <div className='nav-wrapper'>
      <form className='nav-container' onSubmit={handleSearch} autoComplete='off'>
        <input
          type='text'
          className='search-input'
          onChange={handleInputChange}
          value={query}
          placeholder='Search for parts...'
        />
        <div className='icon-container'>
          <button type='submit' className='icon-button' aria-label='Search'>
            <FaSearch className='nav-icons' />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className='suggestions-list'>
            {suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => handleSuggestionClick(product.title)}
                className='suggestion-item'
              >
                {product.title}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}

export default Navbar;