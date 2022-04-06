const fs = require('fs');

exports.fetchApi = () => {
  const data = fs.readFileSync('endpoints.json');
  const apiEndpoints = JSON.parse(data);
  return apiEndpoints;
};
