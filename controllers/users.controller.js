const usersCtrl = {};
const User = require('../models/User');
var async = require("async");
const passport = require("passport");
usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};
// usersCtrl.singup = (req, res) => {
//   let errors = [];
//   const { name, email, password, confirm_password } = req.body;
//   if (password != confirm_password) {
//     errors.push({ text: "Passwords do not match." });
//   }
//   if (password.length < 4) {
//     errors.push({ text: "Passwords must be at least 4 characters." });
//   }
//   var emailFound = false
//   if (errors.length > 0) {
//     res.render("users/signup", {
//       errors,
//       name,
//       email,
//       password,
//       confirm_password
//     });
//   }
//   else {
//     async.waterfall([
//       function (callback) {
//         User.findOne({ email: email })
//           .then(userData => {
//             if (userData) {
//               emailFound = true
//               callback(null, true)
//             }
//             else {
//               callback(null, true)
//             }
//           }).catch(err => {
//             callback(null, "ERRR")
//           });
//       },
//       function (value, callback) {
//         const newUser = new User({ name, email, password });
//         newUser.encryptPassword(password)
//           .then(userData => {
//             if (userData) {
//               callback(null, newUser)
//             }
//             else {
//               callback(null, newUser)
//             }
//           }).catch(err => {
//             callback(null, "ERRR")
//           });
//       },
//       function (value, callback) {
//         if (emailFound) {
//           callback(null, true)
//         } else {
//           value.save()
//             .then(notes => {
//               callback(null, true)
//             }).catch(err => {
//               callback(null, true)
//             });
//         }
//       }
//     ],
//       function (err, results) {
//         if (err) {
//           req.flash("success_msg", "You are not registered.");
//           res.redirect("/users/signup");
//         } else {
//           if (emailFound) {
//             req.flash("error_msg", "The Email is already in use.");
//             res.redirect("/users/signup");
//           } else {
//             req.flash("success_msg", "You are registered.");
//             res.redirect("/users/signup");
//           }
//         }
//       });
//   }
// }

usersCtrl.singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};

usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};
usersCtrl.signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/users/signin",
  failureFlash: true
});
usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};
module.exports = usersCtrl;