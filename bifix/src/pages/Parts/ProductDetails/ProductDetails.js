import { useParams } from "react-router-dom";
import { useState } from "react";
import PartList from "../PartList";
import './ProductDetails.css';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';


const ProductDetails = () => {
  const { id } = useParams();
  const product = PartList[id];
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-4 text-red-600">Product not found</div>;
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="product-container">
      <div className="product-content">
        <img src={product.img} alt={product.title} className="product-image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <p>Brand: {product.Brand}</p>
          <p>Category: {product.category}</p>
          <p>Warranty: {product.warranty}</p>
          <p>Price: Rs.{product.pprice}</p>
          <p>Reviews: {product.reviews}</p>
          <div className="flex text-yellow-300 text-xl mt-2">
            {product.star} {product.star} {product.star}
          </div>
          <div className="quantity-selector mt-3">
            <label htmlFor="quantity" className="mr-2">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input w-16 text-center border rounded p-1"
              min="1"
            />
          </div>

          <Link to={{
  pathname: `/Parts/${id}/checkout`,  // The path should be properly wrapped in backticks for template literal
  state: { product, quantity }  // Passing product and quantity to Checkout page
}}>
  <button className="button-87 mt-3"><FaShoppingCart /></button> 
</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
