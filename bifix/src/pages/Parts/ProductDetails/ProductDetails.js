import { useParams } from "react-router-dom";
import PartList from "../PartList";
import './ProductDetails.css';
import { FaShoppingCart } from "react-icons/fa";



const ProductDetails = () => {
  const { id } = useParams();
  const product = PartList[id];

  if (!product) {
    return <div className="p-4 text-red-600">Product not found</div>;
  }

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
          <button className="button-87"><FaShoppingCart /></button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
