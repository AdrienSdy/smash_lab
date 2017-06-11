import React, { Component } from 'react';

export default class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            player: this.props.player,
            hero_id: this.props.hero_id,
            hero_name: this.props.hero_name
        }
    }

    render() {
        return (
            <div className="icon-player">
                <img 
                    src={process.env.PUBLIC_URL + '/img/hero/' + this.state.hero_id + '.png'}
                    alt={this.state.hero_name}
                />
                <p>{this.state.player}</p>
            </div>
        )
    }
}