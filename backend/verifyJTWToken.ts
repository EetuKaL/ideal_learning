import jwt, { VerifyErrors } from "jsonwebtoken";

// Define the structure of your decoded token
interface DecodedToken {
  userId: string;
  // Add other properties as needed
}

// Function to verify the token
const verifyToken = (token: string, secretKey: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    return decoded;
  } catch (error) {
    // Handle token verification error here
    if (error) {
      console.error("Error verifying token:");
    }
    return null;
  }
};

export default verifyToken;
