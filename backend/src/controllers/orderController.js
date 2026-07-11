const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendOrderConfirmation } = require('../services/emailService');

// checkout: turn cart into an order. everything below needs to succeed together
// or not at all - if we're out of stock halfway through, nothing should be saved.
const checkout = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
    }
  }

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: cartItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  // don't block the response on email - fire it and move on
  const user = await prisma.user.findUnique({ where: { id: userId } });
  sendOrderConfirmation(user.email, order).catch((err) =>
    console.log('couldnt send confirmation email:', err.message)
  );

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { items: { include: { product: true } } },
  });

  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not your order' });
  }

  res.json(order);
});

// admin: view all orders, update status
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status },
  });
  res.json(order);
});

module.exports = { checkout, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
