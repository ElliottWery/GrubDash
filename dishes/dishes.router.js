const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

// Add 2 routers:                                  /dishes                                            and                                                /dishes/:dishId

//handlers to attach (create, read, update, and list) all exported from src/dishes/dishes.controller.js

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);
    


router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);
    


module.exports = router;
