import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Settings, Trash2 } from "lucide-react"; 
import './VendorProductList.css';
import UpdateProductForm from './update products/UpdateProductForm';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';

const SERVER_URL = 'http://localhost:5000/api/';
Modal.setAppElement('#root');

const VendorProductList = ({ user, refresh }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ Handle delete with toast + delay
  const handleDelete = async (id) => {
  if (!id) return; // safety
  setProcessing(true);
  try {
    await axios.delete(`${SERVER_URL}products/${id}`);
    // Remove product after short delay so user sees toast
    setTimeout(() => {
      setProducts(products.filter((p) => p._id !== id));
    }, 1000);
  } catch (err) {
    console.error("Error deleting product:", err);
  } finally {
    setProcessing(false);
    setIsDeleteModalOpen(false);
    setDeleteProductId(null);
  }
};


  // ✅ Handle update with processing overlay + toast
  const handleUpdate = async (updatedProduct) => {
    setProcessing(true);
    try {
      await axios.put(`${SERVER_URL}products/${updatedProduct._id}`, updatedProduct);
      setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    } finally {
      setProcessing(false);
      setEditingProduct(null);
    }
  };

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}products`);
        const allProducts = res.data.data;
        const userProducts = allProducts.filter(
          (product) => product.owner === user.email || product.owner === user.name
        );
        setProducts(userProducts);
      } catch (err) {
        console.error('Error fetching vendor products:', err);
      }
    };
    if (user) fetchVendorProducts();
  }, [user, refresh]);

  return (
    <div className="vendor-product-list">

    <ToastContainer position="bottom-right" />
      {/* ✅ Full-screen processing overlay */}
      {processing && (
        <div className="processing-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {/* Update form */}
      {editingProduct && (
        <UpdateProductForm 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onUpdated={handleUpdate}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirm Delete"
        className="delete-modal"
        overlayClassName="delete-modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h3>Are you sure?</h3>
        <p>Do you really want to delete this product? This action cannot be undone.</p>
        <div className="delete-modal-buttons">
          <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="confirm-btn" onClick={() => handleDelete(deleteProductId)}>Delete</button>
        </div>
      </Modal>

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="vendor-product-card">
            <a href={`/product/${product._id}`} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
             <img src={product.image} alt={product.title} className="product-img" />
              <h3>{product.title}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Warranty:</strong> {product.warranty}</p>
            </a>

            <div className="action-buttons">
              <button className="update-btn" onClick={() => setEditingProduct(product)}>
                <Settings size={18} />
              </button>
              <button 
                className="delete-btn" 
                onClick={() => {
                  setDeleteProductId(product._id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorProductList;
