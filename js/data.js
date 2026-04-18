const DATA = {
  meta: {
    appName: "KI Mastery",
    totalPhases: 4,
    xpPerTask: 15,
    xpPerChallenge: 30,
    xpPerQuiz: 20,
    streakBonus: 1.5
  },

  levels: [
    { level: 1,  title: "Neuling",       minXP: 0    },
    { level: 2,  title: "Entdecker",     minXP: 100  },
    { level: 3,  title: "Lernender",     minXP: 250  },
    { level: 4,  title: "Prompter",      minXP: 450  },
    { level: 5,  title: "KI-Versteher",  minXP: 700  },
    { level: 6,  title: "Spezialist",    minXP: 1000 },
    { level: 7,  title: "Automatisierer",minXP: 1400 },
    { level: 8,  title: "KI-Profi",      minXP: 1900 },
    { level: 9,  title: "Experte",       minXP: 2500 },
    { level: 10, title: "Claude Master", minXP: 3200 }
  ],

  achievements: [
    { id: "first_task",    title: "Erste Schritte",   desc: "Erste Aufgabe erledigt",          icon: "🚀", xp: 50  },
    { id: "week1_done",    title: "Woche 1 Boss",      desc: "Alle Aufgaben Woche 1 erledigt",  icon: "⭐", xp: 100 },
    { id: "streak_3",      title: "On Fire",           desc: "3 Tage Streak",                  icon: "🔥", xp: 75  },
    { id: "streak_7",      title: "Unaufhaltbar",      desc: "7 Tage Streak",                  icon: "💎", xp: 150 },
    { id: "quiz_perfect",  title: "Alles richtig",     desc: "Quiz ohne Fehler",               icon: "🎯", xp: 100 },
    { id: "all_theory",    title: "Theoretiker",       desc: "Alle Theorie-Aufgaben erledigt", icon: "📚", xp: 80  },
    { id: "all_challenge", title: "Challenger",        desc: "Alle Challenges erledigt",       icon: "🏆", xp: 120 },
    { id: "phase1_done",   title: "Phase 1 Complete",  desc: "Alle Phase-1-Aufgaben fertig",   icon: "🎓", xp: 200 }
  ],

  weeks: [
    {
      id: 0,
      title: "Woche 1",
      subtitle: "Was ist KI überhaupt?",
      color: "#39d98a",
      emoji: "🤖",
      goal: "Du kannst erklären wie ein LLM funktioniert und hast Claude bewusst zum ersten Mal genutzt.",
      days: [
        {
          tag: "Mo", name: "Was ist ein LLM?",
          tasks: [
            { id:"w0d0t0", txt: "YouTube: '3Blue1Brown — But what is a GPT?' anschauen", time: "25 Min", type: "theory", xp: 15 },
            { id:"w0d0t1", txt: "3 Begriffe aufschreiben: LLM, Training, Parameter — in eigenen Worten", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Di", name: "Claude kennenlernen",
          tasks: [
            { id:"w0d1t0", txt: "Claude.ai öffnen — 5 komplett verschiedene Fragen stellen", time: "20 Min", type: "practice", xp: 15 },
            { id:"w0d1t1", txt: "Notiere: Was überraschte dich? Was enttäuschte dich?", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Mi", name: "Tokens & Kontext",
          tasks: [
            { id:"w0d2t0", txt: "Schreibe Claude: 'Erkläre Token in 3 Sätzen für einen 17-Jährigen'", time: "10 Min", type: "practice", xp: 15 },
            { id:"w0d2t1", txt: "Teste Kontext-Verlust: langer Chat bis Claude Dinge vergisst", time: "15 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "Do", name: "KI-Modelle vergleichen",
          tasks: [
            { id:"w0d3t0", txt: "Selbe Frage an Claude UND ChatGPT — Antworten vergleichen", time: "20 Min", type: "practice", xp: 15 },
            { id:"w0d3t1", txt: "2 Unterschiede notieren die du bemerkt hast", time: "5 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Fr", name: "Halluzination entdecken",
          tasks: [
            { id:"w0d4t0", txt: "Frage Claude nach einer erfundenen Person — beobachte was passiert", time: "10 Min", type: "challenge", xp: 30 },
            { id:"w0d4t1", txt: "Schreib 1 Satz: 'Claude halluziniert wenn...'", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Sa", name: "Wissen festigen",
          tasks: [
            { id:"w0d5t0", txt: "Erkläre KI einem Familienmitglied in 2 Minuten ohne Fachbegriffe", time: "10 Min", type: "challenge", xp: 30 },
            { id:"w0d5t1", txt: "Mini-Quiz: Lass Claude dich zu den Wochenthemen abfragen", time: "15 Min", type: "practice", xp: 15 }
          ]
        },
        {
          tag: "So", name: "Reflektion & Pause",
          tasks: [
            { id:"w0d6t0", txt: "Interessanteste Erkenntnis der Woche — 3 Sätze aufschreiben", time: "10 Min", type: "reflect", xp: 15 },
            { id:"w0d6t1", txt: "Nächste Woche planen: Lernzeit in Kalender eintragen", time: "5 Min", type: "reflect", xp: 15 }
          ]
        }
      ]
    },
    {
      id: 1,
      title: "Woche 2",
      subtitle: "Prompts schreiben lernen",
      color: "#f59e0b",
      emoji: "✍️",
      goal: "Du schreibst strukturierte Prompts mit Rolle, Aufgabe, Format — und siehst den Unterschied.",
      days: [
        {
          tag: "Mo", name: "Schlechter vs. guter Prompt",
          tasks: [
            { id:"w1d0t0", txt: "Teste: einfacher vs. 4-Element-Prompt — vergleiche Qualität", time: "20 Min", type: "practice", xp: 15 },
            { id:"w1d0t1", txt: "Unterschied in 2 Sätzen notieren", time: "5 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Di", name: "Rolle zuweisen",
          tasks: [
            { id:"w1d1t0", txt: "Prompt bauen: 'Du bist mein Mathe-Tutor für das Abitur RLP...'", time: "15 Min", type: "practice", xp: 15 },
            { id:"w1d1t1", txt: "Selbes Thema mit 'Du bist ein Comedian' — was ändert sich?", time: "10 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "Mi", name: "Format steuern",
          tasks: [
            { id:"w1d2t0", txt: "4 Formatbefehle testen: Stichpunkte, Tabelle, Geschichte, 50 Wörter", time: "25 Min", type: "practice", xp: 15 },
            { id:"w1d2t1", txt: "Welches Format war am nützlichsten? Begründung notieren.", time: "5 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Do", name: "Kontext liefern",
          tasks: [
            { id:"w1d3t0", txt: "Prompt mit Kontext (Alter, Schule, Niveau) vs. ohne — vergleichen", time: "20 Min", type: "practice", xp: 15 },
            { id:"w1d3t1", txt: "Erkenne den Qualitätsunterschied — notiere warum er entsteht", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Fr", name: "4-Element-Prompt",
          tasks: [
            { id:"w1d4t0", txt: "Ersten vollständigen ROLLE+AUFGABE+KONTEXT+FORMAT Prompt schreiben", time: "20 Min", type: "challenge", xp: 30 },
            { id:"w1d4t1", txt: "Claude deinen Prompt bewerten und verbessern lassen", time: "10 Min", type: "practice", xp: 15 }
          ]
        },
        {
          tag: "Sa", name: "Prompt-Bibliothek",
          tasks: [
            { id:"w1d5t0", txt: "Top 5 Prompts der Woche in einer Notiz speichern", time: "15 Min", type: "reflect", xp: 15 },
            { id:"w1d5t1", txt: "Einen Prompt für ein Thema eines Mitschülers bauen", time: "15 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "So", name: "Wochenrückblick",
          tasks: [
            { id:"w1d6t0", txt: "Claude fragen: 'Erkläre Prompt Engineering als wäre ich Anfänger'", time: "15 Min", type: "practice", xp: 15 },
            { id:"w1d6t1", txt: "Wochenziel erreicht? Selbstbewertung 1–10 notieren", time: "5 Min", type: "reflect", xp: 15 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Woche 3",
      subtitle: "Claude tiefer verstehen",
      color: "#a78bfa",
      emoji: "🧠",
      goal: "Du nutzt fortgeschrittene Techniken und weißt wann Claude nützlich ist — und wann nicht.",
      days: [
        {
          tag: "Mo", name: "System Prompts",
          tasks: [
            { id:"w2d0t0", txt: "System Prompt bauen: 'Du bist ab jetzt mein Deutsch-Korrektor...'", time: "20 Min", type: "practice", xp: 15 },
            { id:"w2d0t1", txt: "Teste: Hält Claude die Rolle auch nach 10 Nachrichten noch?", time: "10 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "Di", name: "Chain-of-Thought",
          tasks: [
            { id:"w2d1t0", txt: "Mathe-Aufgabe ohne vs. mit 'Denk Schritt für Schritt'", time: "20 Min", type: "challenge", xp: 30 },
            { id:"w2d1t1", txt: "Wann ist CoT besonders hilfreich? Erkenne das Muster.", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Mi", name: "Schul-Workflow",
          tasks: [
            { id:"w2d2t0", txt: "Prompt-Workflow: Thema → Gliederung → schreiben → verbessern", time: "30 Min", type: "practice", xp: 15 },
            { id:"w2d2t1", txt: "Teste ihn mit einem echten Schulthema", time: "15 Min", type: "practice", xp: 15 }
          ]
        },
        {
          tag: "Do", name: "Grenzen kennen",
          tasks: [
            { id:"w2d3t0", txt: "Was verweigert Claude? 3 Grenzsituationen testen und verstehen", time: "20 Min", type: "challenge", xp: 30 },
            { id:"w2d3t1", txt: "Claudes Werte verstehen — warum gibt es sie?", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Fr", name: "Iteratives Prompting",
          tasks: [
            { id:"w2d4t0", txt: "Antwort in 3 Runden durch gezieltes Nachfragen verbessern", time: "25 Min", type: "practice", xp: 15 },
            { id:"w2d4t1", txt: "Erkenne: Ein Gespräch ist besser als ein Prompt", time: "5 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Sa", name: "Mini-Projekt",
          tasks: [
            { id:"w2d5t0", txt: "Erstelle etwas Nützliches: Lernplan, Bewerbungstext oder Kurzgeschichte", time: "30 Min", type: "challenge", xp: 30 },
            { id:"w2d5t1", txt: "Teile das Ergebnis mit jemandem — erkläre wie KI half", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "So", name: "Zwischenbilanz",
          tasks: [
            { id:"w2d6t0", txt: "Claude fragen: '5 Tipps die die meisten Anfänger nicht kennen'", time: "15 Min", type: "practice", xp: 15 },
            { id:"w2d6t1", txt: "3 größte Erkenntnisse der letzten 3 Wochen aufschreiben", time: "10 Min", type: "reflect", xp: 15 }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Woche 4",
      subtitle: "Anwendung & Abschluss",
      color: "#f87171",
      emoji: "🚀",
      goal: "Du hast echte Projekte abgeschlossen und weißt was du in Phase 2 lernen willst.",
      days: [
        {
          tag: "Mo", name: "Persönlicher Assistent",
          tasks: [
            { id:"w3d0t0", txt: "Persönlichen Schul-System-Prompt bauen der perfekt zu dir passt", time: "25 Min", type: "practice", xp: 15 },
            { id:"w3d0t1", txt: "Mit echten Hausaufgaben testen — wie viel Zeit sparst du?", time: "20 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "Di", name: "Kreatives Schreiben",
          tasks: [
            { id:"w3d1t0", txt: "Geschichte schreiben: Claude gibt Ideen → du wählst → gemeinsam schreiben", time: "30 Min", type: "challenge", xp: 30 },
            { id:"w3d1t1", txt: "Beobachten: Wie beeinflusst der Prompt den Schreibstil?", time: "5 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Mi", name: "Recherche & Faktencheck",
          tasks: [
            { id:"w3d2t0", txt: "Thema mit Claude als Recherche-Partner erkunden", time: "25 Min", type: "practice", xp: 15 },
            { id:"w3d2t1", txt: "2 Aussagen mit echter Quelle prüfen — stimmt alles?", time: "10 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "Do", name: "Dein bester Prompt",
          tasks: [
            { id:"w3d3t0", txt: "Den komplexesten, nützlichsten Prompt bisher schreiben", time: "25 Min", type: "challenge", xp: 30 },
            { id:"w3d3t1", txt: "Dokumentieren: Warum funktioniert er? Was macht ihn gut?", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Fr", name: "Phase 2 vorbereiten",
          tasks: [
            { id:"w3d4t0", txt: "Claude fragen: Was ist Prompt Engineering auf fortgeschrittenem Niveau?", time: "15 Min", type: "practice", xp: 15 },
            { id:"w3d4t1", txt: "3 Fragen aufschreiben die du in Phase 2 beantwortet haben willst", time: "10 Min", type: "reflect", xp: 15 }
          ]
        },
        {
          tag: "Sa", name: "Abschlussprojekt",
          tasks: [
            { id:"w3d5t0", txt: "Etwas Vorzeigbares bauen: Flyer, Businessidee, Lernplan, Drehbuch", time: "40 Min", type: "challenge", xp: 30 },
            { id:"w3d5t1", txt: "Jemandem zeigen und erklären wie KI dabei geholfen hat", time: "15 Min", type: "challenge", xp: 30 }
          ]
        },
        {
          tag: "So", name: "Phase 1 Abschluss",
          tasks: [
            { id:"w3d6t0", txt: "Brief an dich selbst in 6 Monaten schreiben: Was erwartest du?", time: "15 Min", type: "reflect", xp: 15 },
            { id:"w3d6t1", txt: "Phase-1-Quiz: Claude zu allen Themen der 4 Wochen prüfen lassen", time: "20 Min", type: "challenge", xp: 30 }
          ]
        }
      ]
    }
  ],

  quiz: [
    {
      id: "q0", week: 0,
      q: "Was ist ein 'Token' bei Claude?",
      opts: ["Eine Art Passwort", "Die kleinste Texteinheit die Claude verarbeitet", "Ein Fehler in der Antwort", "Eine Bezahlmethode"],
      correct: 1,
      exp: "Tokens sind die kleinsten Einheiten die Claude verarbeitet — ungefähr 1 Wort. Sie bestimmen auch den API-Preis."
    },
    {
      id: "q1", week: 0,
      q: "Was bedeutet 'Halluzination' bei KI?",
      opts: ["Claude macht Bilder", "Claude antwortet zu langsam", "Claude erfindet selbstsicher falsche Fakten", "Claude versteht die Frage nicht"],
      correct: 2,
      exp: "Halluzination = Claude erfindet Fakten und präsentiert sie überzeugend als wahr. Deshalb immer prüfen!"
    },
    {
      id: "q2", week: 0,
      q: "Was passiert mit dem Kontext wenn du einen neuen Chat öffnest?",
      opts: ["Er bleibt gespeichert", "Claude merkt sich alles", "Er verschwindet komplett", "Er wird in die Cloud geladen"],
      correct: 2,
      exp: "Claude hat kein dauerhaftes Gedächtnis. Jeder neue Chat startet bei null."
    },
    {
      id: "q3", week: 1,
      q: "Was ist ein 'System Prompt'?",
      opts: ["Ein sehr langer Prompt", "Eine Hintergrundinstruktion die Claudes Verhalten steuert", "Eine Fehlermeldung", "Der erste Prompt im Chat"],
      correct: 1,
      exp: "Der System Prompt steht vor dem Gespräch und definiert Claudes Charakter und Rolle — sehr mächtig!"
    },
    {
      id: "q4", week: 1,
      q: "Welches Element ist 'Du bist ein erfahrener Biologielehrer'?",
      opts: ["Format", "Kontext", "Rolle", "Einschränkung"],
      correct: 2,
      exp: "Das ist die ROLLE. Sie definiert wer Claude in diesem Gespräch sein soll und beeinflusst Ton und Tiefe."
    },
    {
      id: "q5", week: 1,
      q: "Was ist 'Few-Shot' Prompting?",
      opts: ["Sehr kurze Prompts", "Claude Beispiele geben damit er den Stil lernt", "Claude nur wenig fragen", "Schnell promoten"],
      correct: 1,
      exp: "Few-Shot = Claude einige Beispiele geben. Er erkennt das Muster und antwortet in deinem gewünschten Stil."
    },
    {
      id: "q6", week: 2,
      q: "Was ist 'Chain-of-Thought' Prompting?",
      opts: ["Mehrere Prompts kopieren", "Claude bitten Schritt für Schritt zu denken", "Einen langen Prompt schreiben", "Claude auf Englisch ansprechen"],
      correct: 1,
      exp: "CoT = Claude explizit bitten seinen Denkprozess Schritt für Schritt zu zeigen. Reduziert Fehler drastisch."
    },
    {
      id: "q7", week: 2,
      q: "Warum sollte man Claude-Antworten auf Fakten prüfen?",
      opts: ["Claude denkt auf Englisch", "Claude halluziniert manchmal und erfindet falsche Infos", "Claude ist langsam", "Claude hat kein Internet"],
      correct: 1,
      exp: "Claude kann halluzinieren — er erfindet manchmal falsche Fakten sehr überzeugend. Wichtige Infos immer prüfen!"
    }
  ],

  blitzQuestions: [
    { id:"bq0",  q:"Was bedeutet LLM?", opts:["Large Language Model","Long Learning Machine","Language Limit Module","Large Logic Memory"], correct:0, exp:"LLM = Large Language Model. Große Sprachmodelle lernen Textmuster aus riesigen Datensätzen." },
    { id:"bq1",  q:"Wie viele Token entspricht ungefähr einem normalen Wort?", opts:["0,1 Token","1–2 Token","10 Token","100 Token"], correct:1, exp:"Im Schnitt entspricht 1 Wort etwa 1–2 Token. Das Kontextfenster ist in Token gemessen." },
    { id:"bq2",  q:"Was ist das 'Kontextfenster' eines LLMs?", opts:["Die max. Anzahl von Chats","Die max. Textmenge die das Modell gleichzeitig lesen kann","Claudes Bildschirmgröße","Die Zahl der Parameter"], correct:1, exp:"Das Kontextfenster ist Claudes 'Arbeitsgedächtnis' — wie viel Text er gleichzeitig verarbeiten kann." },
    { id:"bq3",  q:"Was lernt ein LLM während des Trainings?", opts:["Regeln aus einem Lehrbuch","Textmuster aus riesigen Datensätzen","Bilder und Videos","Persönliche Daten des Nutzers"], correct:1, exp:"LLMs lernen statistische Textmuster — welche Wörter in welchen Kontexten aufeinander folgen." },
    { id:"bq4",  q:"Was passiert wenn du Claude eine klare Rolle gibst?", opts:["Die Antwort wird länger","Antworten werden fachspezifischer","Claude antwortet auf Englisch","Nichts ändert sich"], correct:1, exp:"'Du bist ein Biologielehrer' fokussiert Claudes Antworten — Ton, Tiefe und Fachbegriffe passen sich an." },
    { id:"bq5",  q:"Was ist 'Zero-Shot' Prompting?", opts:["Claude ohne Netz nutzen","Aufgabe ohne Beispiele geben","Ein leerer Prompt","Claude auf 0 Antworten beschränken"], correct:1, exp:"Zero-Shot = Claude direkt eine Aufgabe geben, ohne Beispiele. Er schöpft rein aus dem Training." },
    { id:"bq6",  q:"Warum ist ein klares Format im Prompt wichtig?", opts:["Sieht professioneller aus","Claude versteht nur strukturierten Text","Steuert direkt wie die Antwort aussieht","Pflicht bei Claude"], correct:2, exp:"'Antworte als Stichpunkte' oder 'max. 100 Wörter' steuern die Ausgabe — spart Nacharbeit." },
    { id:"bq7",  q:"Was ist 'Iteratives Prompting'?", opts:["Selben Prompt 3x schicken","Antworten durch Folgefragen schrittweise verbessern","Sehr kurze Prompts","Prompts automatisch generieren"], correct:1, exp:"Ein Gespräch ist mächtiger als ein Prompt. Schritt für Schritt die Antwort präzisieren = iteratives Prompting." },
    { id:"bq8",  q:"Was bedeutet 'Temperature' bei einem LLM?", opts:["Prozessortemperatur","Wie kreativ/zufällig die Antworten sind","Länge der Antwort","Sprache der Ausgabe"], correct:1, exp:"Hohe Temperature = kreativere Antworten. Niedrige Temperature = konservativere, faktentreuere Antworten." },
    { id:"bq9",  q:"Was ist 'Constitutional AI' bei Anthropic?", opts:["KI für Jura-Studenten","Trainingsverfahren mit Prinzipien für sicheres KI-Verhalten","Claudes Betriebssystem","Programmiermethode"], correct:1, exp:"Constitutional AI: Claude lernt anhand eines 'Grundgesetzes' was hilfreich, harmlos und ehrlich ist." },
    { id:"bq10", q:"Warum verweigert Claude manchmal Anfragen?", opts:["Technischer Fehler","Grenzen für schädliche oder ethisch problematische Inhalte","Zu wenig Kontext","Falsches Format"], correct:1, exp:"Claude hat Werte: er verweigert Anfragen die schaden könnten. Das ist Absicht, kein Bug." },
    { id:"bq11", q:"Kann Claude standardmäßig auf das Internet zugreifen?", opts:["Ja, immer","Nein, nicht standardmäßig","Nur in der App","Nur auf Englisch"], correct:1, exp:"Standard-Claude hat keinen Internetzugang. In manchen Versionen gibt es optionale Web-Tools." },
    { id:"bq12", q:"Was ist 'RLHF'?", opts:["Reinforcement Learning from Human Feedback","Random Language Hallucination Filter","Real-time Language Handling","Recursive Logic Framework"], correct:0, exp:"RLHF = Reinforcement Learning from Human Feedback. Menschen bewerten KI-Antworten, die KI lernt daraus." },
    { id:"bq13", q:"Wie erkennst du am besten eine KI-Halluzination?", opts:["Sehr lange Antwort","Antwort klingt selbstsicher — Fakten sind aber prüfbar falsch","Claude antwortet auf Englisch","Viele Emojis"], correct:1, exp:"Halluzinationen klingen überzeugend. Immer bei wichtigen Fakten mit echten Quellen gegenchecken!" },
    { id:"bq14", q:"Warum halluziniert Claude manchmal?", opts:["Schlechte Verbindung","Modell generiert wahrscheinliche Textfortsetzungen, nicht 'die Wahrheit'","Claude ist müde","Zu kurzer Prompt"], correct:1, exp:"LLMs generieren Text der 'wahrscheinlich klingt' — nicht Text der faktisch korrekt ist." },
    { id:"bq15", q:"Bei welchen Aufgaben ist Claude am zuverlässigsten?", opts:["Aktuellen Sportergebnissen","Mathematik immer","Textzusammenfassungen, Erklärungen & Überarbeiten","Börsenkursen"], correct:2, exp:"Sprach-intensive Aufgaben sind Claudes Stärke. Aktuelle Fakten immer prüfen." },
    { id:"bq16", q:"Was solltest du tun wenn Claude eine wichtige Aussage macht?", opts:["Direkt weiterleiten","Fakten mit echten Quellen prüfen","Claude nach Quelle fragen — reicht immer","Nichts — Claude ist zuverlässig"], correct:1, exp:"Claudes Quellenangaben können halluziniert sein. Echte Quellen selbst suchen ist Pflicht." },
    { id:"bq17", q:"Was bedeutet 'KI-Bias'?", opts:["Computervirus in KI","Verzerrungen durch einseitige Trainingsdaten","Claudes Lieblingsthema","Bewertungssystem"], correct:1, exp:"Einseitige Trainingsdaten → einseitige KI-Antworten. Deshalb ist Datendiversität so wichtig." },
    { id:"bq18", q:"Was ist das größte Risiko von KI-Texten in der Schule?", opts:["Texte sind zu lang","Blinde Übernahme ohne kritisches Prüfen","Schlechte Grammatik","Zu viele Fremdwörter"], correct:1, exp:"Das Hauptrisiko: KI-Texte unkritisch übernehmen. KI kann falsch liegen — eigenes Denken bleibt unersetzlich." },
    { id:"bq19", q:"Was ist 'Prompt Injection'?", opts:["Prompts in Code einbauen","Versteckte Instruktionen die KI-Verhalten manipulieren","Sehr langen Prompt schreiben","Sprache wechseln"], correct:1, exp:"Prompt Injection: Angreifer verstecken Instruktionen in Texten die Claude liest, um es zu manipulieren." },
    { id:"bq20", q:"Was ist ein guter erster Schritt beim Schreiben eines Prompts?", opts:["Direkt fragen","Das Ziel klar definieren: Was soll Claude konkret leisten?","Möglichst kurz schreiben","Auf Englisch wechseln"], correct:1, exp:"Klares Ziel = besserer Prompt. Was genau soll die Ausgabe sein? Wer ist die Zielgruppe? Welches Format?" },
    { id:"bq21", q:"Wie nutzt du Claude am besten als Lernpartner?", opts:["Claude macht alle Aufgaben","Erkläre mir das Konzept, teste mich — hinterfrage die Antworten","Nur für Übersetzungen","Auswendig lernen was Claude sagt"], correct:1, exp:"Claude erklärt → du erklärst zurück → Claude testet dich → Fehler analysieren. Das ist echter Lernerfolg." },
    { id:"bq22", q:"Was ist 'Prompt Chaining'?", opts:["Prompts kopieren","Komplexe Aufgaben in aufbauende Schritte aufteilen","Mehrere Modelle nutzen","Prompts in Cloud speichern"], correct:1, exp:"Prompt Chaining: Komplexe Aufgabe in Schritte zerlegen, bei denen jeder Output der nächste Input wird." },
    { id:"bq23", q:"Wofür ist Claude besonders NICHT geeignet?", opts:["Texte überarbeiten","Live-Aktienkurse abfragen","Ideen brainstormen","Lernstoff erklären"], correct:1, exp:"Claude kennt keine Echtzeit-Daten. Für Kurse, Nachrichten, Sportergebnisse andere Tools nutzen." },
    { id:"bq24", q:"Was sind 'Embeddings' bei LLMs?", opts:["Bilder im Modell","Mathematische Vektoren die Bedeutung von Text kodieren","Fehler im Modell","Eingabe-Shortcuts"], correct:1, exp:"Embeddings übersetzen Wörter in Zahlen-Vektoren. Ähnliche Bedeutungen = ähnliche Vektoren. Basis jedes LLMs." },
    { id:"bq25", q:"Was ist 'Fine-Tuning'?", opts:["Prompts verfeinern","Vortrainiertes Modell auf spezifischem Datensatz weitertrainieren","Antworten manuell korrigieren","Temperature anpassen"], correct:1, exp:"Fine-Tuning spezialisiert ein allgemeines Modell auf eine Domain durch weiteres Training." },
    { id:"bq26", q:"Was bedeutet 'Multimodal' bei KI?", opts:["Mehrere Sprachen","KI verarbeitet Text UND Bilder (und mehr)","Mehrere Modelle parallel","Mehrkanal-Support"], correct:1, exp:"Multimodal = Text + Bilder + Audio. Claude kann z.B. Bilder analysieren und darüber diskutieren." },
    { id:"bq27", q:"Was bedeutet 'Open Source' im KI-Kontext?", opts:["KI ist kostenlos","Code/Modellgewichte sind öffentlich zugänglich","KI läuft im Browser","Kein Datenschutz-Problem"], correct:1, exp:"Open-Source-Modelle (z.B. Llama) legen Code/Gewichte offen — jeder kann sie lokal betreiben oder anpassen." },
    { id:"bq28", q:"Was passiert wenn du Claude sagst 'Denk Schritt für Schritt'?", opts:["Claude spricht laut","Claude zeigt seinen Denkprozess — reduziert Fehler","Claude antwortet schneller","Claude antwortet kürzer"], correct:1, exp:"'Schritt für Schritt' aktiviert Chain-of-Thought — Claude macht weniger Fehler bei komplexen Aufgaben." },
    { id:"bq29", q:"Wie testest du ob ein Prompt wirklich gut ist?", opts:["Wenn die Antwort lang ist","Verschiedene Variationen liefern konsistent gute Antworten","Wenn Claude 'perfekt' schreibt","Wenn Claude keine Fragen stellt"], correct:1, exp:"Robuste Prompts liefern konsistent gute Antworten auch bei kleinen Variationen. Immer mehrfach testen." },
    { id:"bq30", q:"Was ist 'Grounding' bei KI?", opts:["KI auf den Boden stellen","KI-Antworten an prüfbare Quellen oder Fakten ankern","Basis-Temperature","Modell neu starten"], correct:1, exp:"Grounding = KI an echte Dokumente ankern. Reduziert Halluzinationen massiv." },
    { id:"bq31", q:"Was bedeutet ein Kontextfenster von 200.000 Token?", opts:["Max. 200.000 Antworten/Tag","Claude kann ~150.000 Wörter gleichzeitig verarbeiten","200.000 Nutzerstunden","200.000 Trainings-Datensätze"], correct:1, exp:"200k Token ≈ 150.000 Wörter — das entspricht einem mittelgroßen Roman den Claude auf einmal halten kann." },
    { id:"bq32", q:"Welche Aussage über Claudes Gedächtnis stimmt?", opts:["Merkt sich alles chat-übergreifend","Kein permanentes Gedächtnis zwischen Chats","Speichert Daten in der Cloud","Merkt sich Namen dauerhaft"], correct:1, exp:"Jeder neue Chat startet bei null. Claudes Gedächtnis existiert nur innerhalb eines Gesprächs." },
    { id:"bq33", q:"Was ist der Unterschied zwischen Training und Inference?", opts:["Training ist schneller","Training = Modell lernt; Inference = Modell antwortet","Training ist teurer für User","Kein Unterschied"], correct:1, exp:"Training: Modell lernt aus Daten (einmalig, sehr teuer). Inference: Modell antwortet auf deine Fragen." },
    { id:"bq34", q:"Was ist 'Few-Shot Prompting'?", opts:["Sehr kurze Prompts","Claude Beispiele geben damit er den Stil versteht","Claude wenig fragen","Schnelles Prompting"], correct:1, exp:"Few-Shot = Claude einige Beispiele zeigen. Er erkennt das Muster und antwortet in deinem Stil." },
    { id:"bq35", q:"Was ist 'Prompt Engineering'?", opts:["KI-Programmierung auf Hardware-Ebene","Die Kunst Eingaben so zu formulieren dass KI optimale Outputs liefert","Prompts in Code umwandeln","Automatisiertes Testen"], correct:1, exp:"Prompt Engineering ist eine Kernkompetenz: durch präzise Formulierungen das Beste aus LLMs herausholen." },
    { id:"bq36", q:"Wann wurde Claude von Anthropic veröffentlicht?", opts:["2019","2021","2023","2025"], correct:2, exp:"Claude wurde 2023 erstmals öffentlich zugänglich gemacht." },
    { id:"bq37", q:"Was ist KI-Transparency?", opts:["KI soll hübscher aussehen","Nutzer sollen verstehen wie KI-Entscheidungen entstehen","Mehr Werbung zeigen","Schnellere Antworten"], correct:1, exp:"Wenn KI Entscheidungen trifft, müssen Menschen verstehen können warum — Rechenschaftspflicht ist entscheidend." },
    { id:"bq38", q:"Welches Format zwingt Claude am meisten zur Struktur?", opts:["Stichpunkte","Freitext","Tabelle mit definierten Spalten","Emoji-Liste"], correct:2, exp:"Tabellen mit definierten Spalten zwingen Claude zu sehr strukturierten, vergleichbaren Antworten." },
    { id:"bq39", q:"Was ist der beste Weg um Claude für die Schule zu nutzen?", opts:["Claude schreibt, du gibst ab","Claude erklärt → du verstehst → du schreibst selbst","Nur zum Rechtschreib-Check","Claude auf Prüfungen nutzen"], correct:1, exp:"KI als Lernverstärker, nicht als Ersatz. Claude erklärt, du verstehst und formulierst selbst — echter Lernerfolg." }
  ]
};
