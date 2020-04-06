const express = require('express');
const User = require('../model/user');
const router = new express.Router();
const auth = require("../middleware/auth");
const {sendWelcomeEmail} = require("../emails/account");


router.post('/registerUser', async (req, res) => {
   const user = new User(req.body);
   try {
      const token = await user.generateAuthToken();
      // await user.save()
      res.status(201).send(user);
   } catch (e) {
      res.status(400).send({ message: e.message });
   }
});

router.post('/user/login', async (req, res) => {
   try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      sendWelcomeEmail(user.email, user.name);
      res.send({user, token});
   } catch (e) {
      res.status(400).send();
   }
});

router.get('/usersList', auth, async (req, res) => {
   try {
      const usersList = await User.find({})
      res.status(201).send(usersList)
   } catch (e) {
      e.status(500).send()
   }
});

router.get('/users/me', auth, async(req, res) => {
   res.send(req.user);
});

router.post('/users/logout', auth, async(req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token != req.token;
      })
      await req.user.save();
      res.send()
   } catch (error) {
      res.status(500).send();
   }
});

router.post('/users/logoutAll', auth, async (req, res) => {
   try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send('{message: "All sessions logged out"}')
   } catch (error) {
      res.status(500).send('Something is not correct');
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
      res.send(req.user);
   } catch (e) {  
      res.status('404').send({ message: e.message });
   }
});

//Delete
router.delete('/users/me', auth, async (req, res) => {
   try {
      req.user.remove();
      res.status(200).send('User removed successfully');

   } catch (e) {
      res.status(400).send('Invalid request');
   }
});

module.exports = router;