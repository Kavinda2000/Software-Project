import React, { useState, useEffect } from 'react';
import Nav from './Navigation/Nav';
import Sidebar from './Sidebar/Sidebar';
import Card from './PartComponents/Card';
import { Link } from 'react-router-dom'; // Import Link


function Parts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err.message);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
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
      <Nav query={query} handleInputChange={handleInputChange} />
      <Sidebar handleChange={handleChange} />
      <section className='card-container'>
        {result}
      </section>
    </>
  );
}

export default Parts;
