import { Model } from "objection"
import UserModel from "./UserModel.js"
import PostModel from "./PostModel.js"

class CommentsModel extends Model {
  static tableName = "comments"

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: PostModel,
        join: {
          from: "comments.post_id",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentsModel
