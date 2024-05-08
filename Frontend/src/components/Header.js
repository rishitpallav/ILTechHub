import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Google, Login } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { FormLabel, Grid, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import SchoolIcon from "@mui/icons-material/School";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { AdvancedMarkerElement } from "@react-google-maps/api/markers";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

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

  const [openChat, setOpenChat] = React.useState(false);

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };

  const [chatMessages, setChatMessages] = React.useState([
    "AI: Hi! I am an AI chatbot. I can help you recommend sports events, restaurants, and musical events! Just ask and I will give you a few recommendations!",
  ]);

  const [events, setEvents] = React.useState([]);

  const [userLocation, setUserLocation] = React.useState([]);

  const setEventsUseState = async (events) => {
    setEvents(events);
    return true;
  };

  const setUserLocationUseState = async (userLocation) => {
    setUserLocation(userLocation);
    return true;
  };

  const handleMessageRecommendation = async (message) => {
    const recommendations = await utilities.getOpenAISportEventRecommendations(
      message
    );
    console.log(recommendations);
    let res1 = await setEventsUseState(recommendations);
    let res2 = false;
    if (res1) {
      res2 = await setUserLocationUseState(utilities.getUserLocation());
    }
    if (res2) {
      console.log(res2);
    }
    console.log(
      userLocation[0],
      userLocation[1],
      " - user location in Header.js"
    );

    // console.log(events[0].gps_coordinates.latitude);

    let recommendationsList = recommendations.map((recommendation) => {
      return `Title: ${recommendation.title}, Description: ${recommendation.description}, Date: ${recommendation.date}, Address: ${recommendation.address}`;
    });

    setChatMessages([
      ...chatMessages,
      "AI: Here are some recommendations for you:",
      recommendationsList.join("\n"),
    ]);
  };

  // const [recommendationWindow, setRecommendationWindow] = React.useState(false);

  // const [recommendations, setRecommendations] = React.useState([]);

  // const handleRecommendationWindow = async () => {
  //   setRecommendationWindow(true);
  //   const recommendations =
  //     await utilities.getOpenAISportEventRecommendations();
  //   console.log(recommendations);
  //   setRecommendations(recommendations);
  // };

  // const handleCloseRecommendationWindow = () => {
  //   setRecommendationWindow(false);
  // };

  const [openMap, setOpenMap] = React.useState(false);

  const handleOpenMap = () => {
    if (events.length === 0) {
      window.alert("Recommendations are loading! Please wait!");
      handleMessageRecommendation("");
    } else {
      setOpenMap(true);
    }
  };

  const [openDetails, setOpenDetails] = React.useState(false);

  const [openEventDetails, setOpenEventDetails] = React.useState(null);

  const ContentComponent = () => <div>YOU (logging from content)</div>;

  const advancedMarkerRef = React.useRef(null);

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
        <Button onClick={() => handleOpenChat()}>Chat With AI</Button>

        <Modal open={openChat} onClose={handleCloseChat}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1200,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                marginBottom: "50px",
                maxHeight: "70vh",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <h3>Chat Window</h3>
              {chatMessages
                .slice(0)
                .reverse()
                .map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid grey",
                      borderRadius: 2,
                      padding: 2,
                      margin: 1,
                    }}
                  >
                    {message}
                  </Box>
                ))}
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                display: "flex",
                padding: "8px",
                borderTop: "1px solid #ccc",
                bgcolor: "background.paper",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Message"
                variant="outlined"
                size="100%"
                sx={{ width: "100%" }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setChatMessages([
                      ...chatMessages,
                      "User: " + event.target.value,
                    ]);
                    event.target.value = "";
                    handleMessageRecommendation(event.target.value);
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SearchIcon />}
                style={{ marginLeft: "8px" }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* <Modal
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
        </Modal> */}

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
        <Button size="small" onClick={() => handleOpenMap(true)}>
          RECOMMENDED FOR YOU
        </Button>
        <Modal open={openMap} onClose={() => setOpenMap(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1200,
              height: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflowY: "auto",
            }}
          >
            <APIProvider apiKey={"AIzaSyBJ0yaS3yc3UA3pVhVYQKNzY1-Sv2baUJA"}>
              <div style={{ height: "70vh" }}>
                <Map
                  viewState={{
                    latitude: userLocation[0],
                    longitude: userLocation[1],
                    zoom: 12,
                    // latitude: 40.748817,
                    // longitude: -73.985428,
                    // zoom: 12,
                  }}
                  mapId={"7106467ae866b182"}
                >
                  <AdvancedMarker
                    position={{ lat: userLocation[0], lng: userLocation[1] }}
                    onClick={() => setOpenDetails(true)}
                  >
                    <Pin background={"Green"} glyphColor={"Black"}>
                      <h3>YOU</h3>
                    </Pin>
                  </AdvancedMarker>
                  {Array.isArray(events) &&
                    events.map((eventDetails, index) => {
                      const { latitude: lat, longitude: lng } =
                        eventDetails.gps_coordinates;
                      // console.log(lat, lng);
                      return (
                        <AdvancedMarker
                          key={index}
                          position={{ lat, lng }}
                          onClick={() => setOpenEventDetails(eventDetails)}
                        >
                          {eventDetails.type === "restaurant" && (
                            <Pin background={"Orange"} glyphColor={"Black"}>
                              {<h3>{eventDetails.type}</h3>}
                            </Pin>
                          )}
                          {eventDetails.type === "Music" && (
                            <Pin
                              background={"LightSkyBlue"}
                              glyphColor={"Black"}
                            >
                              {<h3>{eventDetails.type}</h3>}
                            </Pin>
                          )}
                          {eventDetails.type === "Sport" && (
                            <Pin background={"Yellow"} glyphColor={"Black"}>
                              {<h3>{eventDetails.type}</h3>}
                            </Pin>
                          )}
                        </AdvancedMarker>
                      );
                    })}
                  {openDetails && (
                    <InfoWindow
                      position={{ lat: userLocation[0], lng: userLocation[1] }}
                      onCloseClick={() => setOpenDetails(false)}
                    >
                      YOU ARE HERE
                    </InfoWindow>
                  )}
                  {openEventDetails && (
                    <InfoWindow
                      position={{
                        lat: openEventDetails.gps_coordinates.latitude,
                        lng: openEventDetails.gps_coordinates.longitude,
                      }}
                      onCloseClick={() => setOpenEventDetails(null)}
                    >
                      <div>
                        <h2>{`TYPE: ${openEventDetails.type}`}</h2>
                        <p>{`TITLE: ${openEventDetails.title}`}</p>
                        <p>{`DESCRIPTION: ${openEventDetails.description}`}</p>
                        <p>{`DATE: ${openEventDetails.date}`}</p>
                        <p>{`ADDRESS: ${openEventDetails.address}`}</p>
                        {openEventDetails.type === "Sport" ? (
                          <p>{`LINK: ${openEventDetails.operating_hours}`}</p>
                        ) : (
                          <p>{`OPERATING_HOURS: ${openEventDetails.operating_hours}`}</p>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>
            </APIProvider>
            <div style={{ height: "30vh" }}>
              <h2>Recommended Events</h2>
              <Grid container spacing={2}>
                {events.map((event, index) => (
                  <Grid item xs={12} key={index}>
                    <h4>{`TYPE: ${event.type}`}</h4>
                    <p>{`TITLE: ${event.title}`}</p>
                    <p>{`DESCRIPTION: ${event.description}`}</p>
                    <p>{`DATE: ${event.date}`}</p>
                    <p>{`ADDRESS: ${event.address}`}</p>
                    {event.type === "Sport" ? (
                      <p>{`LINK: ${event.operating_hours}`}</p>
                    ) : (
                      <p>{`OPERATING_HOURS: ${event.operating_hours}`}</p>
                    )}
                    {console.log(advancedMarkerRef)}
                  </Grid>
                ))}
              </Grid>
            </div>
          </Box>
        </Modal>

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
