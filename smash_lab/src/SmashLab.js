import React, { Component } from 'react';
import SocketIOClient from 'socket.io-client';
import Home from './component/Home';
import Header from './component/Header';
import Game from './component/Game';
import data from './data.json';
import './SmashLab.css';

//const server_link = 'http://localhost:3100'
//const server_link = 'http://127.0.0.1:3100'
const server_link = 'http://192.168.0.22:3100'
//const server_link = 'https://opentdb.com/api.php?amount=1&type=multiple';

class SmashLab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heroes: data.heroes,
      count: null,
      smash: null
    };

    this.heroSelected = this.heroSelected.bind(this);
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
      this.setState({
        enemy: {
          hero_id: enemy_hero_id, 
          life: this.state.heroes[enemy_hero_id].max_life
        }
      });
    });

    this.socket.on('attack', (player) => {
      this.life(!player);
    });

    this.socket.on('friendDisconnect', () => {
      window.location.href = window.location;
    });
  }

  heroSelected(hero_id){
    this.setState({
      player: {
        hero_id: hero_id, 
        life: this.state.heroes[hero_id].max_life, 
        rage: 0
      }
    });
    this.socket.emit('heroSelected', hero_id);
  }
  
  getQuestion(){
    //this.getSmash();
    return fetch(server_link)
    .then((response) => {
      return response.json();
    }).catch((error) => {
      console.log(error);
    })
  }

  getSmash(){
    if(!this.state.count){
      this.setState({
        count: Math.floor(Math.random * 6)
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
          life: this.state.enemy.life - 5
        }
      }); 
    } else {
      this.setState({
        player: {
          hero_id: this.state.player.hero_id,
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
          heroes={this.state.heroes}
          onSelectHero={this.heroSelected}
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
