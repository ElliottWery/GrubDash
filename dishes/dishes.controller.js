const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//handlers/middleware functions to implement in dishes.controller.js (create, read, update, and list)
//dishes cannot be deleted

function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body 
    const newDish = {
        name, description, price, image_url,
        id: dishes.length + 1
    }

    if (!price || isNaN(price) || price <= 0) {
        return next({
            status: 400,
            message: `price ${price}.`,
        });
    }
    
    if (!image_url) {
        return next({
            status: 400,
            message: `image_url is empty ${req.params.orderId}.`,
        });
    }

    if (!description) {
        return next({
            status: 400,
            message: `description is empty ${req.params.orderId}.`,
        });
    }

    dishes.push(newDish)

    res
        .status(201)
        .json({ data: newDish })
}

function dishExists(req, res, next) {
    const dishId = (req.params.dishId);
    res.locals.dish = dishes.find((dish) => dish.id === dishId);
    if (res.locals.dish) {
      return next();
    }
    next({
      status: 404,
      message: `Dish id not found: ${req.params.dishId}`,
    });
  }

  function hasName(req, res, next) {
    const { data: { name } = {} } = req.body;
  
    if (name) {
      return next();
    }
    next({ status: 400, message: "A 'name' property is required." });
  }

const read = (req, res, next) => {
    res.json({ data: res.locals.dish })
}

function update(req, res, next) {
    const foundDish = res.locals.dish
    const { data: { name, description, price, image_url, id } = {} } = req.body
    foundDish.name = name
    foundDish.description = description
    foundDish.price = price
    foundDish.image_url = image_url

if (id && id !== req.params.dishId) {
    return next({
        status: 400,
        message: `id ${id} ${req.params.dishId}.`,
        }); 
}

if (!name) {
    return next({
        status: 400,
        message: `name is empty ${req.params.orderId}.`,
    }); 
}

if (!description) {
    return next({
        status: 400,
        message: `description is empty ${req.params.orderId}.`,
    });
}
if (!image_url) {
    return next({
        status: 400,
        message: `image_url is empty ${req.params.orderId}.`,
    });
}
if (!price || isNaN(price) || price <= 0 || typeof price != "number") {
    return next({
        status: 400,
        message: `price ${price}.`,
    });
}

    res
        .json({
            data: foundDish
        })
}

function list(req, res) {
    res.status(200).json({ data: dishes })
}

module.exports = {
    create: [hasName, create],
    list,
    read: [dishExists, read],
    update: [dishExists, update],
};
