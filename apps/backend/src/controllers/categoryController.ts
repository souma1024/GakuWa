import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryService";

export const getCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.list();
    res.status(200).json({
      success: true,
      data: categories.map((c) => ({
        id: c.id.toString(),
        name: c.name,
      })),
    });
  } catch (e) {
    next(e);
  }
};

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const category = await categoryService.create(name);

    res.status(201).json({
      success: true,
      data: {
        id: category.id.toString(),
        name: category.name,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = BigInt(req.params.categoryId);
    const { name } = req.body;

    const category = await categoryService.update(categoryId, name);

    res.status(200).json({
      success: true,
      data: {
        id: category.id.toString(),
        name: category.name,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = BigInt(req.params.categoryId);
    await categoryService.remove(categoryId);

    res.status(200).json({
      success: true,
      data: { deleted: true },
    });
  } catch (e) {
    next(e);
  }
};
