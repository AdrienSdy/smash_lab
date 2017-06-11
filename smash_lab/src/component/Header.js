import React, { Component } from 'react';
import Status from './Header/Status';
import Smash from './Header/Smash';
import Player from './Header/Player';

export default class Header extends Component {
    constructor(props){
        super(props);
        this.state = this.props.state;
    }
    componentWillReceiveProps(nextProps){
       this.setState(nextProps.state);
    }

    render() {
        return (
            <header>
                <div>
                    <Player 
                        player='player'
                        hero_id={this.state.player.hero_id}
                        hero_name={this.state.player.name}
                    />   
                    <Status 
                        player='player'
                        state={this.state}
                    />                  
                    <Smash />
                </div>
                <p>VERSUS</p>
                <div>
                   <Smash />
                    <Status 
                        player='enemy'
                        state={this.state}
                    />
                    <Player
                        player='enemy'
                        hero_id={this.state.enemy.hero_id}
                        hero_name={this.state.enemy.name}
                    />    
                </div>
            </header>
        )
    }
}