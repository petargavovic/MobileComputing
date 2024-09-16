export class Feed {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public userId: string,
    public dateTimePosted: Date
  ) {}
}
