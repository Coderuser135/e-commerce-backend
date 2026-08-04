import jwt from "jsonwebtoken";

export const gerenateRefreshToken = async (id, expiresIn) => {
  const token = await jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
  return token;
};
export const gerenateaccessToken = async (id, expiresIn) => {
  const token = await jwt.sign({ id }, process.env.ASSES_TOKEN_SECRET, { expiresIn });
  return token;
};
