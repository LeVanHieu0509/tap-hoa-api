import { getCustomRepository } from "typeorm";
import { KeysRepository } from "../repositories/keys.repository";

class KeyTokenService {
  constructor(parameters) {}

  public static createKeyToken = async ({
    usr_id,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    usr_id: any;
    publicKey: string;
    privateKey?: string;
    refreshToken?: string;
  }) => {
    try {
      const publicKeyString = publicKey.toString();
      const keysRepository = getCustomRepository(KeysRepository);

      const tokens = await keysRepository.create({
        usr_id,
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      });

      await keysRepository.save(tokens);

      return tokens ? publicKeyString : null;
    } catch (error) {
      return error;
    }
  };

  public static getKeyStoreByUserId = async ({ usr_id }) => {
    const keysRepository = getCustomRepository(KeysRepository);
    const keyToken = await keysRepository.findOne({ usr_id });

    return keyToken;
  };
}

export default KeyTokenService;
