import { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Grid,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Button,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

// TODO: Pass in outing_id as prop
const RestaurantList = () => {
  // photo, distance, etc...
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const { authUser } = useAuth();
  const location = useLocation();
  const { outing_id } = location.state;
  const navigate = useNavigate();

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    let rightCount = right.length;
    let toFill = 4 - rightCount;
    let newLeft = [...left];
    let newRight = [...right];
    while (toFill > 0) {
      let randomIndex = Math.floor(Math.random() * newLeft.length);
      let elem = newLeft.splice(randomIndex, 1);
      newRight = newRight.concat(elem);
      toFill--;
    }
    setRight(newRight);
    setLeft(newLeft);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  useEffect(() => {
    fetch("https://bhupathitharun.pythonanywhere.com/api/getRestaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(authUser.username + ":" + authUser.password)}`,
      },
      body: JSON.stringify({
        outing_id: outing_id,
      }),
    })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp.error)
        alert(resp.error);
      setLeft(resp.response.restaurants); //TODO: Check if this is good
    });
  }, [])

  const submitRestaurants = () => {
    let res_ids = []
    right.forEach((restaurant) => {
      res_ids.push(restaurant.id)
    })
    console.log(res_ids);
    console.log(outing_id);
    fetch("https://bhupathitharun.pythonanywhere.com/api/postRestaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(authUser.username + ":" + authUser.password)}`,
      },
      body: JSON.stringify({
        outing_id: outing_id,
        restaurant_ids: res_ids, //TODO: check if this is right
      }),
    })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp.error) alert(resp.error);
      navigate("/couples-dilemma/");
    });
  }

  const customList = (items, width, height, column) => (
    <Paper>
      <ImageList sx={{ width: width, height: height }} cols={column} dense component="div" role="list">
        {items.map((info) => {
          const labelId = `transfer-list-item-${info.id}-label`;

          return (
            //TODO: Possibly change the display according to data received from getRestaurants
            <ListItemButton
              key={info.id}
              role="listitem"
              onClick={handleToggle(info)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(info) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ImageListItem>
                <img
                  src={`${info.image_url}`}
                  srcSet={`${info.image_url}`}
                  alt={info.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={`${info.name} ${info.rating} stars`}
                  subtitle={info.category}
                  actionIcon={
                    <Button href={info.yelp_url} target="_blank">YELP LINK</Button>
                  }
                />
              </ImageListItem>
            </ListItemButton>
          );
        })}
      </ImageList>
    </Paper>
  );

  return (
    <div>
      <h1>Choose your Top 4 Restaurants!</h1>
      <h5>
        We have generated 3 restaurants for each of your preferences, totalling 6! 
        Please choose your top 4 restaurants to be selected to our random selection process!
      </h5>
      <h5>
        You may choose up to 4. If you wish, you may also press "RANDOM FILL" to randomly fill up your 
        top choices!
      </h5>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <h3>Choose</h3>
          <div>{customList(left, 300, "50%", 1)}</div>
        </Grid>
        <Grid item marginTop={15}>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0 || right.length === 4}
              aria-label="Random Suggestions"
            >
              Random Fill
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid item>
            <h3>Top Choices</h3>
            <div>{customList(right, 800, "50%", 2)}</div>
        </Grid>
      </Grid>
      <Button onClick={() => submitRestaurants()}>SUBMIT!</Button>
    </div>
  );
}

export default RestaurantList;