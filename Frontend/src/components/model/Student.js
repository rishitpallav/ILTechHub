import User from "./User";

export default class Student extends User {
  constructor(username, email, password, post, active = true, grade) {
    super(username, email, password, post, active);
    this.grade = grade;
  }

  getGrade() {
    return this.grade;
  }

  setGrade(grade) {
    this.grade = grade;
  }
}
