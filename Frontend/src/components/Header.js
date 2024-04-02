import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Login } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { FormLabel, Grid, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import SchoolIcon from "@mui/icons-material/School";

function Header(props) {
  const {
    topics,
    title,
    utilities,
    selectedTopic,
    onTopicChange,
    username,
    setUsername,
    handlePostChange,
  } = props;

  const [isLogin, setIsLogin] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);

  // const login = (eevnt) => {
  //   if (isLogin) {
  //     setIsLogin(false);
  //   } else {
  //     const user = utilities.login(username, password);
  //     if (user === null) {
  //       window.alert("Invalid username or password");
  //     } else {
  //       setUsername(user.username);
  //       setIsLogin(true);
  //     }
  //   }
  // };

  const [subscribed, setSubscribed] = React.useState(false);

  const searchPost = async (event) => {
    console.log(event);
    const posts = await utilities.searchPosts(event);
    console.log(posts);
    const mes = await handlePostChange(posts);
    console.log("message is ", mes);
  };

  const subscribe = () => {
    if (username === null) {
      window.alert("Please login to subscribe");
    } else {
      const mes = utilities.subscribe(selectedTopic);
      console.log("message is ", mes);
    }
    setSubscribed(true);
  };

  const unsubscribe = () => {
    if (username === null) {
      window.alert("Please login to unsubscribe");
    } else {
      const mes = utilities.unsubscribe(selectedTopic);
      console.log("message is ", mes);
    }
    setSubscribed(false);
  };

  const login = (event) => {
    console.log("In login - Header.js");
    event.preventDefault();
    console.log(event.target.elements["username"].value);
    console.log(event.target.elements["userType"].value);
    if (event.target.elements["userType"].value === "Admin") {
      const user = utilities.adminLogin(
        event.target.elements["username"].value,
        event.target.elements["password"].value
      );
      if (user === null) {
        setLoginError(true);
      } else {
        setUsername(user.username);
        setIsLogin(true);
        setLoginError(false);
        utilities.setCurrentUser(user);
      }
    } else if (event.target.elements["userType"].value === "Moderator") {
      const user = utilities.moderatorLogin(
        event.target.elements["username"].value,
        event.target.elements["password"].value
      );
      if (user === null) {
        // window.alert("Invalid username or password");
        setLoginError(true);
      } else {
        setUsername(user.username);
        setIsLogin(true);
        setLoginError(false);
        utilities.setCurrentUser(user);
      }
    } else if (event.target.elements["userType"].value === "Student") {
      const user = utilities.studentLogin(
        event.target.elements["username"].value,
        event.target.elements["password"].value
      );
      if (user === null) {
        // window.alert("Invalid username or password");
        setLoginError(true);
      } else {
        setUsername(user.username);
        setIsLogin(true);
        setLoginError(false);
        utilities.setCurrentUser(user);
      }
    } else if (event.target.elements["userType"].value === "Faculty") {
      const user = utilities.facultyLogin(
        event.target.elements["username"].value,
        event.target.elements["password"].value
      );
      if (user === null) {
        // window.alert("Invalid username or password");
        setLoginError(true);
      } else {
        setUsername(user.username);
        setIsLogin(true);
        setLoginError(false);
        utilities.setCurrentUser(user);
      }
    } else if (event.target.elements["userType"].value === "Staff") {
      const user = utilities.staffLogin(
        event.target.elements["username"].value,
        event.target.elements["password"].value
      );
      if (user === null) {
        // window.alert("Invalid username or password");
        setLoginError(true);
      } else {
        setUsername(user.username);
        setIsLogin(true);
        setLoginError(false);
        utilities.setCurrentUser(user);
      }
    } else {
      window.alert(
        "There has been an issue. Please contact the administrator."
      );
    }
  };

  const handleLogout = () => {
    setIsLogin(false);
    utilities.clearCurrentUser();
    setUsername("");
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onTopicChange("");
  };

  const [recommendationWindow, setRecommendationWindow] = React.useState(false);

  const [recommendations, setRecommendations] = React.useState([]);

  const handleRecommendationWindow = async () => {
    setRecommendationWindow(true);
    const recommendations =
      await utilities.getOpenAISportEventRecommendations();
    console.log(recommendations);
    // for (let i = 0; i < recommendations.length; i++) {
    //   document.getElementsByName(
    //     "recommendation" + (i + 1) + "Title"
    //   )[0].innerHTML = recommendations[i]["title"];
    //   document.getElementsByName(
    //     "recommendation" + (i + 1) + "Description"
    //   )[0].innerHTML = recommendations[i]["description"];
    //   document.getElementsByName(
    //     "recommendation" + (i + 1) + "Date"
    //   )[0].innerHTML = recommendations[i]["date"];
    //   document.getElementsByName(
    //     "recommendation" + (i + 1) + "Address"
    //   )[0].innerHTML = recommendations[i]["address"];
    // }
    setRecommendations(recommendations);
  };

  const handleCloseRecommendationWindow = () => {
    setRecommendationWindow(false);
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* <Button size="small" onClick={() => subscribe()}>
          Subscribe
        </Button> */}
        {subscribed ? (
          <Button size="small" onClick={() => unsubscribe()}>
            Unsubscribe
          </Button>
        ) : (
          <Button size="small" onClick={() => subscribe()}>
            Subscribe
          </Button>
        )}
        <Button onClick={() => handleRecommendationWindow()}>
          Get OpenAI Recommendations
        </Button>
        <Modal
          open={recommendationWindow}
          onClose={handleCloseRecommendationWindow}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1200,
              maxHeight: "80vh", // Set a maximum height for the modal content
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <h3>Recommendation Window</h3>
            <Grid container spacing={2}>
              {recommendations.map((recommendation, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}
                  sx={{
                    borderRight: "1px solid grey",
                    borderBottom: "1px solid grey",
                    padding: 2,
                  }}
                >
                  <p name={`recommendation${index + 1}Title`}>
                    {recommendation.title}
                  </p>
                  <p name={`recommendation${index + 1}Description`}>
                    {recommendation.description}
                  </p>
                  <p name={`recommendation${index + 1}Date`}>
                    {recommendation.date.when}
                  </p>
                  <p name={`recommendation${index + 1}Address`}>
                    {recommendation.address}
                  </p>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          <Button
            variant="text"
            size="large"
            color="inherit"
            startIcon={<SchoolIcon style={{ fontSize: 40 }} />}
            onClick={() => onTopicChange("")}
          >
            <Typography variant="h4">{title}</Typography>
          </Button>
        </Typography>
        <IconButton>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                searchPost(event.target.value);
              }
            }}
          />
          {/* <SearchIcon onClick={() => searchPost()} /> */}

          {/* <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SearchIcon />}
          >
            Search
          </Button> */}
        </IconButton>
        {isLogin ? (
          <Button onClick={handleLogout}>Logout {username}</Button>
        ) : (
          <React.Fragment>
            <Button onClick={handleOpen}>Login</Button>
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 570,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <form onSubmit={(event) => login(event)}>
                  <FormControl>
                    {loginError && (
                      <Alert severity="error">
                        Invalid username or password
                      </Alert>
                    )}
                    <FormLabel id="username">Username</FormLabel>
                    <TextField
                      type="text"
                      id="username"
                      aria-describedby="usernameHelp"
                      helperText="We'll never share your details."
                    />
                    <FormLabel id="password">Password</FormLabel>
                    <TextField
                      type="password"
                      id="password"
                      variant="outlined"
                    />
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="userType"
                    >
                      <FormControlLabel
                        value="Admin"
                        control={<Radio />}
                        label="Admin"
                      />
                      <FormControlLabel
                        value="Moderator"
                        control={<Radio />}
                        label="Moderator"
                      />
                      <FormControlLabel
                        value="Student"
                        control={<Radio />}
                        label="Student"
                      />
                      <FormControlLabel
                        value="Faculty"
                        control={<Radio />}
                        label="Faculty"
                      />
                      <FormControlLabel
                        value="Staff"
                        control={<Radio />}
                        label="Staff"
                      />
                    </RadioGroup>
                    <br />
                    <Button type="submit" color="success" variant="contained">
                      Submit
                    </Button>
                  </FormControl>
                </form>
              </Box>
            </Modal>
          </React.Fragment>
        )}
        {/* <Button onClick={handleLogin123}>Sign up</Button> */}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {topics.map((topic) => (
          <Button
            color="inherit"
            noWrap
            key={topic.title}
            variant="body2"
            // sx={{ p: 1, flexShrink: 0 }}
            onClick={() => onTopicChange(topic.title)}
          >
            {topic.title}
          </Button>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
