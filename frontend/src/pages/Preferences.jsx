import { FormControl, 
         FormLabel, 
         ToggleButtonGroup, 
         ToggleButton, 
         RadioGroup, 
         FormControlLabel, 
         Radio, 
         TextField, 
         Rating,
         FormGroup,
         Switch,  
         Button} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";

const Preferences = () => {
  const { authUser } = useAuth();

  const [distance, setDistance] = useState("500");
  const [price, setPrice] = useState('1');
  const [category, setCategory] = useState("chinese");
  const [otherCate, setOtherCate] = useState("");
  const [rating, setRating] = useState(0.5);
  const [parking, setParking] = useState(false);

  const handleCategory = (e, newCategory) => {
    setCategory(newCategory);
  }

  const handlePrice = (e, newPrice) => {
    setPrice(newPrice);
  }

  const handleDistance = (e, newDistance) => {
    setDistance(newDistance);
  }

  const submitPreferences = () => {
    fetch("https://bhupathitharun.pythonanywhere.com/api/postPreference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(authUser.username + ":" + authUser.password)}`,
      },
      body: JSON.stringify({
        //outing id
        rating: rating,
        category: (category === "other" ? otherCate : category),
        has_parking: parking,
        radius: Number(distance),
        price: Number(price),
      }),
    })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp.error)
        alert(resp.error);
      //navigate?
    });
  }

  return (
    <div className='preferences'>
      <h1>Choose your Preferences</h1>
      <p>category: {category === "other" ? otherCate : category}</p>
      <p>price: {price}</p>
      <p>rating: {rating}</p>
      <p>distance: {distance}</p>
      <p>parking available: {parking ? "true":"false"}</p>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <RadioGroup
          aria-labelledby="category"
          name='category'
          value={category}
          onChange={handleCategory}
        >
          <FormControlLabel value="chinese" control={<Radio />} label="Chinese" />
          <FormControlLabel value="japanese" control={<Radio />} label="Japanese" />
          <FormControlLabel value="mexican" control={<Radio />} label="Mexican" />
          <FormControlLabel value="other" control={<Radio />} label="Other: " />
          <TextField 
              id="category-other" 
              label="Anything else in mind?" 
              variant="filled" 
              onChange={(e) => {
                if (category === "other") {
                  setOtherCate(e.target.value)
                }
              }}
            />
        </RadioGroup>

        <FormLabel>Price</FormLabel>
        <ToggleButtonGroup
          value={price}
          exclusive
          onChange={handlePrice}
          aria-label="text alignment"
        >
          <FormControlLabel value="chinese" control={<ToggleButton value='1' aria-label="$">$</ToggleButton>}/>
          <FormControlLabel value="chinese" control={<ToggleButton value='2' aria-label="$$">$$</ToggleButton>}/>
          <FormControlLabel value="chinese" control={<ToggleButton value='3' aria-label="$$$">$$$</ToggleButton>}/>
          <FormControlLabel value="chinese" control={<ToggleButton value='4' aria-label="$$$$">$$$</ToggleButton>}/>
        </ToggleButtonGroup>

        <FormLabel>Rating</FormLabel>
        <FormControlLabel
          control={
            <Rating 
              name='rating' 
              value={rating} 
              precision={0.5}
              onChange={(event, newValue) => {
                if (newValue === 0.5) newValue = 1;
                setRating(newValue);
              }}
            />
          }
        />

        <FormLabel>Distance</FormLabel>
        <RadioGroup
          aria-labelledby="distance"
          name='distance'
          value={distance}
          onChange={handleDistance}
        >
          <FormControlLabel value="500" control={<Radio />} label="Within Few Blocks" />
          <FormControlLabel value="1000" control={<Radio />} label="Within the Neighborhood" />
          <FormControlLabel value="5000" control={<Radio />} label="Within 5km" />
          <FormControlLabel value="10000" control={<Radio />} label="Within 10km" />
        </RadioGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={parking} onChange={(e) => setParking(e.target.checked)} name="parking" />
            }
            label="Parking Available"
          />
        </FormGroup>
      </FormControl>
      <Button
        color='secondary'
        onClick={() => submitPreferences()}
      >Submit</Button>
    </div>
  )
}

export default Preferences