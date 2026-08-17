import Products from "../models/products.model.js";
import path from "path";
import cloudinary from "../configs/cloudinary.config.js";
import upload from "../middlewares/multer.middleware.js";
import fs from "fs";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.utils.js";

export const createProductsController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message:
          "Create order fields is not provided plese order fields are provided",
      });
    }
    const inputData = req.body.inputData;
    const parseData = JSON.parse(inputData);
    const {
      title,
      description,
      orginalPrice,
      discountPrice,
      category,
      rating,
    } = parseData;
    if (!req.file) {
      return res.status(400).json({
        message: "image file is not provide plese image file provided",
      });
    }
    if (
      !title ||
      !description ||
      !discountPrice ||
      !orginalPrice ||
      !category ||
      !rating
    ) {
      return res.status(400).json({
        message: "All fields are required data",
      });
    }
    const imageUpload = await uploadToCloudinary(
      req.file?.buffer,
      "E-Commerce Store Image Data",
    );
    const image = imageUpload.secure_url;
    const createProducts = await Products.create({
      title,
      description,
      discountPrice,
      orginalPrice,
      category,
      image,
      rating,
    });
    return res.status(201).json({
      message: "Products is created",
      createProducts,
    });
  } catch (error) {
    console.log(`createProducts routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const findProducts = await Products.find({})
      .select("-createdAt")
      .select("-updatedAt");
    return res.status(200).json(findProducts);
  } catch (error) {
    console.log(`getAllProducts routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSingleProductsController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is not provide plese products id provided",
      });
    }
    if (id.length > 24 || id.length < 24) {
      return res.status(400).json({
        message: "Your products id is must be 24 digit provided now",
      });
    }
    const findSingleProducts = await Products.findById(id);
    console.log(findSingleProducts);
    if (!findSingleProducts) {
      return res.status(404).json({
        message: "This products is not found plese check your products id",
      });
    }
    return res.status(200).json(findSingleProducts);
  } catch (error) {
    console.log(`getSingleProductsController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProductsController = async (req, res) => {
  try {
    const id = req.params.id;
    const parseData = JSON.parse(req.body.inputData);
    const {
      title,
      description,
      orginalPrice,
      discountPrice,
      category,
      rating,
    } = parseData;
    if (!parseData) {
      return res.status(400).json({
        message: "You not send data plese send data and update your data",
      });
    }
    if (!id) {
      return res.status(400).json({
        message:
          "You products id is not provided plese products id is required",
      });
    }
    const findProductsData = await Products.findById(id);
    if (!findProductsData) {
      return res.status(404).json({
        message: "Products Data is not found plese check your products id",
      });
    }
    const updateImage = await uploadToCloudinary(
      req.file?.buffer,
      "E-Commerce Store Imag",
    );
    const updateProductImage = updateImage.secure_url;
    const updateProdutsData = await Products.findByIdAndUpdate(
      id,
      {
        title: parseData.title,
        description: parseData.description,
        discountPrice: parseData.discountPrice,
        orginalPrice: parseData.orginalPrice,
        category: parseData.category,
        image: updateProductImage,
        rating: parseData.rating,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Your Products data is updated",
      updateProdutsData,
    });
  } catch (error) {
    console.log(`updateProduutsController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteProductsController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message:
          "Your products id is not provided plese products id is porvided",
      });
    }
    if (id.length > 24 || id.length < 24) {
      return res.status(400).json({
        message:
          "Your products id length is must be 24 digit plese id length 24 digit porvided",
      });
    }
    const findProducts = await Products.findById(id);
    console.log(`findProducts: ${findProducts}`);
    if (!findProducts) {
      return res.status(404).json({
        message: "This products is not found plese check your products id",
      });
    }
    const deleteProducts = await Products.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Your products is deleted",
      deleteProducts,
    });
  } catch (error) {
    console.log(`deleteProductsController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
