exports.trigger404 = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.customError = (err, req, res, next) => {
  if (err.status) res.status(err.status).send(err);
  else next(err);
};
exports.trigger500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'server error' });
};
