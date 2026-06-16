import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse } from "../../../utils/apiResponse.js";
import { env } from "../../../config/env.js";
import { registerSchema } from "../validators/authValidator.js";

export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = {
      id: Date.now(),
      name: validatedData.name,
      email: validatedData.email,
      passwordHash: hashedPassword,
    };

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      }
    );

    return successResponse(
      res,
      "User registered successfully",
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};