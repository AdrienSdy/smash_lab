import React, { Component } from 'react';
import SocketIOClient from 'socket.io-client';
import Home from './component/Home';
import Header from './component/Header';
import Game from './component/Game';
import './SmashLab.css';

//const server_link = 'http://localhost:3100'
//const server_link = 'http://127.0.0.1:3100'
const server_link = 'http://192.168.0.22:3100'
//const server_link = 'https://opentdb.com/api.php?amount=1&type=multiple';

class SmashLab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: null,
      smash: null
    };

    this.setHero = this.setHero.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.getSmash = this.getSmash.bind(this);
    this.attack = this.attack.bind(this);
    this.life = this.life.bind(this);

    this.init = this.init.bind(this);
    this.init();    
  }

  init(){
    this.socket = SocketIOClient(server_link);

    this.socket.on('lab', (player_id) => {
      this.setState({
        player_id: player_id
      });
      this.socket.emit('start');
    });

    this.socket.on('start', (enemy_id) => {
      this.setState({
        enemy_id: enemy_id
      }); 
      this.socket.emit('match');
    });

    this.socket.on('match', (enemy_id) => {
      this.setState({
        enemy_id: enemy_id
      });
    });

    this.socket.on('enemySelection', (enemy_hero_id) => {
      this.getHero(enemy_hero_id)
      .then(enemy_hero => {
        this.setState({
          enemy: {
            hero_id: enemy_hero.id,
            name: enemy_hero.name,
            max_life: enemy_hero.max_life,
            life: enemy_hero.max_life,
            rage: 0
          }
        });
      }).catch(error => {
        console.log(error);
      });
    });

    this.socket.on('attack', (player) => {
      this.life(!player);
    });

    this.socket.on('friendDisconnect', () => {
      window.location.href = window.location;
    });
  }

  setHero(hero_id){
    this.getHero(hero_id)
    .then(hero => {
      this.setState({
        player: {
          hero_id: hero.id,
          name: hero.name,
          max_life: hero.max_life, 
          life: hero.max_life, 
          rage: 0
        }
      });
    }).catch(error => {
      console.log(error);
    });
    
    this.socket.emit('setHero', hero_id);
  }
  
  getQuestion(){
    //this.getSmash();
    return fetch(server_link)
    .then((response) => {
      return response.json();
    }).catch((error) => {
      console.log(error);
    });
  }

  getHeroes(){
    return fetch(server_link + '/heroes')
    .then((response) => {
      return response.json();
    }).catch((error) => {
      console.log(error);
    });
  }

  getHero(hero_id){
    return fetch(server_link + '/heroes/' + hero_id)
    .then((response) => {
      return response.json();
    }).catch((error) => {
      console.log(error);
    });
  }

  getSmash(){
    if(!this.state.count){
      this.setState({
        count: Math.floor(Math.random() * 6)
      });
      if(!this.state.smash){
        this.setState({
          smash: 0
        })
      }
    }else{
      this.setState({
        count: this.state.count - 1
      });
    }
  }

  life(enemy){
    if(enemy){
      this.setState({
        enemy: {
          hero_id: this.state.enemy.hero_id,
          max_life: this.state.enemy.max_life,
          life: this.state.enemy.life - 5
        }
      }); 
    } else {
      this.setState({
        player: {
          hero_id: this.state.player.hero_id,
          max_life: this.state.player.max_life,
          life: this.state.player.life - 5
        }
      }); 
    }
  }

  attack(enemy){
    this.life(enemy);
    this.socket.emit('attack', enemy);
  }

  render() {
    let template = null;
    if (this.state.player !== undefined && this.state.enemy !== undefined){
      template = 
        <div>
          <Header state={this.state} />
          <Game attack={this.attack} getQuestion={this.getQuestion}/>
        </div>;
    } else if (this.state.player !== undefined){
      template = "En attente de la sélection de votre adversaire";
    } else if (this.state.player_id !== undefined && this.state.enemy_id !== undefined) {
      template =
        <Home 
          getHeroes={this.getHeroes}
          setHero={this.setHero}
        />;
    } else if (this.state.player_id !== undefined){
      template = "Salut, tu es en attente d'un autre joueur";
    } else {
      template = "Salut, tu n'as pas matché dsl. Reload";
    }
    return (
      <div> 
          { template }
      </div>
    );
  }
}

export default SmashLab;
