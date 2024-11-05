import express from "express";
import { CategoryControllers } from "./itemCategory.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./itemCategory.validation";

const router = express.Router();

router.get("/", CategoryControllers.getAllCategories);

router.get("/:id", CategoryControllers.getCategoryById);

router.post(
  "/",
  auth(UserRole.admin),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

router.put(
  "/:id",
  auth(UserRole.admin),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

router.delete("/:id", auth(UserRole.admin), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
