import React, { Component } from 'react';

export default class Status extends Component {
    constructor(props){
        super(props);
        this.state = this.props.state;
    }

    componentWillReceiveProps(nextProps){
        this.setState(nextProps.state);
    }

    render() {
        const player = this.props.player
        //const hero_id = this.state[player].hero_id
        let life = (this.state[player].life / this.state[player].max_life * 100)
        life = {width: life + '%'}
     //   const rage = {width: (this.state[player].rage / this.state.heroes[hero_id].max_rage ) + '%'}
        const rage = {width: '0%'}
        return (
            <div className="status-bar">
                <div className="life">
                    <div style={life}></div>                        
                </div>
                <div className="rage">
                    <div style={rage}></div>
                </div>
            </div>
        )
    }
}