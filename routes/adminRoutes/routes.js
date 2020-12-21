var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('dashboard/index');
});

router.get('/courses', function(req, res, next) {
  res.render('courses/index');
});

router.get('/teachers', function(req, res, next) {
  res.render('teachers/index');
});
router.get('/students', function(req, res, next) {
  res.render('students/index');
});


module.exports = router;