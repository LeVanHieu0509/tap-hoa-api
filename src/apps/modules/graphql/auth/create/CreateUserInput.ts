import { Field, InputType } from "type-graphql";
import Users from "../../../entities/users.entity";
//Class này nhằm để định nghĩa được dữ liệu đầu vào của graphql
@InputType() //@InputType sẽ sinh ra kiểu GraphQLInputType
export class CreateUserInput implements Partial<Users> {
  //parameter input of User when create
  @Field()
  public usr_name!: string;
}
