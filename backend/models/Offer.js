const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      required: true,
    },
    movementType: {
      type: String,
      required: true,
    },
    incoterms: {
      type: String,
      required: true,
    },
    countryCity: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      enum: ["Cartons", "Boxes", "Pallets"],
      required: true,
    },
    unit1: {
      type: String,
      enum: ["CM", "IN"],
      required: true,
    },
    unit1Value: {
      type: Number,
      required: true,
    },
    unit2: {
      type: String,
      enum: ["KG", "LB"],
      required: true,
    },
    unit2Value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "CNY", "TRY"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dimensions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dimensions",
      required: true,
    },
    palletCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offers", OfferSchema);
