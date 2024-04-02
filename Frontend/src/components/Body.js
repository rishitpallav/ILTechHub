import * as React from "react";
import Main from "./Main";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function Body(props) {
  const { selectedTopic, utilities, username, setUsername, posts, setPosts } =
    props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAdmin, setOpenAdmin] = React.useState(false);

  const handleOpenAdmin = () => {
    setOpenAdmin(true);
  };

  const handleCloseAdmin = () => {
    setOpenAdmin(false);
  };

  const addPost = (event) => {
    event.preventDefault();
    utilities.addPost(
      event.target.elements["title"].value,
      event.target.elements["content"].value,
      event.target.elements["topic"].value,
      username
    );
    setPosts(utilities.getPostsByTopic(selectedTopic));
    handleClose();
  };

  return (
    <>
      <div>
        <h2 style={{ textAlign: "center" }} className="title">
          {selectedTopic === ""
            ? "Featured Posts"
            : `Posts on ${selectedTopic}`}
        </h2>
        <Main
          selectedTopic={selectedTopic}
          posts={posts}
          setPosts={setPosts}
          utilities={utilities}
          username={username}
          setUsername={setUsername}
        />
      </div>

      {/* CREATING A POST */}

      {username !== "" && (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Fab
            size="small"
            color="secondary"
            aria-label="add"
            onClick={handleOpen}
          >
            <AddIcon />
          </Fab>
        </div>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4">Add a Post</Typography>
          <br />
          <form onSubmit={addPost}>
            <FormControl fullWidth>
              <InputLabel id="topic">Topic</InputLabel>
              <Select labelId="topic" id="topic" name="topic" label="topic">
                <MenuItem value={"Academic Resources"}>
                  Academic Resources
                </MenuItem>
                <MenuItem value={"Career Services"}>Career Services</MenuItem>
                <MenuItem value={"Campus"}>Campus</MenuItem>
                <MenuItem value={"Culture"}>Culture</MenuItem>
                <MenuItem value={"Local Community Resources"}>
                  Local Community Resources
                </MenuItem>
                <MenuItem value={"Social"}>Social</MenuItem>
                <MenuItem value={"Sports"}>Sports</MenuItem>
                <MenuItem value={"Health and Wellness"}>
                  Health and Wellness
                </MenuItem>
                <MenuItem value={"Technology"}>Technology</MenuItem>
                <MenuItem value={"Travel"}>Travel</MenuItem>
                <MenuItem value={"Alumni"}>Alumni</MenuItem>
              </Select>
              <br />
              <TextField type="text" name="title" placeholder="Title" />
              <br />
              <TextField
                multiline
                type="text"
                name="content"
                placeholder="Content"
                rows={6}
                maxRows={12}
              />
              <br />
              <Button color="primary" variant="contained" type="submit">
                Add
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>

      {/* ADMIN CAN ENABLE/DISABLE A USER */}

      {username === "admin" && (
        <div style={{ position: "fixed", bottom: 20, left: 20 }}>
          {/* <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={handleOpenAdmin}
          >
            <AddIcon />
          </Fab> */}

          <Fab color="warning" variant="extended" onClick={handleOpenAdmin}>
            <EditIcon sx={{ mr: 1 }} />
            Enable/Disable a User
          </Fab>
        </div>
      )}
      <Modal open={openAdmin} onClose={handleCloseAdmin}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4">Enable/Disable a User</Typography>
          <br />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              utilities.toggleUser(
                event.target.elements["username"].value,
                event.target.elements["status"].value
              );
              handleCloseAdmin();
            }}
          >
            <FormControl fullWidth>
              <TextField type="text" name="username" placeholder="Username" />
              <br />
              <RadioGroup row aria-label="status" name="status">
                <FormControlLabel
                  value="Enable"
                  control={<Radio />}
                  label="Enable"
                />
                <FormControlLabel
                  value="Disable"
                  control={<Radio />}
                  label="Disable"
                />
              </RadioGroup>
              <br />
              <Button color="primary" variant="contained" type="submit">
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default Body;
