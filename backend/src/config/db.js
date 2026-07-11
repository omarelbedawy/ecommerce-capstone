const { PrismaClient } = require('@prisma/client');

// reuse the same client instance instead of creating a new one per request
const prisma = new PrismaClient();

module.exports = prisma;
