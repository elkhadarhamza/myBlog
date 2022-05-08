import { Model } from "objection";
import CommentsModel from "./CommentsModel.js"
import PostModel from "./PostModel.js"

class UserModel extends Model {
  static tableName = "users"

  static get relationMappings() {
    return {
      posts: {
        relation: Model.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.user_id",
        },
      },
      
      posts_comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentsModel,
        join: {
          from: "users.id",
          to: "comments.user_id",
        },
      },
      
    }
  }
}
export default UserModel
