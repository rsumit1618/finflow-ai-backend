import prisma from "./src/config/prisma.js";

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Database connection successful. First user:", user);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
