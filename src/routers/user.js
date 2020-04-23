const express = require('express');
const User = require('../model/user');
const router = new express.Router();
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendResetTokenEmail } = require("../emails/account");
const { common } = require("../common");


router.post('/registerUser', async (req, res) => {
   try {
      const oldUser = await User.findOne({ email: req.body.email });
      if(oldUser) {
         return common.error(res, 'Email is already registered.');
      }
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      sendWelcomeEmail(user.email, user.name);
      common.success(res, { user, token });
   } catch (e) {
      common.fail(res, e);
   }
});

router.post('/user/login', async (req, res) => {
   try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      common.success(res, { user, token });
   } catch (e) {
      common.fail(res, e);
   }
});

router.post('/users/resetPassToken', async (req, res) => {
   const email = req.body.email;
   const hostName = req.headers.host == 'localhost:3000' ? 'localhost:8080' : req.headers.host;
   try {
      const user = await User.findOne({ email });
      if (!user) {
         return common.error(res, 'Email not found');
      }
      user.genResetPassToken();
      await user.save();
      sendResetTokenEmail(user.name, user.email, user.resetPassToken, hostName);
      common.success(res, [])
   } catch (e) {
      common.fail(res, e);
   }
});

router.post('/users/reset-password', async (req, res) => {
   const resetPassToken = req.body.resetPassToken;
   try {
      const searchVal = {
         resetPassToken,
         resetPasswordExpires: { $gt: Date.now() }
      }
      const user = await User.findOne(searchVal);
      if (!user) {
         common.error(res, 'Token expired');
      }
      await user.resetPassword(req.body.password);
      common.success(res, 'success');
   } catch (e) {
      common.fail(res, e);
   }
});


router.get('/usersList', auth, async (req, res) => {
   try {
      const usersList = await User.find({})
      common.success(res, usersList)
   } catch (e) {
      common.fail(res, e);
   }
});

router.get('/users/me', auth, async (req, res) => {
   common.success(res, req.user);
});

router.post('/users/logout', auth, async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token != req.token;
      })
      await req.user.save();
      common.success(res, 'Success')
   } catch (e) {
      common.fail(res, e);
   }
});

router.post('/users/logoutAll', auth, async (req, res) => {
   try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send('{message: "All sessions logged out"}')
   } catch (e) {
      common.fail(res, e);
   }
});


//Update
router.patch('/users/me', auth, async (req, res) => {
   try {
      console.log(req.user, req.body);
      Object.keys(req.body).forEach(key => {
         req.user[key] = req.body[key];
      });
      await req.user.save();
      common.success(res, req.user)
   } catch (e) {
      common.fail(res, e);
   }
});

//Delete
router.delete('/users/me', auth, async (req, res) => {
   try {
      req.user.remove();
      res.status(200).send('User removed successfully');

   } catch (e) {
      common.fail(res, e);
   }
});

module.exports = router;