import React, { Component } from "react";
import * as Survey from "survey-react";
import uuid from "uuid/v4";

import "./App.css";
import questionnaire from './questionnaire'

class App extends Component {
  constructor() {
    super();

    this.survey = new Survey.Model(questionnaire);
    this.state = {
      phase: 0,
      questionIndex: 1,
      questionsCount: this.survey.getAllQuestions().length
    }

    this.onValueChanged = this.onValueChanged.bind(this);
  }

  componentWillMount() {
    window.npm_submit = this.onSubmit.bind(this);

    document.title = "Fragen: " + document.location.pathname.replace('/', '')
  }

  onValueChanged(result) {
    this.data = result.valuesHash;

    // const undescribedOther = Object.entries(this.data).find(([key, value]) => {
    //   if (key.endsWith('-Comment')) {
    //     return false;
    //   }
    //   if (value !== 'other') {
    //     return false;
    //   }
    //
    //   // `this` can't be accessed
    //   return !Boolean(result.valuesHash[key + '-Comment']);
    // })
    //
    // if (undescribedOther) {
    //   return;
    // }

    setTimeout(() => {
      window.scrollTo({ top: document.body.clientHeight, behavior: "smooth" });

      const currentQuestionName = this.survey.getAllQuestions(true).pop().propertyHash.name;
      const questionIndex = questionnaire.elements.findIndex(question => question.name === currentQuestionName);

      this.setState({
        questionIndex: questionIndex + 1
      })
    }, 100);
  }

  onSubmit() {
    this.data.uuid = uuid();
    this.setState({ phase: 2 });

    fetch('http://localhost:4000/save/wohnungen', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.data)
    })
      .then(() => this.setState({ phase: 3 }))
      .catch(() => alert('Leider ist ein Fehler aufgetreten. Bitte versuche es noch einmal.'));
  }

  disableForm() {
    document.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      let focusedElement = document.querySelector(":focus");
      if (focusedElement) {
        focusedElement.blur();
      }
    })
  }

  renderContent(phase) {
    if (phase === 0) {
      return (
        <div className="sv_row">
          <div dangerouslySetInnerHTML={{__html: questionnaire.intro}} />
          <div style={{textAlign: 'right'}}>
            <button type="button" onClick={() => this.setState({ phase: 1 })}>Los geht's!</button>
          </div>
        </div>
      );
    }
    if (phase === 2) {
      return (
        <div className="sv_row">
          <h1>Daten werden hochgeladen...</h1>
          Bitte warten und das Fenster nicht schließen.
        </div>
      );
    }
    if (phase === 3) {
      return (
        <div className="sv_row">
          <div dangerouslySetInnerHTML={{__html: questionnaire.outro.replace('{uuid}', this.data.uuid)}} />
        </div>
      );
    }

    return (
      <div className="surveyjs">
        <Survey.Survey
          model={this.survey}
          onAfterRenderPage={this.disableForm}
          onValueChanged={this.onValueChanged}
        />
      </div>
    );
  }

  render() {
    let progress = 0;
    if (this.state.phase === 1) {
      progress = this.state.questionIndex / this.state.questionsCount * 100;
    }

    let baseNames = '';
    if (this.state.phase === 0) {
      baseNames += ' start';
    }
    if (this.state.phase >= 2) {
      baseNames += ' completed';
    }

    return (
      <div className={baseNames}>
        <div className="npm_header">
          <div className="npm_header_content">
            <div className="npm_header_progressbar">
              <div
                className="npm_header_progressbar_indicator"
                style={{width: `${progress}%`}} />
            </div>
            <div className="npm_header_text">
              <h1>Umfrage zur Wohnungssituation</h1>
              {/*<div className="npm_progress">*/}
                {/*Frage {this.state.questionIndex} / {this.state.questionsCount}*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        {this.renderContent(this.state.phase)}

      </div>
    );
  }
}

export default App;
