import React, { Component } from 'react';
import Question from './Game/Question'
import Answers from './Game/Answers';
import Timer from './Game/Timer';
import './Game/Game.css';

export default class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            question: '',
            answers: []
        };
        this.getQuestion = this.getQuestion.bind(this);
        this.sendAnswer = this.sendAnswer.bind(this);
        this.progressBar = this.progressBar.bind(this);
        this.getQuestion();
    }

    getQuestion(){
        this.props.getQuestion().then((data) => {         
            this.setState({
                'question': data.question,                 
                'answers': data.answers,
                'correct_answer': data.correct_answer,
                'time': Date.now() 
            });
        });
    }

    sendAnswer(index){
        console.log('index: ' + index);
        this.props.attack(index === this.state.correct_answer);
        this.getQuestion();
    }

    progressBar(){
        let time = Date.now();
        let percent = (time - this.state.time)/50;
        if(percent > 100){
            if(percent < 100.2){
                this.sendAnswer(5);
            }
            return 0;
        }else{
            return percent;
        }
    }

    render() {  
        const question = this.state.question;
        const answers = this.state.answers;
        return (
            <div>
                <Question question={question} />
                <Answers sendAnswer={this.sendAnswer} answers={answers} />
                <Timer progressBar={this.progressBar}/>
            </div>
        )
    }
}