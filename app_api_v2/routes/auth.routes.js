const AuthController = require('../controllers/auth.controller')

const express = require('express');
const router  = express.Router();

router.get('/login', AuthController.login)
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send(false)
    }
    return res.send(true)
  })
})

module.exports = router