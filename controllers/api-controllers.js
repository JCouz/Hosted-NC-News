const { fetchApi } = require('../models/api-model');

exports.getApi = (req, res, next) => {
  res.status(200).send(fetchApi());
};
