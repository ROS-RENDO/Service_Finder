require("dotenv").config();
const { exec } = require("child_process");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Run migrations before starting the server (production only)
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    console.log("🔄 Running database migrations...");
    exec("npx prisma migrate deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(
          "⚠️ Migration warning (may already be up to date):",
          error.message,
        );
      } else {
        console.log("✅ Migrations completed");
      }

      // Start server regardless of migration result
      startApp();
    });
  } else {
    startApp();
  }
}

function startApp() {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
}

startServer();
