//const Hero = require('../model/hero');

const {heroes} = require('../data.json');


exports.getHeroes = (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*'
  });
  res.send(heroes);
  /*
  Hero.find()
  .exec((err, heroes) => {
    if (err) { res.send(err); }
    res.json(heroes);
  });
  */
}

exports.getHero = (req, res) => {
  const hero = heroes[req.params.id];
  res.set({
    'Access-Control-Allow-Origin': '*'
  });
  res.send(hero);
}

/*
exports.createHero = async (req, res) => {
  const hero = await new Hero(req.body).save();
  res.json(hero);
}
*/