import { Model } from "objection"
import UserModel from "./UserModel.js"

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
      }
    }
  }
}

export default CommentsModel
