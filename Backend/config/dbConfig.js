require('dotenv').config();
const { PrismaClient } = require("../prisma/generated/prisma");

const prisma = new PrismaClient();
