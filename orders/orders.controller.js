const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//add handlers/middleware functions (create, read, update, delete, and list orders)

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes, quantity } = {} } = req.body
  // creates object for new url info 
  const newOrder = {
    deliverTo, mobileNumber, dishes, quantity,
    id: orders.length + 1
  }
  if (!mobileNumber) {
    return next({
      status: 400,
      message: `mobileNumber is empty ${req.params.orderId}`,
    });
  }
  if (!deliverTo) {
    return next({
      status: 400,
      message: `deliverTo is empty ${req.params.orderId}`,
    });
  }
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: `There are no dishes ${req.params.orderId}`,
    }); 
  }
  
  for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i].quantity || dishes[i].quantity < 0 || typeof dishes[i].quantity !== "number") {
      return next({
        status: 400,
        message:  `Dish ${i} must have a quantity that is an integer greater than 0`,
    });
    }
  }
  
  

  orders.push(newOrder)

  res
    .status(201)
    .json({ data: newOrder })
}

function orderExists(req, res, next) {
  const orderId = (req.params.orderId);
  res.locals.order = orders.find((order) => order.id === orderId);
  if (res.locals.order) {
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${req.params.orderId}`,
  });
}

const read = (req, res, next) => {
  res.json({ data: res.locals.order })
}

function update(req, res, next) {
  const foundOrder = res.locals.order;
  const { data: { deliverTo, mobileNumber, dishes, quantity, status, id, price} = {} } = req.body;
  
  if (id && id != req.params.orderId) {
    return next({
      status: 400,
      message: `id does not match route id. Order: ${id}, Route: ${req.params.orderId}.`,
    });
  }
  if (!mobileNumber) {
    return next({
      status: 400,
      message: `mobileNumber is empty ${req.params.orderId}`,
    });
  }
  if (!deliverTo) {
    return next({
      status: 400,
      message: `deliverTo is empty ${req.params.orderId}`,
    });
  }
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: `There are no dishes ${req.params.orderId}`,
    }); 
  }
  if (status === "invalid" || !status) {
    return next({
      status: 400,
      message: `status is invalid ${req.params.orderId}`,
    });
  }
  
    for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i].quantity || dishes[i].quantity < 0 || typeof dishes[i].quantity !== "number") {
      return next({
        status: 400,
        message:  `Dish ${i} must have a quantity that is an integer greater than 0`,
    });
    }
  }
  foundOrder.deliverTo = deliverTo
  foundOrder.mobileNumber = mobileNumber
  foundOrder.dishes = dishes
  foundOrder.quantity = quantity

  res
    .json({
      data: foundOrder
    })
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: `order should not be pending: ${req.params.orderId}`,
    });
  }
  const index = orders.find((order) => { order.id === (orderId) });
  orders.splice(index, 1);
  res.sendStatus(204);
}

function list(req, res) {
  res.status(200).json({ data: orders })
}

module.exports = {
  create: [create],
  list,
  read: [orderExists, read],
  update: [orderExists, update],
  delete: [orderExists, destroy],
};
