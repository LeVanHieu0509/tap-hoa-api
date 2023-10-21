import { signJwt, verifyJwt } from "../../utils/auth";

export const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = signJwt(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = signJwt(payload, privateKey, {
      expiresIn: "7 days",
    });

    //Verify
    const verifyToken = verifyJwt(accessToken, publicKey);

    return { accessToken, refreshToken };
  } catch (e) {
    console.log("createTokenPair", e);
  }
};
