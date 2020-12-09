const bcrypt = require("bcrypt");

const adminuser = [
  {
    name: "imon hasan",
    email: "imonhasans33@gmail.com",
    password: bcrypt.hashSync("12345", bcrypt.genSaltSync(10)),
    isAdmin: true,
  },
];

module.exports.adminuser = adminuser;
