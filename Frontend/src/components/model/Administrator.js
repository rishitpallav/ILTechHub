import User from "./User";

export default class Administrator extends User {
  constructor(username, email, password, post, active = true) {
    super(username, email, password, post, active);
  }

  deleteUser(user) {
    user = null;
  }
}
