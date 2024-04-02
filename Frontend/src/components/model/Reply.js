export default class Reply {
  constructor(id, content, author, date, active = true, post) {
    this.id = id;
    this.content = content;
    this.author = author;
    this.date = date;
    this.active = active;
    this.post = post;
  }

  getContent() {
    return this.content;
  }

  getAuthor() {
    return this.author;
  }

  setContent(content) {
    this.content = content;
  }

  setAuthor(author) {
    this.author = author;
  }

  isActive() {
    return this.active;
  }

  setActive(active) {
    this.active = active;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getDate() {
    return this.date;
  }

  setDate(date) {
    this.date = date;
  }

  getPost() {
    return this.post;
  }

  setPost(post) {
    this.post = post;
  }
}
