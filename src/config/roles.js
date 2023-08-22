const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);

// Transite an Array
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
