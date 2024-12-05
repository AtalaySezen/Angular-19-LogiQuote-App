const express = require("express");
const Offer = require("../models/Offer");
const Dimension = require("../models/Dimension");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const {
    mode,
    movementType,
    incoterms,
    countryCity,
    packageType,
    unit1,
    unit2,
    currency,
  } = req.body;
  const userId = req.user.id;

  if (
    !mode ||
    !movementType ||
    !incoterms ||
    !countryCity ||
    !packageType ||
    !unit1 ||
    !unit2 ||
    !currency
  ) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required.",
      data: null,
    });
  }

  try {
    let dimension;
    if (packageType === "Cartons") {
      dimension = await createOrUpdateDimension(
        "Cartons",
        12,
        12,
        12,
        unit1,
        unit2
      );
    } else if (packageType === "Boxes") {
      dimension = await createOrUpdateDimension(
        "Boxes",
        24,
        16,
        12,
        unit1,
        unit2
      );
    } else if (packageType === "Pallets") {
      dimension = await createOrUpdateDimension(
        "Pallets",
        40,
        48,
        60,
        unit1,
        unit2
      );
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid package type.",
        data: null,
      });
    }

    const newOffer = new Offer({
      mode,
      movementType,
      incoterms,
      countryCity,
      packageType,
      unit1,
      unit2,
      currency,
      userId,
      dimensions: dimension._id,
      palletCount: dimension.palletCount,
    });

    await newOffer.save();
    res.status(201).json({
      status: "success",
      message: "Offer created successfully",
      data: newOffer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the offer",
      data: null,
    });
  }
});

const createOrUpdateDimension = async (
  type,
  width,
  length,
  height,
  unit1,
  unit2
) => {
  let dimension = await Dimension.findOne({ type });
  if (!dimension) {
    dimension = new Dimension({
      type,
      width,
      length,
      height,
      unit1Value: unit1,
      unit2Value: unit2,
      palletCount: calculatePalletCount(width, length, height, unit1, unit2),
    });
    await dimension.save();
  }
  return dimension;
};

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;

    const offers = await Offer.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate("dimensions");

    const totalItems = await Offer.countDocuments({ userId });
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      status: "success",
      message: "",
      data: {
        offers,
        totalPages,
        totalItemCount: totalItems,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the offers",
      data: null,
    });
  }
});

router.get("/dimensions", async (req, res) => {
  try {
    const carton = await Dimension.findOne({ type: "Cartons" });
    const box = await Dimension.findOne({ type: "Boxes" });
    const pallet = await Dimension.findOne({ type: "Pallets" });

    if (!carton || !box || !pallet) {
      return res.status(404).json({
        status: "error",
        message: "Dimensions not found in the database.",
      });
    }
    res.json({
      status: "success",
      message: "Dimensions fetched successfully.",
      data: {
        carton: {
          width: carton.width,
          length: carton.length,
          height: carton.height,
        },
        box: {
          width: box.width,
          length: box.length,
          height: box.height,
        },
        pallet: {
          width: pallet.width,
          length: pallet.length,
          height: pallet.height,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching dimensions.",
    });
  }
});

module.exports = router;
