export default class User {
  constructor(username, email, password, post, active = true) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.post = post;
    this.active = active;
  }

  getUsername() {
    return this.username;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  setUsername(username) {
    this.username = username;
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  getPost() {
    return this.post;
  }

  setPost(post) {
    this.post = post;
  }

  isActive() {
    return this.active;
  }

  setActive(active) {
    this.active = active;
  }
}
