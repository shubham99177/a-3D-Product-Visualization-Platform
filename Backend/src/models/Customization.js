import { Schema, model } from "mongoose";

// Customization Schema
const customizationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // References the User collection
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // References the Product collection
    color: { type: String, default: "#FFFFFF" }, // Default color is white
    texture: { type: String }, // Texture URL or identifier
    size: {
      width: { type: Number, default: 1, min: 0.1 }, // Minimum value set to avoid invalid sizes
      height: { type: Number, default: 1, min: 0.1 },
      depth: { type: Number, default: 1, min: 0.1 },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Customization Model
const Customization = model("Customization", customizationSchema);

export default Customization;

