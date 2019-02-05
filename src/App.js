import React, { Component } from "react";
import * as Survey from "survey-react";
import uuid from "uuid/v4";
import showdown from "showdown";

import "./App.css";

Survey.JsonObject.metaData.addProperty("question", "unit:text");
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
    if (surveyName.length === 0) {
      this.setState({phase: 'landingPage'});
      return;
    }

    document.title = "Fragen: " + surveyName;

    fetch(BACKEND_URL + "/fragen/" + surveyName)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error("statusCode=" + response.status);
      })
      .then((questionnaire) => {
        this.questionnaire = questionnaire;
        this.survey = new Survey.Model(questionnaire);

        const converter = new showdown.Converter();
        this.survey
          .onTextMarkdown
          .add(function (survey, options) {
            //convert the mardown text to html
            const str = converter.makeHtml(options.text);
            //remove <p> & </p>; set html
            options.html = str.substring(3, str.length - 4);
          });

        document.title = questionnaire.title;
        this.setState({
          phase: 0,
          questionIndex: 1,
          questionsCount: this.survey.getAllQuestions().length
        })
      })
      .catch((error) => {
        if (error.message.startsWith('statusCode=')) {
          let errorCode = parseInt(error.message.replace('statusCode=', ''));
          let errorMessage = `Ein Fehler ist aufgetreten (${errorCode})`;
          if (errorCode === 404) {
            errorMessage = `Es gibt keinen Fragebogen mit Namen "${surveyName}" (Fehler ${errorCode})`;
          }
          this.setState({phase: 'error', errorMessage});
        }

        console.error(error);
      });
  }

  onValueChanged(result) {
    this.data = result.valuesHash;

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

  onAfterRenderQuestion(survey, question) {
    question.htmlElement.querySelectorAll('input[type="text"], input[type="number"]')
      .forEach((element) => {
        element.addEventListener('keypress', (event) => {
          if (event.key === "Enter") {
            element.blur();
          }
        });
        element.focus();
      });

    if (question.question.unit) {
      const unitSpan = document.createElement('div');
      unitSpan.classList.add("unit")
      unitSpan.innerText = question.question.unit;

      const answerDiv = question.htmlElement.children[1];
      answerDiv.classList.add("answer-with-unit")
      answerDiv.append(unitSpan);
    }
  }

  renderContent(phase) {
    if (phase === 'error') {
      return (
        <div className="sv_row">
          <h1>{this.state.errorMessage}</h1>
          Ein schlimmer Fehler ist passiert. Hoffentlich ist es nicht deine Schuld.
          <div style={{textAlign: 'right', marginTop: '1rem'}}>
            <button type="button" onClick={() => window.location.reload()}>Nochmal probieren?</button>
          </div>
        </div>
      );
    }
    if (phase === 'landingPage') {
      return (
        <div className="sv_row">
          <h1>Fragen / Antworten</h1>
          Ein <a href="https://github.com/neopostmodern/fragen">Open</a>
          {' '}<a href="https://github.com/neopostmodern/antworten">Source</a>{' '}
          Online Fragebogen System von <a href="http://neopostmodern.com">neopostmodern</a>,
          basierend auf <a href="https://surveyjs.io/">SurveyJS</a>.
        </div>
      );
    }
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
          onAfterRenderQuestion={this.onAfterRenderQuestion}
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
            </div>
          </div>
        </div>
        {this.renderContent(this.state.phase)}

      </div>
    );
  }
}

export default App;
