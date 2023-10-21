import { buildSchema } from "type-graphql";
import { Auth } from "./auth/create/CreateUser";

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [Auth],
    emitSchemaFile: true,
    validate: false,
  });
};
