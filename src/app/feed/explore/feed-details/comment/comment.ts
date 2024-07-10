export class CommentModel {
  constructor(
    public key: string,
              public uid:string,
              public feedId :string,
              public text:string,
              public dateTimePosted: Date
  )
  {}
}
