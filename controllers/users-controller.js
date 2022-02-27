const { fetchUsers } = require("../models/users-model.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(next);
};
