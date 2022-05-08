import { Model } from "objection"
import CommentsModel from "./CommentsModel.js"
import UserModel from "./UserModel.js"

class PostModel extends Model {
  static tableName = "posts"

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "posts.user_id",
          to: "users.id",
        },
      },

      comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentsModel,
        join: {
          from: "posts.id",
          to: "comments.post_id",
        },
      },

    }
  }
}

export default PostModel
