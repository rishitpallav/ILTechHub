// this is a utilities class which contains all the utility functions such as fetching data from txt file and converting it to json and storing data in arrays and objects
// and also contains a function to get the data from the json file and return it to the calling function

import React from "react";
import Post from "../model/Post";
import Reply from "../model/Reply";
import Administrator from "../model/Administrator";
import Moderator from "../model/Moderator";
import Student from "../model/Student";
import Faculty from "../model/Faculty";
import Staff from "../model/Staff";

import administratorJson from "./data/administrator.json";
import moderatorJson from "./data/moderator.json";
import facultyJson from "./data/faculty.json";
import staffJson from "./data/staff.json";
import postJson from "./data/post.json";
import replyJson from "./data/reply.json";

class Utilities {
  constructor() {
    this.state = {
      users: [],
      posts: [],
      administrators: [],
      moderators: [],
      students: [],
      faculty: [],
      staff: [],
      replies: [],
      currentUser: null,
    };
  }

  async componentDidMount() {
    console.log("Component did mount");
    await this.fetchData();
    return "DONE";
  }

  // function to fetch data from the each json file and store it in the respective arrays
  fetchData = async () => {
    console.log("fetching Data");

    try {
      const repliesResponse = await fetch(
        "http://localhost:4000/fetchAllReplies",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const repliesData = await repliesResponse.json();
      const replies = repliesData.map((reply) => {
        return new Reply(
          reply._source.id,
          reply._source.content,
          reply._source.author,
          reply._source.date,
          reply._source.active,
          reply._source.post
        );
      });

      this.state.replies = replies;

      // await fetch("http://localhost:4000/fetchAllPosts", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // }).then((response) => {
      //   response.json().then((data) => {
      //     console.log(data);
      //     for (let i = 0; i < data.length; i++) {
      //       let reply = [];
      //       for (let j = 0; j < replies.length; j++) {
      //         if (data[i]._source.id == replies[j].post) {
      //           reply.push(replies[j]);
      //         }
      //       }
      //       this.state.posts.push(
      //         new Post(
      //           data[i]._source.id,
      //           data[i]._source.title,
      //           data[i]._source.content,
      //           data[i]._source.user,
      //           reply,
      //           data[i]._source.date,
      //           data[i]._source.topic,
      //           data[i]._source.active
      //         )
      //       );
      //     }
      //   });
      // });

      const postsResponse = await fetch("http://localhost:4000/fetchAllPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const postsData = await postsResponse.json();
      const posts = postsData.map((post) => {
        let reply = [];
        for (let j = 0; j < replies.length; j++) {
          if (post._source.id == replies[j].post) {
            reply.push(replies[j]);
          }
        }
        return new Post(
          post._source.id,
          post._source.title,
          post._source.content,
          post._source.user,
          reply,
          post._source.date,
          post._source.topic,
          post._source.active
        );
      });

      this.state.posts = posts;

      console.log("Posts starting");
      console.log(this.state.posts);

      // await fetch("http://localhost:4000/fetchAllAdministrators", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((response) => response.json()) // Convert the response data to JSON
      //   .then((data) => {
      //     console.log(data); // Log the response data
      //     for (let i = 0; i < data.length; i++) {
      //       this.state.administrators.push(
      //         new Administrator(
      //           data[i]._source.username,
      //           data[i]._source.email,
      //           data[i]._source.password,
      //           data[i]._source.post,
      //           data[i]._source.active
      //         )
      //       );
      //     }
      //   })
      //   .catch((error) => console.error("Error:", error)); // Catch and log any errors

      const adminData = await fetch(
        "http://localhost:4000/fetchAllAdministrators",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const adminJson = await adminData.json();
      const administrators = adminJson.map((admin) => {
        return new Administrator(
          admin._source.username,
          admin._source.email,
          admin._source.password,
          admin._source.post,
          admin._source.active
        );
      });

      console.log(this.state.administrators);

      await fetch("http://localhost:4000/fetchAllModerators", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json()) // Convert the response data to JSON
        .then((data) => {
          console.log(data); // Log the response data
          for (let i = 0; i < data.length; i++) {
            this.state.moderators.push(
              new Moderator(
                data[i]._source.username,
                data[i]._source.email,
                data[i]._source.password,
                data[i]._source.post,
                data[i]._source.active
              )
            );
          }
        })
        .catch((error) => console.error("Error:", error)); // Catch and log any errors

      console.log(this.state.moderators);

      await fetch("http://localhost:4000/fetchAllStudents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json()) // Convert the response data to JSON
        .then((data) => {
          console.log(data); // Log the response data
          for (let i = 0; i < data.length; i++) {
            this.state.students.push(
              new Student(
                data[i]._source.username,
                data[i]._source.email,
                data[i]._source.password,
                data[i]._source.post,
                data[i]._source.active,
                data[i]._source.grade
              )
            );
          }
        })
        .catch((error) => console.error("Error:", error)); // Catch and log any errors

      console.log(this.state.students);

      await fetch("http://localhost:4000/fetchAllFaculties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json()) // Convert the response data to JSON
        .then((data) => {
          console.log(data); // Log the response data
          for (let i = 0; i < data.length; i++) {
            this.state.faculty.push(
              new Faculty(
                data[i]._source.username,
                data[i]._source.email,
                data[i]._source.password,
                data[i]._source.post,
                data[i]._source.active,
                data[i]._source.department
              )
            );
          }
        })
        .catch((error) => console.error("Error:", error)); // Catch and log any errors

      console.log(this.state.faculty);

      await fetch("http://localhost:4000/fetchAllStaffs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json()) // Convert the response data to JSON
        .then((data) => {
          console.log(data); // Log the response data
          for (let i = 0; i < data.length; i++) {
            this.state.staff.push(
              new Staff(
                data[i]._source.username,
                data[i]._source.email,
                data[i]._source.password,
                data[i]._source.post,
                data[i]._source.active,
                data[i]._source.department
              )
            );
          }
        })
        .catch((error) => console.error("Error:", error)); // Catch and log any errors

      console.log(this.state.staff);
    } catch (error) {
      console.log(error);
    }
  };

  // function to send a list of administrators to the calling function
  getAdministrators = () => {
    return this.state.administrators;
  };

  getCurrentUser = () => {
    console.log("In getCurrentUser");
    console.log(this.state.currentUser);
    return this.state.currentUser;
  };

  setCurrentUser = (user) => {
    this.state.currentUser = user;
  };

  clearCurrentUser = () => {
    this.state.currentUser = null;
  };

  adminLogin = (username, password) => {
    console.log("In adminLogin");
    for (let i = 0; i < this.state.administrators.length; i++) {
      if (
        this.state.administrators[i].username === username &&
        this.state.administrators[i].password === password &&
        this.state.administrators[i].active === true
      ) {
        this.currentUser = this.state.administrators[i];
        return this.state.administrators[i];
      }
    }
    return null;
  };

  moderatorLogin = (username, password) => {
    for (let i = 0; i < this.state.moderators.length; i++) {
      if (
        this.state.moderators[i].username === username &&
        this.state.moderators[i].password === password &&
        this.state.moderators[i].active === true
      ) {
        this.currentUser = this.state.moderators[i];
        return this.state.moderators[i];
      }
    }
    return null;
  };

  studentLogin = (username, password) => {
    for (let i = 0; i < this.state.students.length; i++) {
      if (
        this.state.students[i].username === username &&
        this.state.students[i].password === password &&
        this.state.students[i].active === true
      ) {
        this.currentUser = this.state.students[i];
        return this.state.students[i];
      }
    }
    return null;
    // get data from nodejs port 4000 /loginStudent
    // console.log("In studentLogin");
    // fetch("http://localhost:4000/loginStudent", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username: username, password: password }),
    // })
    //   .then((response) => response.json()) // Convert the response data to JSON
    //   .then((data) => {
    //     console.log(data); // Log the response data
    //   })
    //   .catch((error) => console.error("Error:", error)); // Catch and log any errors
    // return this.state.students[0];
  };

  facultyLogin = (username, password) => {
    for (let i = 0; i < this.state.faculty.length; i++) {
      if (
        this.state.faculty[i].username === username &&
        this.state.faculty[i].password === password &&
        this.state.faculty[i].active === true
      ) {
        this.currentUser = this.state.faculty[i];
        return this.state.faculty[i];
      }
    }
    return null;
  };

  staffLogin = (username, password) => {
    for (let i = 0; i < this.state.staff.length; i++) {
      if (
        this.state.staff[i].username === username &&
        this.state.staff[i].password === password &&
        this.state.staff[i].active === true
      ) {
        this.currentUser = this.state.staff[i];
        return this.state.staff[i];
      }
    }
    return null;
  };

  getPostsByTopic = (topic) => {
    let posts = [];

    if (topic === "") {
      for (let i = 0; i < this.state.posts.length; i++) {
        if (this.state.posts[i].active) {
          posts.push(this.state.posts[i]);
        }
      }
    }

    for (let i = 0; i < this.state.posts.length; i++) {
      if (this.state.posts[i].topic === topic) {
        if (this.state.posts[i].active) {
          posts.push(this.state.posts[i]);
        }
      }
    }
    return posts;
  };

  addReply = (postId, content) => {
    let date = new Date().toLocaleString();
    let reply = new Reply(
      this.state.posts[postId].reply.length + 1,
      content,
      this.currentUser.username,
      date,
      true,
      postId
    );
    this.state.posts[postId].reply.push(reply);
    fetch("http://localhost:4000/addReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: reply.id,
        content: reply.content,
        author: reply.author,
        date: reply.date,
        active: reply.active,
        post: reply.post + 1,
      }),
    });
    return this.state.posts[postId];
  };

  addPost = (title, content, topic, user) => {
    let date = new Date().toLocaleString();
    let post = new Post(
      this.state.posts.length + 1,
      title,
      content,
      user,
      [],
      date,
      topic,
      true
    );
    this.state.posts.push(post);
    fetch("http://localhost:4000/addPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: post.id,
        title: post.title,
        content: post.content,
        user: post.user,
        date: post.date,
        topic: post.topic,
        active: post.active,
      }),
    });
    return post;
  };

  deletePost = (postId) => {
    this.state.posts[postId].active = false;
  };

  deleteUser = (username) => {
    console.log("In deleteUser");
    console.log(username);
    for (let i = 0; i < this.state.administrators.length; i++) {
      if (this.state.administrators[i].username === username) {
        this.state.administrators[i].active = false;
      }
    }
    for (let i = 0; i < this.state.moderators.length; i++) {
      if (this.state.moderators[i].username === username) {
        this.state.moderators[i].active = false;
      }
    }
    for (let i = 0; i < this.state.students.length; i++) {
      if (this.state.students[i].username === username) {
        this.state.students[i].active = false;
      }
    }
    for (let i = 0; i < this.state.faculty.length; i++) {
      if (this.state.faculty[i].username === username) {
        this.state.faculty[i].active = false;
      }
    }
    for (let i = 0; i < this.state.staff.length; i++) {
      if (this.state.staff[i].username === username) {
        this.state.staff[i].active = false;
      }
    }
  };

  toggleUser = (username, setStatus) => {
    if (setStatus === "Enable") {
      for (let i = 0; i < this.state.administrators.length; i++) {
        if (this.state.administrators[i].username === username) {
          this.state.administrators[i].active = true;
        }
      }
      for (let i = 0; i < this.state.moderators.length; i++) {
        if (this.state.moderators[i].username === username) {
          this.state.moderators[i].active = true;
        }
      }
      for (let i = 0; i < this.state.students.length; i++) {
        if (this.state.students[i].username === username) {
          this.state.students[i].active = true;
        }
      }
      for (let i = 0; i < this.state.faculty.length; i++) {
        if (this.state.faculty[i].username === username) {
          this.state.faculty[i].active = true;
        }
      }
      for (let i = 0; i < this.state.staff.length; i++) {
        if (this.state.staff[i].username === username) {
          this.state.staff[i].active = true;
        }
      }
    } else {
      for (let i = 0; i < this.state.administrators.length; i++) {
        if (this.state.administrators[i].username === username) {
          this.state.administrators[i].active = false;
        }
      }
      for (let i = 0; i < this.state.moderators.length; i++) {
        if (this.state.moderators[i].username === username) {
          this.state.moderators[i].active = false;
        }
      }
      for (let i = 0; i < this.state.students.length; i++) {
        if (this.state.students[i].username === username) {
          this.state.students[i].active = false;
        }
      }
      for (let i = 0; i < this.state.faculty.length; i++) {
        if (this.state.faculty[i].username === username) {
          this.state.faculty[i].active = false;
        }
      }
      for (let i = 0; i < this.state.staff.length; i++) {
        if (this.state.staff[i].username === username) {
          this.state.staff[i].active = false;
        }
      }
    }
  };
  searchPosts = async (event) => {
    return fetch("http://localhost:4000/searchPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: event }),
    })
      .then((response) => response.json()) // Convert the response data to JSON
      .then((data) => {
        let posts = [];
        for (let i = 0; i < data.length; i++) {
          console.log(data[i]._source); // Log the response data
          let reply = [];
          for (let j = 0; j < this.state.replies.length; j++) {
            if (data[i]._source.id == this.state.replies[j].post) {
              reply.push(this.state.replies[j]);
            }
          }
          console.log("Reply - ", reply);
          posts.push(
            new Post(
              data[i]._source.id,
              data[i]._source.title,
              data[i]._source.content,
              data[i]._source.user,
              reply,
              data[i]._source.date,
              data[i]._source.topic,
              data[i]._source.active
            )
          );
        }
        console.log("Posts - ", posts);
        return posts;
      })
      .catch((error) => {
        console.error("Error:", error);
        return [];
      }); // Catch and log any errors
  };

  subscribe = async (topic) => {
    fetch("http://localhost:4000/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        email: this.state.currentUser.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the response data
        return data;
      })
      .catch((error) => console.error("Error:", error));
    return true;
  };

  unsubscribe = async (topic) => {
    fetch("http://localhost:4000/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        email: this.state.currentUser.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => console.error("Error:", error));
    return true;
  };

  generateReply = async (title, content) => {
    return fetch("http://localhost:4000/generateReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, content: content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data.reply;
      })
      .catch((error) => {
        console.error("Error:", error);
        return "";
      });
  };

  getOpenAISportEventRecommendations = async () => {
    // get data from https://ipapi.co/json/

    let ipData = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let ipJson = await ipData.json();

    return fetch("http://localhost:4000/getOpenAISportEventRecommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ipJson: ipJson,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return [];
      });
  };
}

export default Utilities;
