import {UserModelModel} from "../user/user.model";

export class FeedWUModel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public userId: string,
    public username: string,
    public profileUrl: string
  ) {}
}
