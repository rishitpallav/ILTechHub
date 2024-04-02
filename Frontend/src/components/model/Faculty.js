import User from "./User";

export default class Faculty extends User {
  constructor(username, email, password, post, active = true, department) {
    super(username, email, password, post, active);
    this.department = department;
  }

  getDepartment() {
    return this.department;
  }

  setDepartment(department) {
    this.department = department;
  }
}
