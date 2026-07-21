import { loginUserService } from "./src/modules/auth/services/authService.js";

async function main() {
  try {
    const result = await loginUserService({
      email: "test@example.com",
      password: "password123"
    });
    console.log("Login successful:", result);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

main();
