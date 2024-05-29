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
];

const vendorPermissions = [...userPermissions, 'manageProduct'];

const adminPermissions = [
  ...vendorPermissions,
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
];

const allRoles = {
  user: userPermissions,
  vendor: vendorPermissions,
  admin: adminPermissions,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
