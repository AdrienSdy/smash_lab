import React, { Component } from 'react';

export default class Home extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            heroes: []
        };

        this.setHero = this.setHero.bind(this);
        this.getHeroes = this.getHeroes.bind(this);

        this.getHeroes();
    }

    setHero(hero_id){
        this.props.setHero(hero_id);
    }

    getHeroes(){
        this.props.getHeroes()
        .then(heroes => this.setState({heroes: heroes}))
        .catch(error => console.log(error))
    }

    render() {
        const heroes = this.state.heroes;
        return (
            <div>
                <h3>Choisissez votre personnage :</h3>
                { heroes.map( hero => (
                    <img key={hero.id}
                        src={process.env.PUBLIC_URL + '/img/hero/' + hero.id + '.png'}
                        alt={hero.name} 
                        onClick={() => {this.setHero(hero.id)}}
                    />
                )) }
            </div>
        )
    }
}