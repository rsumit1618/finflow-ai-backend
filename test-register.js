import { registerUserService } from "./src/modules/auth/services/authService.js";

async function main() {
  try {
    const result = await registerUserService({
      email: "test@example.com",
      password: "password123"
    });
    console.log("Registration successful:", result);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

main();
