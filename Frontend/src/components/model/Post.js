export default class Post {
  constructor(
    id,
    title,
    content,
    user,
    reply = [],
    date,
    topic,
    active = true
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.user = user;
    this.reply = reply;
    this.date = date;
    this.topic = topic;
    this.active = active;
  }

  getTitle() {
    return this.title;
  }

  getContent() {
    return this.content;
  }

  getUser() {
    return this.user;
  }

  setTitle(title) {
    this.title = title;
  }

  setContent(content) {
    this.content = content;
  }

  setUser(user) {
    this.user = user;
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

  getReply() {
    return this.reply;
  }

  setReply(reply) {
    this.reply = reply;
  }

  getTopic() {
    return this.topic;
  }

  setTopic(topic) {
    this.topic = topic;
  }

  getDate() {
    return this.date;
  }

  setDate(date) {
    this.date = date;
  }
}
