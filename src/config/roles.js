const userPermissions = [
  'addEntry',
  'getEntries',
  'viewRoles',
  'getPermission',
  'updateProfile',
  'createKycRequest',
  'editKycRequest',
  'viewCategories',
  'viewBrands',
  'viewCollections',
  'createProduct',
  'viewProducts',
  'manageCart',
  'createOrder',
  'viewOrders',
  'createAdvert',
  'viewAdverts',
  'order',
  'addReview',
];

const adminPermissions = [
  ...userPermissions,
  'viewKycRequests',
  'viewPendingKycRequests',
  'approveKycRequest',
  'rejectKycRequest',
  'viewKycRequest',
  'getUsers',
  'manageUsers',
  'manageCategories',
  'manageBrands',
  'manageCollections',
  'manageProducts',
  'viewAllOrders',
  'manageAdverts',
  'manageOrder',
];

const allRoles = {
  user: userPermissions,
  admin: adminPermissions,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
