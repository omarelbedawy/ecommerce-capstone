const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=price_asc&page=1&limit=12
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { name: category };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  let orderBy = { createdAt: 'desc' }; // newest first by default
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };

  const pageNum = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Number(limit) || 12, 50); // cap it so nobody requests 10000 rows
  const skip = (pageNum - 1) * pageSize;

  const [data, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    data,
    totalCount,
    page: pageNum,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });

  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// admin only from here down
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!name || !price || !categoryId) {
    return res.status(400).json({ message: 'name, price and categoryId are required' });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await prisma.product.create({
    data: {
      name,
      description: description || '',
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId: Number(categoryId),
      imageUrl,
    },
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Product not found' });

  const { name, description, price, stock, categoryId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      description: description ?? existing.description,
      price: price !== undefined ? Number(price) : existing.price,
      stock: stock !== undefined ? Number(stock) : existing.stock,
      categoryId: categoryId !== undefined ? Number(categoryId) : existing.categoryId,
      ...(imageUrl && { imageUrl }),
    },
  });

  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Product not found' });

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
