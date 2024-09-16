import { UserModelModel } from "src/app/user/user.model";

export class MessageModel {
  constructor(
    public createdAt: Date,
    public id: string,
    public from: UserModelModel,
    public to: UserModelModel,
    public msg: string
  ) {}
}
