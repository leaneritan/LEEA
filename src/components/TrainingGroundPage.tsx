const sessions = [
  {
    number: "07",
    title: "Nouns",
    focus: "Countable & uncountable",
    tag: "Grammar",
    score: "100%",
    status: "Done"
  },
  {
    number: "08",
    title: "Punctuation",
    focus: "Commas, periods & capital letters",
    tag: "Writing",
    score: "90%",
    status: "Done"
  },
  {
    number: "09",
    title: "Subject & Object",
    focus: "Who is doing what to whom?",
    tag: "Grammar",
    status: "Up next",
    active: true
  },
  {
    number: "10",
    title: "Articles",
    focus: "a, an & the",
    tag: "Grammar",
    status: "Start"
  },
  {
    number: "11",
    title: "Word order",
    focus: "Subject — verb — object",
    tag: "Grammar",
    status: "Start"
  }
];

export function TrainingGroundPage() {
  return (
    <section className="tg-page">
      <section className="tg-hero">
        <div>
          <div className="tg-brand">
            <b>TG</b>
            <span>Training Ground</span>
          </div>
          <h1>
            Ready to train,
            <br />
            Leo?
          </h1>
          <p>
            Short sessions to fix the tricky bits. Win your weak spots, one drill at a time.
          </p>
          <div className="tg-last-five" aria-label="Last five sessions">
            <span>Last 5</span>
            <i />
            <i />
            <i />
            <i className="muted" />
            <i />
          </div>
        </div>

        <aside>
          <span>Next session</span>
          <b>09</b>
          <strong>Subject & Object</strong>
          <small>Who is doing what to whom?</small>
          <button type="button">Kick off →</button>
        </aside>
      </section>

      <div className="tg-stats">
        <div>
          <span>Sessions done</span>
          <strong>14</strong>
        </div>
        <div>
          <span>Avg accuracy</span>
          <strong>88%</strong>
        </div>
        <div className="tg-stat-dark">
          <span>This week</span>
          <strong>2 played</strong>
        </div>
      </div>

      <section className="tg-session-list">
        <header>
          <h2>Your sessions</h2>
          <button type="button">+ New session</button>
        </header>

        {sessions.map((session) => (
          <article key={session.number} className={session.active ? "active" : ""}>
            <b>{session.number}</b>
            <div>
              <h3>{session.title}</h3>
              <span>{session.tag}</span>
              <p>{session.focus}</p>
            </div>
            <div className="tg-session-actions">
              {session.score && <strong>{session.score}</strong>}
              {session.status === "Done" ? <span>✓ Done</span> : <em>{session.status}</em>}
              {session.status !== "Done" && <button type="button">Start</button>}
            </div>
          </article>
        ))}

        <article className="tg-new-session">
          <b>+</b>
          <div>
            <h3>New training session</h3>
            <p>Neritan builds a drill for whatever Leo finds tricky.</p>
          </div>
        </article>
      </section>
    </section>
  );
}
