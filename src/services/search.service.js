const Advert = require('../models/advert.model');

/**
 * Search for adverts and categories.
 * @param {Object} filter - The search filters.
 * @param {Object} options - Query options (e.g., sortBy, limit, page).
 * @returns {Object} - The search results.
 */

/**
 * Search for adverts by name, description, and type.
 * @param {Object} filter - The search filters.
 * @param {Object} options - Query options (e.g., sortBy, limit, page).
 * @returns {Array} - Array of advert search results.
 */
const search = async (filter, options) => {
  const AdvertModel = await Advert();
  const { name, type } = filter;
  const { sortBy, limit = 10, page = 1 } = options;

  const advertQuery = {};

  if (name) {
    advertQuery.$or = [{ name: { $regex: name, $options: 'i' } }, { description: { $regex: name, $options: 'i' } }];
  }

  if (type) {
    advertQuery.type = type;
  }

  const sortOption = sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? -1 : 1 } : {};

  try {
    const advertResults = await AdvertModel.find(advertQuery)
      .sort(sortOption)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    return advertResults;
  } catch (error) {
    throw new Error(`Error fetching advert search results: ${error.message}`);
  }
};

module.exports = {
  search,
};
