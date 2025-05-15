import mongoose from "mongoose"
import Product from "../models/Products.js"


export const getProducts = async (req,res) =>{
    try {
        const products = await Product.find({})
        res.status(200).json({success:true, data:products})
    } catch (error) {
        console.log("error in fetching products", error.message)
        res.status(500).json({success:false, message: "Server Error"})
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;

    if (
        !product.title || 
        !product.price || 
        !product.brand || 
        !product.category || 
        !product.warranty || 
        !product.image || 
        !product.reviews ||
        !product.owner
    ) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Check for duplicate based on title and brand
        const existingProduct = await Product.findOne({ title: product.title, brand: product.brand });

        if (existingProduct) {
            return res.status(409).json({ 
                success: false, 
                message: "Product already exists" 
            });
        }

        const newProduct = new Product(product);
        await newProduct.save();

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creating product:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: Failed to create product" 
        });
    }
};

export const updateProduct = async(req,res) =>{
    const {id} = req.params

    const product = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"Invalid Product Id"})
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true})
        res.status(200).json({success:true, data:updatedProduct})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error"})

    }
}

export const deleteProduct = async(req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"Invalid Product Id"})
    }


    try {
        await Product.findByIdAndDelete(id)
        res.status(200).json({success: true, message: "Product deleted"})
    } catch (error) {
        console.log("error in deleting product: ", error.message)
        res.status(500).json({success:false, message:"Server Error"})
    }
}



// Fetch a specific product by ID
export const getProductById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Product ID" });
    }
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.log("Error in fetching product:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };