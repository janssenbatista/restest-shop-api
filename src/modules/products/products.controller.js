import * as productsService from './products.service.js';

/**
 * GET /api/products
 */
export async function index(req, res, next) {
  try {
    const result = await productsService.findAll(req.query);

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}
