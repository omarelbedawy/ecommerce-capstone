const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('seeding db...');

  const hashedAdminPw = await bcrypt.hash('Admin123!', 10);
  const hashedCustomerPw = await bcrypt.hash('Customer123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      name: 'Store Admin',
      email: 'admin@shop.com',
      password: hashedAdminPw,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@shop.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@shop.com',
      password: hashedCustomerPw,
      role: 'CUSTOMER',
    },
  });

  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books'];
  const categoryRecords = {};
  for (const name of categories) {
    categoryRecords[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const products = [
    { name: 'Wireless Headphones', description: 'Noise cancelling, 30hr battery', price: 89.99, stock: 25, category: 'Electronics' },
    { name: 'Mechanical Keyboard', description: 'Hot-swappable switches, RGB', price: 129.99, stock: 15, category: 'Electronics' },
    { name: 'Cotton T-Shirt', description: 'Soft, breathable, unisex fit', price: 19.99, stock: 100, category: 'Clothing' },
    { name: 'Denim Jacket', description: 'Classic fit, machine washable', price: 59.99, stock: 40, category: 'Clothing' },
    { name: 'Non-stick Pan Set', description: '3-piece set, dishwasher safe', price: 45.5, stock: 30, category: 'Home & Kitchen' },
    { name: 'Coffee Maker', description: '12-cup drip coffee maker', price: 34.99, stock: 20, category: 'Home & Kitchen' },
    { name: 'The Pragmatic Programmer', description: 'Classic software engineering book', price: 24.99, stock: 50, category: 'Books' },
    { name: 'Clean Code', description: 'A handbook of agile software craftsmanship', price: 29.99, stock: 35, category: 'Books' },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: categoryRecords[p.category].id,
      },
    });
  }

  console.log('done seeding. admin: admin@shop.com / Admin123! | customer: customer@shop.com / Customer123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
