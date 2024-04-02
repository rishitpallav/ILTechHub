import Blog from "./components//Blog.js";
import Header from "./components/Header.js";
import Body from "./components/Body.js";
import React from "react";

import "./App.css";
import { useState } from "react";

const topics = [
  { title: "Academic Resources" },
  { title: "Career Services" },
  { title: "Campus" },
  { title: "Culture" },
  { title: "Local Community Resources" },
  { title: "Social" },
  { title: "Sports" },
  { title: "Health and Wellness" },
  { title: "Technology" },
  { title: "Travel" },
  { title: "Alumni" },
];

function App(props) {
  const { utilities } = props;
  const [selectedTopic, setSelectedTopic] = useState("");
  const [username, setUsername] = useState("");

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const [posts, setPosts] = React.useState(
    utilities.getPostsByTopic(selectedTopic)
  );

  const handlePostChange = async (newPosts) => {
    setPosts(newPosts);
    return true;
  };

  // React.useEffect(() => {
  //   console.log("Posts have been updated");
  // }, [setPosts]);

  // React.useEffect(() => {
  //   setPosts(utilities.getPostsByTopic(selectedTopic));
  // }, [selectedTopic, utilities]);

  return (
    <>
      {/* <Blog /> */}
      <Header
        title="IIT Blog"
        topics={topics}
        utilities={utilities}
        selectedTopic={selectedTopic}
        onTopicChange={handleTopicChange}
        username={username}
        setUsername={setUsername}
        posts={posts}
        setPosts={setPosts}
        handlePostChange={handlePostChange}
      />
      <Body
        selectedTopic={selectedTopic}
        utilities={utilities}
        username={username}
        setUsername={setUsername}
        posts={posts}
        setPosts={setPosts}
      />
    </>
  );
}

export default App;
