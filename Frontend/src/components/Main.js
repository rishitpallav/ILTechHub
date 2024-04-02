import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FeaturedPost from "./FeaturedPost";
import { Container, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Main(props) {
  const {
    posts,
    setPosts,
    title,
    utilities,
    selectedTopic,
    username,
    setUsername,
  } = props;

  React.useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await utilities.getPostsByTopic(selectedTopic);
      setPosts(fetchedPosts);
    };
    fetchData();
  }, [selectedTopic, utilities, setPosts]);

  console.log("First is posts from useState");
  console.log(posts);

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid item xs={12} md={8} sx={{ "& .markdown": { py: 3 } }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Divider />
          <Grid container spacing={4}>
            {posts.map((post) => (
              <FeaturedPost
                key={post.id}
                post={post}
                setPosts={setPosts}
                utilities={utilities}
                selectedTopic={selectedTopic}
                username={username}
                setUsername={setUsername}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user: PropTypes.string,
      reply: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          content: PropTypes.string,
          author: PropTypes.string,
          date: PropTypes.string,
          active: PropTypes.bool,
          post: PropTypes.number,
        })
      ),
      date: PropTypes.string,
      topic: PropTypes.string,
      active: PropTypes.bool,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
