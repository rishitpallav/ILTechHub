import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Markdown from "./Markdown"; // Assuming Markdown component exists
import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import PersonIcon from "@mui/icons-material/Person";
import TodayIcon from "@mui/icons-material/Today";
import BookIcon from "@mui/icons-material/Book";

const theme = createTheme(); // Create a global theme

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: theme.palette.text.primary, // Use theme colors
  height: 48,
  padding: "0 30px",
}));

function FeaturedPost(props) {
  const { post, setPosts, utilities, selectedTopic, username, setUsername } =
    props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addReply = (event) => {
    event.preventDefault();
    utilities.addReply(
      post.id - 1,
      event.target.elements["outlined-basic"].value
    );
    setPosts(utilities.getPostsByTopic(selectedTopic));
  };

  const deletePost = () => {
    utilities.deletePost(post.id - 1);
    setPosts(utilities.getPostsByTopic(selectedTopic));
  };

  const deleteUser = () => {
    utilities.toggleUser(post.user, "Disable");
    setPosts(utilities.getPostsByTopic(selectedTopic));
  };

  const generateReply = async () => {
    let message = await utilities.generateReply(post.title, post.content);
    document.getElementsByName("Reply")[0].value = message;
  };

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a">
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.content.substring(0, 100) + "..."}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              <PersonIcon
                fontSize="small"
                style={{ verticalAlign: "middle" }}
              />{" "}
              {post.user.toUpperCase()}
            </Typography>
          </CardContent>
        </Card>
        <StyledButton onClick={handleOpen}>Continue Reading</StyledButton>
        {username.substring(0, 5) === "admin" && (
          <StyledButton onClick={deleteUser}>Delete User</StyledButton>
        )}
        {username.substring(0, 3) === "mod" && (
          <StyledButton onClick={deletePost}>Delete Post</StyledButton>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1000,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h4" id="modal-title">
              {post.title}
            </Typography>
            <br></br>
            <Typography variant="body1" id="simple-modal-description">
              <Markdown>{post.content}</Markdown>
            </Typography>
            <br></br>
            <Typography
              variant="button"
              id="simple-modal-date"
              style={{ verticalAlign: "middle" }}
            >
              <TodayIcon
                color="primary"
                fontSize="small"
                style={{ verticalAlign: "middle" }}
              />{" "}
              {post.date}
            </Typography>

            <br></br>
            <Typography variant="button" id="simple-modal-author">
              <PersonIcon
                fontSize="small"
                style={{ verticalAlign: "middle" }}
                color="primary"
              />{" "}
              {post.user}
            </Typography>
            <br></br>
            <Typography variant="button" id="simple-modal-topic">
              <BookIcon
                color="primary"
                fontSize="small"
                style={{ verticalAlign: "middle" }}
              />{" "}
              {post.topic}
            </Typography>
            <br></br>
            <br></br>
            <hr />
            <h3 style={{ fontFamily: "sans-serif" }}>COMMENTS</h3>
            {username != "" && (
              <Typography variant="subtitle1" id="simple-modal-reply">
                <Box
                  component="form"
                  onSubmit={(event) => addReply(event, post.id)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <FormControl noValidate autoComplete="off">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="Reply"
                    />
                    <br />
                    <Stack spacing={2} direction="row">
                      <Button
                        variant="contained"
                        sx={{ width: "20%" }}
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ width: "20%" }}
                        type="button"
                        onClick={() => generateReply()}
                      >
                        Generate With OpenAI
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ width: "20%" }}
                        onClick={() => {
                          document.getElementsByName("Reply")[0].value = "";
                        }}
                      >
                        Cancel OpenAI Reply
                      </Button>
                    </Stack>
                  </FormControl>
                </Box>
              </Typography>
            )}
            <br></br>
            <Typography variant="subtitle1" id="simple-modal-reply">
              {post.reply.map((reply) => (
                <Box style={{ borderRadius: "2px" }}>
                  <Typography variant="body2" id="simple-modal-reply-author">
                    <PersonIcon
                      fontSize="small"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    {reply.author.toUpperCase()} on {reply.date}
                  </Typography>
                  <Typography variant="body1" id="simple-modal-reply-content">
                    {reply.content}
                  </Typography>
                  <br></br>
                </Box>
              ))}
            </Typography>
          </Box>
        </Modal>
      </CardActionArea>
    </Grid>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
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
  }).isRequired,
};

export default FeaturedPost;
