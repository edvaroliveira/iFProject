const bcrypt = require("bcryptjs");

const password = "admin123";
const hashedPassword = bcrypt.hashSync(password, 8);

console.log(hashedPassword);
