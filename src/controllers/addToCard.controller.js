import AddToCard from "../models/addToCard.model.js";
import User from "../models/auth.model.js";
import Products from "../models/products.model.js";

export const addToCardController = async (req, res) => {
  const productsId = req.params.id;
  console.log(productsId);
  try {
    const findProducts = await Products.findById(productsId);
    if (!findProducts) {
      return res.status(404).json({
        message: "this products is not find plese check your products id",
      });
    }
    const findUser = await User.findById(req.userId);
    if (!findUser) {
      return res.status(404).json({
        message: "this user is not find",
      });
    }
    const findAddToCard = await AddToCard.findOne({
      userId: findUser._id,
      productsId: findProducts._id,
    });
    if (findAddToCard) {
      findAddToCard.quentity += 1;
      await findAddToCard.save();
      return res.status(200).json({
        message: "products quentity is added",
      });
    }
    const createAddToCard = await AddToCard.create({
      userId: findUser?._id,
      productsId: productsId,
      quentity: 1,
    });
    return res.status(201).json({
      message: "add to card your products",
    });
  } catch (error) {
    console.log(`addToCardController error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAddToCardController = async (req, res) => {
  try {
    const userId = req.userId;
    const findAddToCard = await AddToCard.find({ userId }).populate(
      "productsId",
    );
    return res.status(200).json(findAddToCard);
  } catch (error) {
    console.log(`getAddToCardContoller error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteAddToCardController = async (req, res) => {
  try {
    const userId = req.userId;
    const addToCardId = req.params.id;
    console.log(addToCardId)
    const findAddToCard = await AddToCard.findOne({
      userId: userId,
      productsId: addToCardId
    });
    console.log(addToCardId)
    console.log(findAddToCard);
    if (!findAddToCard?._id) {
      return res.status(404).json({
        message: "this item is not found",
      });
    }
    if (findAddToCard.userId.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "this is not your add to card item",
      });
    }
    console.log(findAddToCard);
    const deleteAddToCard = await AddToCard.findByIdAndDelete(
      findAddToCard._id,
    );
    console.log(deleteAddToCard);
    return res.status(200).json({
      message: "delete this add to card products item",
    });
  } catch (error) {
    console.log(`deleteAddToCardController error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addToCardIncreaseQuentityController = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.params.id
    const findAddToCard = await AddToCard.findOne({
      userId,
      productsId: itemId
    })
    if(!findAddToCard){
      return res.status(400).json({
        message: "productsId and userId is wrong and item is not found"
      })
    }
      findAddToCard.quentity += 1
      await findAddToCard.save()
      return res.status(200).json({
        message: "item quentity is added"
      })
    return res.status(200).json(findAddToCard)
  } catch (error) {
    console.log(`addToCardQuentityController error: ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
};

export const addToCardDecreaseQuentityController = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.params.id
    const findAddToCard = await AddToCard.findOne({
      userId,
      productsId: itemId
    })
    if(!findAddToCard){
      return res.status(400).json({
        message: "productsId and userId is wrong and item is not found"
      })
    }
    if(findAddToCard?.quentity === 1 || findAddToCard?.quentity < 1){
      return res.status(400).json({
        message: "this item quentity is not valid"
      })
    }
      findAddToCard.quentity -= 1
      await findAddToCard.save()
      return res.status(200).json({
        message: "item quentity is decerease"
      })
    return res.status(200).json(findAddToCard)
  } catch (error) {
    console.log(`addToCardQuentityController error: ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
};
