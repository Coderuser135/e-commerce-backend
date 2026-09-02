import razorpay from "../configs/razorpay.confing.js";
import AddToCard from "../models/addToCard.model.js";
import Order from "../models/order.model.js";
import crypto from "crypto";

export const createPaymentOrderController = async (req, res) => {
  try {
    const totalAmount = req.totalAmount;
    const totalPaisa = Math.round(totalAmount * 100);
    const createPaymentOrder = await razorpay.orders.create({
      amount: totalPaisa,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    console.log(createPaymentOrder.id);
    return res.status(200).json({
      message: "your payment order is created",
      paymentOrderId: createPaymentOrder.id,
      amount: totalAmount,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.log(`paymentOrderController error: ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
      error: error,
    });
  }
};

export const paymentVerifyController = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
      console.log(req.body)
    const name = req.name;
    const userId = req.userId;
    const orderItems = req.orderItem;
    const generateSignutare = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    console.log(`generated signutate ${generateSignutare}`);
    console.log(razorpay_signature, generateSignutare)
    if (generateSignutare !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verify faild",
      });
    }
    const { state, country, phone, pinCode, address, city } =
      req.shippingAddress;
      const createOrder = await Order.create({
        userId,
        orderItems,
        fullName: name,
        quentity: req.quentity,
        subTotalPrice: req.subTotal,
        totalPrice: req.totalAmount,
        shippingAddress: {
          city,
          phone,
          pinCode,
          state,
          country,
          address,
        },
        payment: {
          method: "razorpay",
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
        },
      });
    const findAddToCard = await AddToCard.find({ userId: userId }).populate(
      "productsId",
    );
    const deleteAddToCardItem = await AddToCard.deleteMany(
      { userId: userId },
      { findAddToCard },
      { new: true },
    );
    return res.status(200).json({
      message: "Payment verify successfully and order is created",
      createOrder,
    });
  } catch (error) {
    console.log(`paymentVerifyController error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllOrderController = async (req, res) => {
  try {
    const findAllOrder = await Order.find({});
    return res.status(200).json({
      message: "find all order",
      findAllOrder,
    });
  } catch (error) {
    console.log(`getAllOrderController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return res.status(401).json({
        message: "You are unAuthorize user plese login now",
      });
    }
    const findSingOrder = await Order.find({ userId: id });
    if (!findSingOrder) {
      return res.status(404).json({
        message: "this order is not found plese check your id",
      });
    }
    return res.status(200).json(findSingOrder);
  } catch (error) {
    console.log(`getSingleOrderController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Order status is not provided plese order status is provided",
      });
    }
    const id = req.params.id;
    const { status } = req.body;
    if (id.length > 24 || id.length < 24) {
      return res.status(400).json({
        message:
          "check your products id plese products id length is provided must be 24 digit length",
      });
    }
    if (!id) {
      return res.status(400).json({
        message: "id is not provided plese id is provided",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status is not privided plese status is provided",
      });
    }
    const findOrderStatus = await Order.findById(id);
    console.log(findOrderStatus);
    if (!findOrderStatus) {
      return res.status(404).json({
        message: "This Order is not found plese check your order products id",
      });
    }

    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Order status is updated",
      updateOrderStatus,
    });
  } catch (error) {
    console.log(`updateOrderStatusController routes errro: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.status(400).json({
        message: "order id is not provided plese order id is provided",
      });
    }
    if (req.params.id.length > 24 || req.params.id.length < 24) {
      return res.status(400).json({
        message: "Order is length is must be 24 digit length",
      });
    }
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "This order is deleted",
      deleteOrder,
    });
  } catch (error) {
    console.log(`deleteOrderController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
