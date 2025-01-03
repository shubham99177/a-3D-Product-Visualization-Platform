import { Schema, model } from "mongoose";



const productSchema = new Schema({
  name: { type: String, required: true },
  modelPath: { type: String, required: true },
  textures: [{ type: String }],
  colors: [{ type: String }], // Array of available colors as hex codes or names
  size: {
    width: { type: Number, required: true }, // Width in desired units (e.g., cm, inches)
    height: { type: Number, required: true }, // Height in desired units
    depth: { type: Number, required: true }, // Depth in desired units
  },
});

const Product = model("Product", productSchema);

export default Product;
