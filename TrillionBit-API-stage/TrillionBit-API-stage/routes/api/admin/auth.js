const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');
const keys = require('../../../config/key');
const jwt = require('jsonwebtoken');

const validateLoginInput = require('../../../validation/login');
const validateRegisterInput = require("../../../validation/register");

const Admin = require('../../../models/Admin');

/**
 * @route GET /api/auth/test
 * @description Test auth route
 * @access Public
 */
router.get('/test', (req, res) => res.json({'msg': 'Admin auth works'}));

/**
 * @route Post /api/admin/auth/register
 * @description Register admin | returning admin object or error
 * @access Public
 */
router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne({ email: req.body.email })
    .then( admin => {
      if(admin) {
        return res.status(400).json({ email: 'Admin already exists.' });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        const newAdmin = new Admin({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        TwinBcrypt.hash(newAdmin.password, function(hash) {
          // Store hash in your password DB.
          newAdmin.password = hash;
          newAdmin
            .save()
            .then(admin => {
              res.json(admin);
            })
            .catch(err => console.log(err));
        });
      }
    });
});

/**
 * @route Post /api/admin/auth/login
 * @description Login admin | returning JWT Token
 * @access Public
 */
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    // console.log(res.status(400).json(errors));
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find admin by email
  Admin.findOne({ email }).lean().populate('roles', 'name _id')
    .then(admin => {
      // Check for admin
      if (!admin) {
        return res.status(404).json({ email: 'Admin not found.' });
      }

      TwinBcrypt.compare(password, admin.password, function(isMatch) {
          if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              avatar: admin.avatar,
              roles:  admin.roles,
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretKey,
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });  
              }
            );

          } else {
            return res.status(400).json({ password: 'Password incorrect'});
          }
      });
    });
});

module.exports = router;