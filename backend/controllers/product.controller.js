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
    const { title, price, brand, category, warranty, owner } = req.body;
    const image = req.file ? req.file.path || req.file.filename || req.file.url : null;


    if (!title || !price || !brand || !category || !warranty || !owner || !image) {
        return res.status(400).json({ success: false, message: "Please provide all fields including image" });
    }


    try {
        const existingProduct = await Product.findOne({ title, brand });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product already exists"
            });
        }

        const newProduct = new Product({
            title,
            price,
            brand,
            category,
            image,
            warranty,
            owner
        });

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