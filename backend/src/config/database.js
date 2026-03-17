const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Handle connection with retry logic
let retries = 5;
const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    retries -= 1;
    if (retries > 0) {
      console.log(
        `⏳ Database connection failed. Retrying... (${retries} attempts left)`,
      );
      setTimeout(() => connectWithRetry(), 5000); // Retry after 5 seconds
    } else {
      console.error("❌ Database connection failed after all retries:", err);
      process.exit(1);
    }
  }
};

connectWithRetry();

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("🔌 Database disconnected");
});

module.exports = prisma;
