import Product from "../models/Product.js";
import Customization from "../models/Customization.js";
import mongoose from "mongoose";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts };

// Save Customization Controller
const saveCustomization = async (req, res) => {
  const { userId, modelId, color, textureUrl, size } = req.body;
  console.log(req.body);

  try {
    // Validate size object structure
    if (size && (typeof size !== "object" || !size.width || !size.height || !size.depth)) {
      return res.status(400).json({ message: "Invalid size format." });
    }

    const customization = new Customization({
      userId : "60b9f1b3b3b3b3b3b3b3b3b3",
      productId :modelId,
      color,
      texture : textureUrl,
       size: {
        width: size.width,
        height: size.height,
        depth: size.depth,
      },
      
    });

    await customization.save();

    res.status(201).json({
      message: "Customization saved successfully.",
      customization,
    });
  } catch (error) {
    console.error("Error saving customization:", error.message);
    res.status(500).json({ message: "Failed to save customization.", error: error.message });
  }
};

export { saveCustomization };


// Get Customizations Controller

export const getallCustomizations = async (req, res) => {

  try {
    const customizations = await Customization.find();
    res.json(customizations);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

}

