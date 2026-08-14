import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    orginalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Products = mongoose.model("Products", productsSchema)
export default Products