const { fetchApi } = require('../models/api-model');

exports.getApi = async (req, res, next) => {
  try {
    const api = await fetchApi();
    res.status(200).send(api);
  } catch (err) {
    next(err);
  }
};
