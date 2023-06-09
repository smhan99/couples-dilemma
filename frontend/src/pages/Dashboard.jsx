import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import plate from "../assets/blueplate.png";
import { useEffect, useState } from "react";
import CreateOuting from "../components/CreateOuting";

const darkGrey = grey[800];

const Dashboard = () => {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [outings, setOutings] = useState([]);
  const [newOutingCreated, setNewOutingCreated] = useState(false);
  const [signup, setSignup] = useState(false);

  const now = new Date().toISOString();

  useEffect(() => {
    // fetch outings from DB
    if (authUser) {
      fetch("https://bhupathitharun.pythonanywhere.com/api/getOutings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            authUser.username + ":" + authUser.password
          )}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setOutings(resp.response.outings);
          console.log(outings);
          if (resp.error) alert(resp.error);
        });
    }
  }, [authUser, newOutingCreated]);

  // filter all outings by status and return arrays for each dashboard section
  const isPending = (outing) =>
    outing.state === "CHOOSING_PREFERENCES" ||
    outing.state === "CHOOSING_RESTAURANT";
  const isScheduled = (outing) =>
    outing.state === "FINALIZED" && outing.time > now;
  const isComplete = (outing) =>
    outing.state === "FINALIZED" && outing.time < now;

  const pending = outings.filter(isPending);
  const scheduled = outings.filter(isScheduled);
  const complete = outings.filter(isComplete);

  const handleSignOut = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
    setAuthUser(null);
    localStorage.removeItem('user');
  };

  const createOuting = (datetime, invited, location) => {
    fetch("https://bhupathitharun.pythonanywhere.com/api/createOuting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(
          authUser.username + ":" + authUser.password
        )}`,
      },
      body: JSON.stringify({
        date_time: datetime.format("YYYY-MM-DD HH:MM"),
        location: location,
        partner: invited,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        if (resp.error) alert(resp.error);
        setNewOutingCreated(!newOutingCreated);
      });
  };

  return (
    <div>
      <Typography component="h1" variant="h1">
        Let's Eat!
      </Typography>
      {!isLoggedIn ? (
        <div>
          {!signup ? (<div>
            <Login/>
            <Button onClick={(e) => setSignup(true)} variant="outlined">Not a user? Sign up</Button>
            </div>) : (<div>
            <Signup/>
            <Button onClick={(e) => setSignup(false)} variant="outlined">Back to Sign In</Button>
            </div>)}
        </div>
      ) : (
        <div>
          <Stack
            fullWidth
            sx={{ marginBottom: "20px" }}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <img src={plate} alt="plate with knife and fork" className="logo" />
            <Typography component="h2" variant="h4">
              Welcome, {authUser.username}!
            </Typography>
            <Button variant="contained" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Stack>
          <CreateOuting createOuting={createOuting} />
          <Stack
            direction={{ xs: "column", md: "row" }}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              sx={{
                width: 500,
                height: 300,
                backgroundColor: darkGrey,
                color: "white",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  height: 300,
                  marginTop: "10px",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 240,
                  "& ul": { padding: 0 },
                }}
                subheader={<li />}
              >
                <ul>
                  <ListSubheader>Awaiting Response</ListSubheader>
                  {pending.map((item) => {
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary={`${item.time} ${item.creator} & ${item.partner}`}
                        />
                        {(item.state === "CHOOSING_PREFERENCES" && (item.action_pending_from === authUser.username || item.action_pending_from === "both")) && 
                          <Link
                            to={`/couples-dilemma/preferences`}
                            state={{ outing_id: item.id }}
                          >
                            <Button id={item.id}>PREFERENCES</Button>
                          </Link>
                        }
                        {(item.action_pending_from !== authUser.username && item.action_pending_from !== "both") && 
                          <Button>Action Pending!</Button>
                        }
                        {(item.state === "CHOOSING_RESTAURANT" && (item.action_pending_from === authUser.username || item.action_pending_from === "both")) && 
                          <Link
                            to={`/couples-dilemma/restaurant-list`}
                            state={{ outing_id: item.id }}
                          >
                            <Button id={item.id}>
                              CHOOSE
                            </Button>
                          </Link>
                        }
                      </ListItem>
                    );
                  })}
                </ul>
              </List>
            </Box>
            <Box
              sx={{
                width: 500,
                height: 300,
                backgroundColor: darkGrey,
                color: "white",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  marginTop: "10px",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 240,
                  "& ul": { padding: 0 },
                }}
                subheader={<li />}
              >
                <ul>
                  <ListSubheader>Upcoming Outings</ListSubheader>
                  {scheduled.map((item) => {
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary={`${item.time} ${item.creator} & ${item.partner} @ `}
                        />
                        <a href={item.venue.yelp_url} target="_blank">{item.venue.name}</a>
                      </ListItem>
                    );
                  })}
                </ul>
              </List>
            </Box>
          </Stack>
          <Box
            fullWidth
            sx={{
              marginTop: "30px",
              height: "400px",
              backgroundColor: darkGrey,
              color: "white",
            }}
          >
            <List
              sx={{
                width: "100%",
                marginTop: "10px",
                position: "relative",
                overflow: "auto",
                maxHeight: 360,
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <ul>
                <ListSubheader>Outing History</ListSubheader>
                {complete.map((item) => {
                  return (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={`${item.time} ${item.creator} & ${item.partner} @`}
                      />
                      <a href={item.venue.yelp_url} target="_blank">{item.venue.name}</a>
                    </ListItem>
                  );
                })}
              </ul>
            </List>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
