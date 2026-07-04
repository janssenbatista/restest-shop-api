import { z } from 'zod';

import { readStore } from '../../config/data-store.js';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(6),
});

/**
 * Lista produtos com paginação.
 * @param {{ page: number, limit: number }} params
 */
export async function findAll(params) {
  const { page, limit } = paginationSchema.parse(params);
  const skip = (page - 1) * limit;
  const store = await readStore();
  const sortedProducts = [...store.products].sort((firstProduct, secondProduct) => {
    return new Date(secondProduct.createdAt) - new Date(firstProduct.createdAt);
  });
  const products = sortedProducts.slice(skip, skip + limit).sort((p1, p2) => p1.id - p2.id);
  const total = sortedProducts.length;

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
