const { body, param } = require("express-validator");

exports.createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
];

exports.updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false"),
];

exports.deleteCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];
