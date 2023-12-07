import jwt from "jsonwebtoken";

export const genrateToken = (id: string) => {
  return jwt.sign({ id }, "secret-key", { expiresIn: "30m" });
};
