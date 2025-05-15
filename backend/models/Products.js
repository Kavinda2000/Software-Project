import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    warranty: {
        type: String,
        required: true,
    },
    reviews: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
})

// Compound index to prevent duplicate products with same title + brand
productSchema.index({ title: 1, brand: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
