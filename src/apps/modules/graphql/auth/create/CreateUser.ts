import { GraphQLResolveInfo } from "graphql";
import { omit } from "lodash";
import { Arg, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import Users from "../../../entities/users.entity";
import errorHandler from "../../../../../utils/error";

@Resolver((_type: any) => Users)
export class Auth {
  @Query((_type) => Users)
  public async signup(@Ctx() { conn }: any, @Info() info: GraphQLResolveInfo) {
    try {
      return {
        status: 200,
        ...omit({}, "password"),
      };
    } catch (error) {
      errorHandler("Authorarize");
    }
  }
}
