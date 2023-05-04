import React, { useState } from 'react'

const Preferences = () => {
  // Distance
  // price
  // category
  // num reviews
  // rating
  // parking
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [parking, setParking] = useState(false);

  return (
    <div>
      <h1>Choose your Preferences</h1>

    </div>
  )
}

export default Preferences