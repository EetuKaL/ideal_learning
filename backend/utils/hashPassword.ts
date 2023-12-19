import bcrypt from "bcrypt";

const hashPassword = async (plaintextPassword: any) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    return hash;
  } catch (error) {
    // Handle error
    throw new Error("Password hashing failed");
  }
};

export default hashPassword;
