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
        type: String,
        required: true
    },
    discountPrice: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
})

const Products = mongoose.model("Products", productsSchema)
export default Products