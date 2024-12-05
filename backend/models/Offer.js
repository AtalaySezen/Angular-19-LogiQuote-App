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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offers", OfferSchema);
