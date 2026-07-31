import Order from "../models/order.model.js";

export const createOrderController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "All order fields are required",
      });
    }
    const {
      productId,
      name,
      quantity,
      totalPrice,
      shippingAddress,
      paymentId,
      isDelivered,
      orderStatus,
    } = req.body;
    const productsArray = {
      1: "one",
      2: "two",
    };
    const shippingAddressLength = Object.keys(shippingAddress)?.length
    if (
      !productId ||
      !name ||
      !quantity ||
      !totalPrice ||
      Object.keys(shippingAddress)?.length !== 4 ||
      !paymentId ||
      !isDelivered ||
      !orderStatus
    ) {
      return res.status(400).json({
        message: "Order from are all fields are required",
      });
    }
    const createOrder = await Order.create({
      productId,
      name,
      quantity,
      totalPrice,
      shippingAddress,
      isDelivered,
      orderStatus,
      userId: req.userId,
      paymentId,
    });
    return res.status(201).json({
      message: "Order is created",
      createOrder,
    });
  } catch (error) {
    console.log(`createOrderController routes error: ${error.message}`);
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
    return res.status(200).json({
      message: "this is your order",
      findSingOrder,
    });
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
    console.log(findOrderStatus)
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
