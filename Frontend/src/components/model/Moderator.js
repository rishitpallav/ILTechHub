import User from "./User";

export default class Moderator extends User {
  constructor(username, email, password, post, active = true) {
    super(username, email, password, post, active);
  }

  deletePost(post) {
    post = null;
  }
}
