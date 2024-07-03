const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { searchService } = require('../services');
const pick = require('../utils/pick');

const search = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'description']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await searchService.search(filter, options);
  res.status(httpStatus.OK).send(results);
});

module.exports = {
  search,
};
