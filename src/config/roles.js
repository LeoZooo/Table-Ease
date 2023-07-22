const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);

// 转换为一个数组
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
