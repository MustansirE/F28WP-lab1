const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const mysql = require('mysql');
const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});


exports.register = (req,res) => {
    console.log(req.body);

    const {name,email,password,passwordConfirm} = req.body;
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0){
            return res.render ('register'), {
                message: 'This email is already taken'
            }
        } else if (password !== passwordConfirm ){
            return res.render ('register', {
                message: 'Passwords do not match'
            });
        };
        let hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);

        db.query ('INSERT INTO user SET?', {user_name:name, email:email, password:hashedpassword}, (error,result) => {
            if (error){
                console.log(error);
            } else {
                console.log(result);
                return res.render ('register', {
                    message: 'User Successfully Registered'
                }
            )}
        });
    });
};

exports.login = (req,res) => {
    console.log(req.body);
    const {email,password} = req.body;
    db.query('SELECT email,password FROM user WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        console.log(result);
        if (result.length == 0){
            return res.render('login', {
                message: 'Invalid email or password'
            }
        )};
        const user = result[0];
        bcrypt.compare(password,user.password, (error, bcryptres) => {
            if (error){
                console.log(err);
            }
            if (bcryptres){
                return res.render('profile'), {
                    message : 'login successful'
                }
            } else {
                return res.render('login', {
                    message: 'Invalid email or password'
                }
            )};
        });

    });
}