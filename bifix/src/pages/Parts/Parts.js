import React, { useState, useEffect } from 'react';
import Nav from './Navigation/Nav';
import Sidebar from './Sidebar/Sidebar';
import Card from './PartComponents/Card';
import { Link, useLocation } from 'react-router-dom';
import stringSimilarity from 'string-similarity';

function Parts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestedQuery, setSuggestedQuery] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    setQuery(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);

          // Suggestion logic
          if (query && query.length >= 3) {
            const allWords = data.data.flatMap(p => [p.title, p.brand, p.category]);
            const matches = stringSimilarity.findBestMatch(query.toLowerCase(), allWords.map(w => w.toLowerCase()));
            if (matches.bestMatch.rating > 0.6 && matches.bestMatch.target !== query.toLowerCase()) {
              setSuggestedQuery(matches.bestMatch.target);
            } else {
              setSuggestedQuery("");
            }
          } else {
            setSuggestedQuery("");
          }

        } else {
          console.error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err.message);
      }
    };

    fetchProducts();
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSuggestionClick = () => {
    setQuery(suggestedQuery);
    setSuggestedQuery("");
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    if (query) {
      const words = query.toLowerCase().split(' ');
      filteredProducts = filteredProducts.filter((product) =>
        words.every((word) =>
          product.title.toLowerCase().includes(word) ||
          product.brand.toLowerCase().includes(word) ||
          product.category.toLowerCase().includes(word)
        )
      );
    }

    if (selected) {
      filteredProducts = filteredProducts.filter(({ category, price, brand }) =>
        category === selected || price.toString() === selected || brand === selected
      );
    }

    return filteredProducts.map(({ title, price, brand, category, image, warranty, owner, _id }) => (
      <Link to={`/Parts/${_id}`} key={_id} style={{ textDecoration: 'none', color: 'black' }}>
        <Card
          title={title}
          price={price}
          brand={brand}
          category={category}
          img={image}
          warranty={warranty}
          owner={owner}
          _id={_id}
        />
      </Link>
    ));
  }

  const result = filteredData(products, selectedCategory, query);

  return (
    <>
      <Nav query={query} handleInputChange={handleInputChange} setQuery={setQuery} />

      <Sidebar handleChange={handleChange} />
      <section className='card-container'>

        {suggestedQuery && (
          <div style={{ padding: '10px', color: '#ff7300', fontWeight: 'bold' }}>
            Did you mean: <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleSuggestionClick}>
              {suggestedQuery}
            </span>?
          </div>
        )}

        {result}
      </section>
    </>
  );
}

export default Parts;
