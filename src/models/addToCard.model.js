import mongoose from "mongoose";

const addToCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requird: true,
  },
  productsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quentity: {
    type: Number,
    required: true,
    min: [1, "minium 1 products quentity"],
  },
});

const AddToCard = mongoose.model("AddToCard", addToCardSchema)
export default AddToCard