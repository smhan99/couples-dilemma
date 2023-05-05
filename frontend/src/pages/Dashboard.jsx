import { useAuth } from "../Context/AuthContext";
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

const mockData = [
  {
    id: "0001",
    first: "shelley",
    second: "Ahsoka",
    date: "05-01-2023",
    status: "complete",
    venue: "Olive Garden",
  },
  {
    id: "0002",
    first: "shelley",
    second: "Padme",
    date: "05-02-2023",
    status: "pending",
    venue: "",
  },
  {
    id: "0003",
    first: "shelley",
    second: "Mando",
    date: "04-28-2023",
    status: "complete",
    venue: "Chipotle",
  },
  {
    id: "0004",
    first: "shelley",
    second: "Grogu",
    date: "05-05-2023",
    status: "scheduled",
    venue: "Taco Bell",
  },
  {
    id: "0005",
    first: "shelley",
    second: "ObiWan",
    date: "02-14-2024",
    status: "complete",
    venue: "Cheesecake Factory",
  },
  {
    id: "0006",
    first: "shelley",
    second: "Ahsoka",
    date: "05-01-2023",
    status: "complete",
    venue: "Olive Garden",
  },
  {
    id: "0007",
    first: "shelley",
    second: "Padme",
    date: "05-02-2023",
    status: "complete",
    venue: "",
  },
  {
    id: "0008",
    first: "shelley",
    second: "Mando",
    date: "04-28-2023",
    status: "complete",
    venue: "Chipotle",
  },
  {
    id: "0009",
    first: "shelley",
    second: "Grogu",
    date: "05-05-2023",
    status: "complete",
    venue: "Taco Bell",
  },
  {
    id: "00010",
    first: "shelley",
    second: "ObiWan",
    date: "02-14-2024",
    status: "scheduled",
    venue: "Cheesecake Factory",
  },
  {
    id: "00011",
    first: "shelley",
    second: "Ahsoka",
    date: "05-01-2023",
    status: "complete",
    venue: "Olive Garden",
  },
  {
    id: "00012",
    first: "shelley",
    second: "Padme",
    date: "05-02-2023",
    status: "pending",
    venue: "",
  },
  {
    id: "00013",
    first: "shelley",
    second: "Mando",
    date: "04-28-2023",
    status: "complete",
    venue: "Chipotle",
  },
  {
    id: "00014",
    first: "shelley",
    second: "Grogu",
    date: "05-05-2023",
    status: "scheduled",
    venue: "Taco Bell",
  },
  {
    id: "00015",
    first: "shelley",
    second: "ObiWan",
    date: "02-14-2024",
    status: "scheduled",
    venue: "Cheesecake Factory",
  },
];

const Dashboard = () => {
  const { authUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [outings, setOutings] = useState([]);

  useEffect(() => {
    // fetch outings from DB
    setOutings(mockData);
  }, []);

  // filter all outings by status and return arrays for each dashboard section
  const isPending = (outing) => outing.status === "pending";
  const isScheduled = (outing) => outing.status === "scheduled";
  const isComplete = (outing) => outing.status === "complete";

  const pending = outings.filter(isPending);
  const scheduled = outings.filter(isScheduled);
  const complete = outings.filter(isComplete);

  console.log({ pending, scheduled, complete });

  const handleSignOut = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
  };

  const createOuting = (datetime, invited, location) => {
    console.log(datetime);
    console.log(datetime.format('YYYY-MM-DD HH:MM'));
    console.log(invited);
    console.log(location);
    fetch("https://bhupathitharun.pythonanywhere.com/api/createOuting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(authUser.username + ":" + authUser.password)}`,
      },
      body: JSON.stringify({
        date_time: datetime.format('YYYY-MM-DD HH:MM'),
        location: location,
        partner: invited,
      }),
    })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      console.log("DASHBOARD")
      if (resp.error)
        alert(resp.error);
      // update outing list
      //navigate?
    });
    
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <Login />
          <Signup />
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
          <CreateOuting createOuting={createOuting}/>
          <Stack
            direction={{ xs: "column", md: "row" }}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              sx={{
                width: 400,
                height: 300,
                backgroundColor: darkGrey,
                color: "white",
              }}
            >
              <Button
                variant="contained"
                sx={{ marginTop: "20px" }}
                onClick={createOuting}
              >
                Create New Outing
              </Button>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  marginTop: "10px",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 200,
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
                          primary={`${item.date} with ${item.second}`}
                        />
                      </ListItem>
                    );
                  })}
                </ul>
              </List>
            </Box>
            <Box
              sx={{
                width: 400,
                height: 300,
                backgroundColor: darkGrey,
                color: "white",
              }}
            >
              <List
                sx={{
                  width: "100%",
                  maxWidth: 400,
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
                          primary={`${item.date} with ${item.second} @ ${item.venue}`}
                        />
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
                        primary={`${item.date} with ${item.second} @ ${item.venue}`}
                      />
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
