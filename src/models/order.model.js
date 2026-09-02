import mongoose from 'mongoose';

// Define the schema for individual items inside an order
const orderItemSchema = new mongoose.Schema({
  productsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products', // References your Product model
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  quentity: { 
    type: Number, 
    required: true, 
    min: [1, 'Quantity cannot be less than 1.'] 
  },
  price: { 
    type: Number, 
    required: true // Snapshot of price at the time of purchase
  },
  image: {
    type: String,
    required: false
  }
});

// Define the main Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References your User model
      required: true
    },
    orderItems: [orderItemSchema], // Array of sub-documents
    shippingAddress: {
      state: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true }
    },
    fullName: {
      type: String,
      required: true
    },
    shippingPrice: {
      type: String,
      required: true,
      default: "Free"
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    subTotalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    payment:{
      method:{
        type: String,
        default: "razorpay"
      },
      status: {
        type: String,
        enum: [
          "pending",
          "paid",
          "faild",
          "refunded"
        ],
        default: "pending"
      },
      razorpayOrderId: {
        type: String
      },
      razorpayPaymentId: {
        type: String
      }
    }
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' timestamp fields
    timestamps: true 
  }
);

// Compile the schema into a Model and export it
const Order = mongoose.model('Order', orderSchema);
export default Order;
