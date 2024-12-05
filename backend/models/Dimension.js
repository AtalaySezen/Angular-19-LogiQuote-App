const mongoose = require("mongoose");

const DimensionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Cartons', 'Boxes', 'Pallets'],  
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dimensions", DimensionSchema);
