import React, { Component } from "react";
import * as Survey from "survey-react";
import uuid from "uuid/v4";

import "./App.css";

const BACKEND_URL = "http://localhost:4000";

class App extends Component {
  constructor() {
    super();

    this.state = {
      phase: -1
    }

    this.onValueChanged = this.onValueChanged.bind(this);
  }

  componentWillMount() {
    window.npm_submit = this.onSubmit.bind(this);

    const surveyName = document.location.pathname.replace('/', '');
    document.title = "Fragen: " + surveyName;

    fetch(BACKEND_URL + "/fragen/" + surveyName)
      .then((response) => response.json())
      .then((questionnaire) => {
        this.questionnaire = questionnaire;
        this.survey = new Survey.Model(questionnaire);
        document.title = questionnaire.title;
        this.setState({
          phase: 0,
          questionIndex: 1,
          questionsCount: this.survey.getAllQuestions().length
        })
      })
      .catch((error) => {
        alert("Ein schlimmer Fehler ist passiert. Neu laden?");
        console.error(error);
      });
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
      const questionIndex = this.questionnaire.elements.findIndex(question => question.name === currentQuestionName);

      this.setState({
        questionIndex: questionIndex + 1
      })
    }, 100);
  }

  onSubmit() {
    this.data.uuid = uuid();
    this.setState({ phase: 2 });

    fetch(BACKEND_URL + '/save/wohnungen', {
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
    if (phase === -1) {
      return (
        <div className="sv_row">
          <h1>Lade...</h1>
        </div>
      );
    }
    if (phase === 0) {
      return (
        <div className="sv_row">
          <div dangerouslySetInnerHTML={{__html: this.questionnaire.intro}} />
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
          <div dangerouslySetInnerHTML={{__html: this.questionnaire.outro.replace('{uuid}', this.data.uuid)}} />
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
              <h1>{this.questionnaire ? this.questionnaire.title : "Fragen"}</h1>
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
