const express = require('express');
const {Router} = express;
require('dotenv').config()

//const mongoose = require('mongoose');

// const mongodbErrorHandler = require('mongoose-mongodb-errors');
// mongoose.plugin(mongodbErrorHandler);

const HeroController = require('../controller/hero');

const bodyParser = require('body-parser');
const router = Router();

// Grâce à dotenv, on peut utiliser des variables d'environnement en dev.
//mongoose.connect(process.env.DATABASE);

router.use(bodyParser.json({'extended': true}));
router.use(bodyParser.json());

const catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
}

router.get('/', HeroController.getHeroes);
router.get('/:id', HeroController.getHero);
// router.post('/', catchErrors(HeroController.createHero));
// router.put('/:id', HeroController.updateHero);
// router.delete('/:id', HeroController.deleteHero);

/** /
// on le supprime pcq obligé d'envoyer un header Accept:application/json
if(process.env.NODE_ENV === 'development') {
  router.use(require('errorhandler')());
}
/**/

// production
router.use((err, req, res, next) => {
  res.status(err.status || 500)
  .json({
    message: err.message,
    error: {}
  });
  next(err);
});

module.exports = router;
