var Screenshot = require('./screenshotModel');
var User = require('../user/userModel');
var takeScreenshot = require('../../screenshotCapture/script.js');
var Promise = require('bluebird');

exports.list = function(req, res, next){
  // user found through router.param
  var user = req.foundUser;
  // find screenshots whos user_id's match the found users username
  Screenshot.find({ user_id: user.username }, function(err, screenshots){
    if (err) return res.status(500).json({
      status: 500, message: 'Internal Server Error'
    });
    res.status(200).json(screenshots);
  });
};

/**
 * create
 * ======
 * Takes screenshot of specified URL, creates new Screenshot in DB, and
 * adds screenshot to the user images.
 */
exports.create = function(req, res, next) {
  var username = req.params.username;
  var url = req.body.url;

  takeScreenshot(url, function(err, imageUrl) {
    if (err) return res.status(500).json({ message: err });

    // Save screenshot
    var newScreenshot = new Screenshot({url: url, originalImage: imageUrl,
                      annotatedImage: imageUrl, user_id: username});
    newScreenshot.save(function(err, screenshot) {
      if (err) return res.status(500).json({ message: err });

      // Get user to add the screenshot
      User.findOne({username: username}, function(err, user) {
        if (err) return res.status(404).json({ message: err });

        // Add screenshot to user
        User.update({username: username}, {$push: {"images": screenshot._id}}, function(err, numAffected, rawResponse) {
          if (err) return res.status(500).json({ message: err });
          res.status(201).json(screenshot);
        });
      });
    });
  });
};

exports.show = function(req, res, next) {
  var username = req.params.username;
  var id = req.params.id;
  Screenshot.findOne({ _id: id }, function(err, screenshot) {
    if (err) return res.status(404).end();
    res.status(200).json(screenshot);
  });
};

/**
 * update
 * ======
 * Updates resource with new key-value pairs passed in the request body
 */
exports.update = function(req, res, next) {
  var id = req.params.id;
  var newData = req.body;
  Screenshot.update({_id: id}, newData, function(err, numberAffected, raw) {
    if (err) {
      return res.status(404).end();
    }
    res.sendStatus(200);
  })
};

exports.destroy = function(req, res, next) {
  var username = req.params.username;
  var id = req.params.id;
  Screenshot.findOne({_id: id}, function(err, screenshot) {
    if (!screenshot) {
      res.status(404).end();
    } else {
      Screenshot.remove({_id: id}, function(err) {
        if (err) {
          return res.status(500).end();
        }
        res.status(200).end();
      })
    }
  })
};
