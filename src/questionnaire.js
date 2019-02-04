const questionnaire = {
  showTitle: false,
  questionTitleTemplate: "{title}",
  showProgressBar: "top",
  elements: [
    {
      type: "radiogroup",
      name: "hgb",
      title: "Studierst oder arbeitest du an der HGB?",
      choices: [
        {
          value: "ja",
          text: "Ja"
        },
        {
          value: "ehemalige",
          text: "Ehemalige_r"
        },
        {
          value: "nein",
          text: "Nein"
        }
      ]
    },
    {
      type: "radiogroup",
      name: "hgb-position",
      visibleIf: "{hgb} notempty and {hgb} != \"nein\"",
      title: "In welcher Position bist/warst du an der HGB?",
      choices: [
        {
          value: "student",
          text: "Student_in"
        },
        {
          value: "mitarbeiter",
          text: "Mitarbeiter_in"
        },
        {
          value: "prof",
          text: "Professor_in"
        }
      ]
    },
    {
      type: "text",
      name: "other-position",
      visibleIf: "{hgb} = \"nein\"",
      title: "Was und wo studierst oder arbeitest du?"
    },
    {
      visibleIf: "{other-position} notempty or {hgb-position} notempty",
      type: "radiogroup",
      name: "wohnort",
      title: "Wo wohnst du?",
      description: "Im Sinne des persönlich empfundenen Hauptwohnsitzes.",
      choices: [
        {
          value: "berlin",
          text: "Berlin"
        },
        {
          value: "leipzig",
          text: "Leipzig"
        },
        {
          value: "halle",
          text: "Halle"
        },
        {
          value: "andere",
          text: "Andere"
        }
      ]
    },
    {
      type: "text",
      name: "other-wohnort",
      visibleIf: "{wohnort} = \"andere\"",
      title: "Wo denn?"
    },
    {
      visibleIf: "{hgb} = \"ja\" and {wohnort} notempty and ({wohnort} != \"andere\" or {other-wohnort} notempty)",
      type: "text",
      name: "fahrzeit",
      title: "Wie viele Minuten brauchst du von benannter Wohnung zur HGB?",
      inputType: "number"
    },
    {
      visibleIf: "({hgb} notempty and {hgb} != \"ja\" and {wohnort} notempty and ({wohnort} != \"andere\" or {other-wohnort} notempty)) or {fahrzeit} notempty",
      type: "radiogroup",
      name: "wohnungstyp",
      title: "In was für einer Art von Wohnung lebst du?",
      choices: [
        {
          value: "wg",
          text: "Wohngemeinschaft (WG)"
        },
        {
          value: "wohnung",
          text: "Wohnung (alleine oder mit Partner/Familie)"
        },
        {
          value: "hausprojekt",
          text: "Hausprojekt"
        },
        {
          value: "atelier",
          text: "Atelier"
        },
        {
          value: "haus",
          text: "Haus/Haushälfte"
        }
      ]
    },
    {
      type: "radiogroup",
      name: "zugelassen",
      visibleIf: "{wohnungstyp} = \"atelier\"",
      title: "Ist das Atelier offiziell als Wohnraum zugelassen?",
      choices: [
        {
          value: "ja",
          text: "Ja"
        },
        {
          value: "nein",
          text: "Nein"
        }
      ]
    },
    {
      visibleIf: "{wohnungstyp} notempty and ({wohnungstyp} != \"atelier\" or {zugelassen} notempty)",
      type: "text",
      inputType: "number",
      name: "people",
      title: "Wie viele Menschen inklusive dir wohnen in dem/der {wohnungstyp}?"
    },
    {
      visibleIf: "{people} notempty",
      type: "radiogroup",
      name: "vertrag",
      title: "Art des Mietvertrags",
      choices: [
        {
          value: "hauptmieter",
          text: "Hauptmieter_in"
        },
        {
          value: "untermieter-unbefristet",
          text: "Untermieter_in (unbefristet)"
        },
        {
          value: "untermieter-befristet",
          text: "Untermieter_in (befristet) / Zwischenmieter_in"
        },
        {
          value: "eigentümer",
          text: "Eigentümer_in"
        },
        {
          value: "gewerbe",
          text: "Gewerbemietvertrag"
        },
        {
          value: "kein",
          text: "Kein Vertrag"
        }
      ]
    },
    {
      visibleIf: "{vertrag} notempty",
      type: "text",
      inputType: "number",
      name: "miete",
      title: "Wie viel kostet dich deine Wohnsituation monatlich, inklusive alles?",
      description: "\"Inklusive alles\" bezieht sich auf Kaltmiete, Nebenkosten, Heizung, Strom, Gas, " +
      "Internet, et cetera. Pendelkosten oder ähnliches bitte hier nicht einrechnen."
    },
    {
      visibleIf: "{miete} notempty",
      type: "text",
      inputType: "number",
      name: "einkommen",
      title: "Wie viel Einkommen hast du monatlich?",
      description: "Dies schließt BAFöG, Stipendien, Wohngeld, et cetera ein - einfach alles. " +
      "Diese Frage ist notwendig um den Anteil der Miete am Einkommen zu ermitteln, einem in der " +
      "aktuellen Forschung wichtigen Wert."
    },
    {
      type: "radiogroup",
      name: "atelier",
      visibleIf: "{einkommen} notempty and {wohnungstyp} != \"atelier\"",
      title: "Hast du ein Atelier?",
      description: "Atelier wäre an dieser Stelle etwa ein separater Raum in einer Wohnung, ein mit Kommiliton_innen gemietetes Objekt, oder ähnlich." +
      "Nicht gemeint ist etwa der Klassenraum.",
      choices: [
        {
          value: "ja",
          text: "Ja"
        },
        {
          value: "nein",
          text: "Nein"
        },
        {
          value: "nein-nein",
          text: "Nein (und ich hätte auch keinen Bedarf)"
        }
      ]
    },
    {
      visibleIf: "{atelier} = \"ja\"",
      type: "text",
      inputType: "number",
      name: "atelier-miete",
      title: "Wie viel kostet dich deine Ateliersituation monatlich, inklusive alles?",
      description: "\"Inklusive alles\" bezieht sich auf Kaltmiete, Nebenkosten, Heizung, Strom, Gas, " +
      "Internet, et cetera. Pendelkosten oder ähnliches bitte hier nicht einrechnen."
    },
    {
      visibleIf: "({atelier} notempty and {atelier} != \"ja\") or {atelier-miete} notempty or {wohnungstyp} = \"atelier\" and {einkommen} notempty",
      type: "html",
      name: "submit",
      html: "<h1>Fertig?</h1>" +
        "Du hast alle Fragen beantwortet!<br/>" +
        "Wenn du nichts mehr korrigieren möchtest, klicke bitte auf 'Absenden'." +
        "<div style='text-align: right; margin-top: 1rem;'>" +
        "  <button type='button' onclick='window.npm_submit()'>Absenden</button>" +
        "</div>"
    }
  ],
  "intro": `
          <h1>Hallo.</h1>
          Dies ist eine Umfrage von Clemens Schöll aus der Medienkunst der HGB Leipzig zur Wohnungssituation, insbesondere von Menschen
          an der HGB Leipzig.<br/>
          Das Beantworten der Fragen dauert etwa fünf Minuten.
          Die Umfrage ist anonym und deine Daten werden rücksichtsvoll behandelt.<br/>
          <div class="small">
            <p>
              Die gesammelten Daten dienen primär der künstlerischen Recherche.
            </p>
            <p>
              Es ist ein Ziel die Daten öffentlich zugänglich zu machen. Dieser Vorsatz liegt jedoch unter Vorbehalt einer
              Privatsphäre-kompatiblen Möglichkeit (insbesondere respektive Deanonymisierung) der Veröffentlichung.
            </p>
            <p>
              Eine Weitergabe an Dritte (abgesehen von einer möglichen Öffentlichkeit wie oben beschrieben) findet nicht statt.
            </p>
            <p>
              Dies ist keine in Auftrag gegebene Umfrage.
            </p>
            <p>
              Diese Webseite verwendet keine Cookies.
            </p>
            <p>
              Dieses Projekt ist Open Source.
              Hier findest du den Quelltext für
              <a href="https://github.com/neopostmodern/fragen">die Webseite</a>
              und für
              <a href="https://github.com/neopostmodern/antworten">den Server</a>.
            </p>
            <p>
              Bei Fragen oder Zweifeln <a href="mailto:schoell@hgb-leipzig.de">schreib mir eine E-Mail</a>!
            </p>
          </div>`,
  "outro": `
          <h1>Vielen Dank für deine Teilnahme.</h1>
          <div className="normal">
            <h3>Was passiert jetzt?</h3>
            Erstmal nichts. Nachdem ich die Daten gesammelt und ausgewertet habe, werde ich überlegen,
            ob und wie ich die Daten in einer Privatsphäre-schützenden Form veröffentlichen kann.<br/>
            Spätestens zur Ausstellung <i>Verletzbare Subjekte</i> in der HGB Galerie wird ein indirekter Output gezeigt.
            <h3>Kann ich der Verwendung meiner Daten noch widersprechen?</h3>
            Ja, klar. Schicke mir <a href="mailto:schoell@hgb-leipzig.de">eine E-Mail</a> mit diesem Code: <code>{uuid}</code>
          </div>`
};

questionnaire.elements.forEach((element) => {
  if (typeof element.isRequired === 'undefined' && element.type !== "html") {
    element.isRequired = true;
  }
})

export default questionnaire;