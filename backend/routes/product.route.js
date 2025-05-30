import express from "express"
import { createProduct, deleteProduct, getProducts, updateProduct, getProductById } from "../controllers/product.controller.js"
import multer from "multer";

const router = express.Router()

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });




router.get("/", getProducts)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)
router.get("/:id", getProductById);


export default router