const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, 
        function (err, hash) {
            req.hashedPassword = hash;
            console.log("your hashed password is: ", req.hashedPassword);
            next();
        }
    );
}