const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

//two routes                                       /orders                                            and                                                /orders/:orderId

//attach handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js

router 
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);


router
    .route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);    

module.exports = router;
