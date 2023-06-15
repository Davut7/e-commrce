const multer = require("multer");
const ApiError = require("../utils/api-error");
const { validateRefreshToken } = require("./tokenService");
const productPhotoModel = require("../models/productPhotoModel");
const productColor = require("../models/productColor");
const productModel = require("../models/productModel");

const storage = multer.diskStorage({
  destination: "./uploads/product",
  filename: function (req, file, cb) {
    cb(null, file.originalname + "_" + Date.now());
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(ApiError.BadRequestError());
    }
    cb(null, true);
  },
}).array("file", 10);

const createProd = async (req, res, refreshToken) => {
  const token = validateRefreshToken(refreshToken);
  if (!token) throw ApiError.UnauthorizedError();
  const newProduct = upload(req, res, function (err) {
    if (err) {
      throw ApiError.BadRequestError();
    } else {
      const fileNames = req.files.map(file => file.filename);
      const photo = new productPhotoModel({
        filename: fileNames,
      });
      photo.save();
      const productColors = new productColor({
        color: req.body.color,
        photo: photo.id,
      });
      productColors.save();
      const product = new productModel({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        tags: req.body.tags,
        color: productColors.id,
      });
      product.save();
    }
    return newProduct;
  });
};

const getProducts = async page => {
  const product = await productModel
    .find()
    .limit(10)
    .skip((page - 1) * 10)
    .populate({
      path: `color`,
      populate: {
        path: `photo`,
      },
    });
  return product;
};

const getProduct = async productId => {
  const product = await productModel
    .findById(productId.id)
    .populate({
      path: `color`,
      populate: {
        path: `photo`,
      },
    })
    .populate({
      path: `ratings`,
    });
  if (!product) throw ApiError.BadRequestError();
  return product;
};

const deleteProduct = async productId => {
  const product = await productModel.findByIdAndDelete(productId);
  if (!product) throw ApiError.BadRequestError();
  return product;
};

const updateOne = async (productId, productData) => {
  const product = await productModel.findByIdAndUpdate(productId, {
    title: productData.title,
    description: productData.description,
    price: productData.price,
    quantity: productData.quantity,
    category: productData.category,
    tags: productData.tags,
  });
  if (err) {
    console.log(err);
  }
  return product;
};

const getBrands = async () => {
  const brand = await productModel.find().select({ brand: 1 });
  return brand;
};

module.exports = {
  upload,
  createProd,
  getProducts,
  getProduct,
  deleteProduct,
  updateOne,
  getBrands,
};
