const express = require('express');
const { resolve } = require('path');

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Intialize databse
let db;

(async () => {
  try {
    db = await open({
      filename: './BD4_Assignment1/database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Database Connected Successfully!');
  } catch (error) {
    console.log('Failed to Connect the database: ' + error);
  }
})();

// ---------------------------------------------------------- //
//       Chapter 4: FoodieFinds: Food Discovery App           //
// ---------------------------------------------------------- //

// Endpoint - 1 (Get all Restaurants)

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants;';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found!' });
    }
    return res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Path = /restaurants

// Endpoint - 2 (Get restaurants by ID)

async function fetchRestaurantByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?;';
  let response = await db.all(query, [id]);

  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    result = await fetchRestaurantByID(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurant by ID: ' + id + ' is present' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /restaurants/details/2

// Endpoint - 3 (Get restauarants by Cuisine)

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?;';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found by ' + cuisine + ' cuisine.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /restaurants/cuisine/Indian

// Endpoint - 4 (Get Restaurants by Filter)

async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?;';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    result = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No such restaurant is Found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false

// Endpoint - 5 (Get Restaurants Sorted by Rating)

async function fetchRestaurantsSortedByRating() {
  let query = 'SELECT * FROM restaruants ORDER BY rating ASC;';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    result = await fetchRestaurantsSortedByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /restaurants/sort-by-rating

// Endpoint - 6 (Get all dishes)

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes;';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /dishes

// Endpoint - 7 (Get dish by id)

async function fetchDishByID(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?;';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchDishByID(id);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dish found by ID: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /dishes/details/2

// Endpoint - 8 (Get dishes by filter)

async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?;';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    result = await fetchDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /dishes/filter?isVeg=true

// Endpoint 9 - (Get dishes sorted by price)

async function fetchDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await fetchDishesSortedByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /dishes/sort-by-price

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
