const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      required: true,
      enum: ["LCL", "FCL", "Air"],
    },
    movementType: {
      type: String,
      required: true,
      enum: ["Door to Door", "Port to Door", "Door to Port", "Port to Port"],
    },
    incoterms: {
      type: String,
      required: true,
      enum: ["DDP", "DAT"],
    },
    countryCity: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      required: true,
      enum: ["Pallets", "Boxes", "Cartons"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offers", OfferSchema);
