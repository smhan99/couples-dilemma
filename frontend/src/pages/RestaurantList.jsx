import * as React from 'react';
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

const RestaurantList = () => {
  const data = [{
    id: "id1",
    name: "restaurant 1",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  },
  {
    id: "id2",
    name: "restaurant 2",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  },
  {
    id: "id3",
    name: "restaurant 3",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  },
  {
    id: "id4",
    name: "restaurant 4",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  },
  {
    id: "id5",
    name: "restaurant 5",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  },
  {
    id: "id6",
    name: "restaurant 6",
    price: "$$",
    category: "chinese",
    image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/sHY-EPE1_nu7j2W8wd_akw/o.jpg",
  }]
  // photo, distance, etc...
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(data);
  const [right, setRight] = React.useState([]);

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

  const customList = (items, width, height, column) => (
    <Paper>
      <ImageList sx={{ width: width, height: height }} cols={column} dense component="div" role="list">
        {items.map((info) => {
          const labelId = `transfer-list-item-${info.id}-label`;

          return (
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
                  title={`${info.name}  ${info.price}`}
                  subtitle={info.category}
                  // position="below"
                />
              </ImageListItem>
            </ListItemButton>
          );
        })}
      </ImageList>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <h1>CHOOSE</h1>
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
          <h1>TOP CHOICES</h1>
          <div>{customList(right, 800, "50%", 2)}</div>
      </Grid>
    </Grid>
  );
}

export default RestaurantList;