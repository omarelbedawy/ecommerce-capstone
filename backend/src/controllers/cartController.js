const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  res.json({ items, total });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.stock < quantity) {
    return res.status(400).json({ message: `Only ${product.stock} left in stock` });
  }

  // upsert so adding the same product twice just bumps the quantity
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId: Number(productId) } },
    update: { quantity: { increment: Number(quantity) } },
    create: { userId: req.user.id, productId: Number(productId), quantity: Number(quantity) },
  });

  res.status(201).json(item);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const id = Number(req.params.id);

  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id } });
    return res.status(204).send();
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity: Number(quantity) },
  });

  res.json(updated);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.cartItem.findUnique({ where: { id } });

  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  await prisma.cartItem.delete({ where: { id } });
  res.status(204).send();
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
