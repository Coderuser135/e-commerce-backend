import AddToCard from "../models/addToCard.model.js";

export const calculateProductsItemAmount = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!req.body) {
      return res.status(400).json({
        message: "All order fields are required",
      });
    }
    console.log(req.body);
    const { name, shippingAddress } = req.body;
    if (!name || Object.keys(shippingAddress)?.length !== 6) {
      return res.status(400).json({
        message: "Order from are all fields are required",
      });
    }
    const findAddToCard = await AddToCard.find({ userId: userId }).populate(
      "productsId",
    );
    // price item data calculation
    const totalPrice = findAddToCard.reduce((acc, current) => {
      return acc + current?.productsId?.discountPrice * current?.quentity;
    }, 0);
    // dicount calculate
    let discount = 0;
    let shipping = 0;
    if (totalPrice >= 50000) {
      discount = (totalPrice * 25) / 100;
      shipping = 500;
    } else if (totalPrice >= 25000) {
      discount = (totalPrice * 15) / 100;
      shipping = 350;
    } else if (totalPrice >= 15000) {
      discount = (totalPrice * 10) / 100;
      shipping = 150;
    } else {
      discount = (totalPrice * 5) / 100;
      shipping = 0;
    }
    const totalAmount = totalPrice - discount + shipping;
    const orderItem = findAddToCard.map((item) => ({
      productsId: item?.productsId?._id,
      title: item?.productsId?.title,
      quentity: item?.quentity,
      image: item?.productsId?.image,
      price: item?.productsId?.discountPrice,
    }));
    req.totalAmount = totalAmount;
    req.orderItem = orderItem;
    req.subTotal = totalPrice + shipping;
    req.shippingAddress = req.body.shippingAddress;
    req.quentity = findAddToCard?.length;
    req.name = req.body.name;
    next();
  } catch (error) {
    console.log(
      `calculateProductsItemAmout controller error: ${error.message}`,
    );
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
