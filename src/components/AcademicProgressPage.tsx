"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  academicGoalsStorageKey,
  defaultAcademicGoals,
  getAverageTotal,
  getSubjectMeta,
  getTestTotal,
  schoolSubjects,
  sortTestResults,
  starterTestResults,
  testResultsStorageKey,
  type AcademicGoalRecord,
  type SchoolSubjectId,
  type TestResultRecord
} from "@/data/academicProgress";

type DraftScores = Record<SchoolSubjectId, string>;

const blankScores: DraftScores = {
  japanese: "",
  social: "",
  math: "",
  science: "",
  english: ""
};

const blankAverages: DraftScores = {
  japanese: "",
  social: "",
  math: "",
  science: "",
  english: ""
};

export function AcademicProgressPage() {
  const [records, setRecords] = useState<TestResultRecord[]>(starterTestResults);
  const [goals, setGoals] = useState<AcademicGoalRecord>(defaultAcademicGoals);
  const [testName, setTestName] = useState("Next Periodic Test");
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [rank, setRank] = useState("");
  const [studentCount, setStudentCount] = useState("150");
  const [scores, setScores] = useState<DraftScores>(blankScores);
  const [averages, setAverages] = useState<DraftScores>(blankAverages);

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(testResultsStorageKey);
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords) as TestResultRecord[]);
      } catch {
        setRecords(starterTestResults);
      }
    }

    const savedGoals = window.localStorage.getItem(academicGoalsStorageKey);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals) as AcademicGoalRecord);
      } catch {
        setGoals(defaultAcademicGoals);
      }
    }
  }, []);

  const sortedRecords = useMemo(() => sortTestResults(records), [records]);
  const latest = sortedRecords[sortedRecords.length - 1] ?? starterTestResults[0];
  const previous = sortedRecords[sortedRecords.length - 2] ?? null;
  const latestTotal = getTestTotal(latest);
  const previousTotal = previous ? getTestTotal(previous) : null;
  const averageTotal = getAverageTotal(latest);
  const strongestSubject = [...latest.subjects].sort((a, b) => b.score - a.score)[0];
  const prioritySubject = [...latest.subjects].sort((a, b) => {
    const goalGapA = goals.subjectGoals[a.subject] - a.score;
    const goalGapB = goals.subjectGoals[b.subject] - b.score;
    return goalGapB - goalGapA;
  })[0];

  function saveRecords(next: TestResultRecord[]) {
    setRecords(next);
    window.localStorage.setItem(testResultsStorageKey, JSON.stringify(next));
  }

  function saveGoals(next: AcademicGoalRecord) {
    setGoals(next);
    window.localStorage.setItem(academicGoalsStorageKey, JSON.stringify(next));
  }

  function updateGoalSubject(subject: SchoolSubjectId, value: string) {
    const next: AcademicGoalRecord = {
      ...goals,
      subjectGoals: { ...goals.subjectGoals, [subject]: Number(value || 0) },
      updatedAt: new Date().toISOString()
    };
    saveGoals(next);
  }

  function addResult() {
    const now = new Date().toISOString();
    const nextRecord: TestResultRecord = {
      id: `test-leo-${testDate}-${Date.now()}`,
      studentId: "leo",
      schoolYear: String(new Date(testDate).getFullYear()),
      term: "Term",
      testName: testName.trim() || "Periodic Test",
      testDate,
      rank: rank ? Number(rank) : null,
      studentCount: studentCount ? Number(studentCount) : null,
      subjects: schoolSubjects.map((subject) => ({
        subject: subject.id,
        score: Number(scores[subject.id] || 0),
        average: averages[subject.id] ? Number(averages[subject.id]) : null,
        maxScore: 100
      })),
      notes: "",
      createdAt: now,
      updatedAt: now
    };

    saveRecords(sortTestResults([...records, nextRecord]));
    setTestName("Next Periodic Test");
    setRank("");
    setScores(blankScores);
    setAverages(blankAverages);
  }

  function removeResult(id: string) {
    saveRecords(records.filter((record) => record.id !== id));
  }

  return (
    <section className="academic-progress-page">
      <header className="teacher-hero academic-progress-hero">
        <span className="eyebrow">Neritan Progress</span>
        <h1>Academic Progress</h1>
        <p>Track Leo&apos;s school test results across every subject, compare them with goals, and keep the record shape ready for Supabase.</p>
      </header>

      <section className="progress-stat-grid" aria-label="Latest academic stats">
        <ProgressStat label="Latest Total" value={`${latestTotal} / 500`} detail={previousTotal === null ? "First saved result" : `${formatDelta(latestTotal - previousTotal)} from previous`} tone="blue" />
        <ProgressStat label="Rank" value={latest.rank ? `${latest.rank} / ${latest.studentCount ?? goals.studentCount}` : "Not set"} detail={latest.rank && goals.rank ? `${Math.max(0, latest.rank - goals.rank)} places from goal` : "Add rank when known"} tone="green" />
        <ProgressStat label="Strongest" value={getSubjectMeta(strongestSubject.subject).label} detail={`${strongestSubject.score} / ${strongestSubject.maxScore}`} tone="purple" />
        <ProgressStat label="Focus Next" value={getSubjectMeta(prioritySubject.subject).label} detail={`${Math.max(0, goals.subjectGoals[prioritySubject.subject] - prioritySubject.score)} points to goal`} tone="orange" />
      </section>

      <div className="progress-grid">
        <section className="progress-panel progress-panel-wide">
          <div className="teacher-section-head">
            <h2>Latest Subject Scores</h2>
            <p className="review-muted">Bars compare Leo&apos;s score with the school average when an average is available.</p>
          </div>
          <div className="subject-score-list">
            {latest.subjects.map((subject) => {
              const meta = getSubjectMeta(subject.subject);
              return (
                <div className="subject-score-row" key={subject.subject}>
                  <div>
                    <strong>{meta.label}</strong>
                    <span>{subject.average === null ? "No average yet" : `Average ${subject.average}`}</span>
                  </div>
                  <div className="subject-bars">
                    <span className="subject-bar leo" style={{ "--subject-color": meta.color, width: `${subject.score}%` } as CSSProperties} />
                    {subject.average !== null ? <span className="subject-bar average" style={{ width: `${subject.average}%` }} /> : null}
                  </div>
                  <strong>{subject.score}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="progress-panel">
          <div className="teacher-section-head">
            <h2>Goals</h2>
            <p className="review-muted">Local first now, Supabase rows later.</p>
          </div>
          <div className="goal-edit-grid">
            <label>
              Total
              <input type="number" value={goals.totalScore} onChange={(event) => saveGoals({ ...goals, totalScore: Number(event.target.value || 0), updatedAt: new Date().toISOString() })} />
            </label>
            <label>
              Rank
              <input type="number" value={goals.rank} onChange={(event) => saveGoals({ ...goals, rank: Number(event.target.value || 0), updatedAt: new Date().toISOString() })} />
            </label>
            {schoolSubjects.map((subject) => (
              <label key={subject.id}>
                {subject.label}
                <input type="number" value={goals.subjectGoals[subject.id]} onChange={(event) => updateGoalSubject(subject.id, event.target.value)} />
              </label>
            ))}
          </div>
        </section>
      </div>

      <section className="progress-panel">
        <div className="teacher-section-head">
          <h2>Add Test Result</h2>
          <p className="review-muted">Scores are out of 100 per subject. This keeps the same five-subject shape as the prototype tracker.</p>
        </div>
        <div className="test-form-grid">
          <label>
            Test name
            <input value={testName} onChange={(event) => setTestName(event.target.value)} />
          </label>
          <label>
            Date
            <input type="date" value={testDate} onChange={(event) => setTestDate(event.target.value)} />
          </label>
          <label>
            Rank
            <input type="number" value={rank} onChange={(event) => setRank(event.target.value)} />
          </label>
          <label>
            Students
            <input type="number" value={studentCount} onChange={(event) => setStudentCount(event.target.value)} />
          </label>
          {schoolSubjects.map((subject) => (
            <label key={`${subject.id}-score`}>
              {subject.label}
              <input type="number" min="0" max="100" value={scores[subject.id]} onChange={(event) => setScores({ ...scores, [subject.id]: event.target.value })} />
            </label>
          ))}
          {schoolSubjects.map((subject) => (
            <label key={`${subject.id}-average`}>
              {subject.label} average
              <input type="number" min="0" max="100" step="0.1" value={averages[subject.id]} onChange={(event) => setAverages({ ...averages, [subject.id]: event.target.value })} />
            </label>
          ))}
        </div>
        <button className="teacher-open-button progress-save-button" onClick={addResult} type="button">
          Save Result
        </button>
      </section>

      <section className="progress-panel">
        <div className="teacher-section-head">
          <h2>History</h2>
          <p className="review-muted">Each row is a future `test_results` record for Leo.</p>
        </div>
        <div className="progress-table-wrap">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Date</th>
                <th>Total</th>
                <th>Average</th>
                <th>Rank</th>
                {schoolSubjects.map((subject) => (
                  <th key={subject.id}>{subject.shortLabel}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.testName}</td>
                  <td>{record.testDate}</td>
                  <td>{getTestTotal(record)}</td>
                  <td>{getAverageTotal(record) ?? "-"}</td>
                  <td>{record.rank ? `${record.rank} / ${record.studentCount ?? goals.studentCount}` : "-"}</td>
                  {schoolSubjects.map((subject) => (
                    <td key={`${record.id}-${subject.id}`}>{record.subjects.find((item) => item.subject === subject.id)?.score ?? "-"}</td>
                  ))}
                  <td>
                    <button className="teacher-done-button ghost" onClick={() => removeResult(record.id)} type="button">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function ProgressStat({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "blue" | "green" | "purple" | "orange" }) {
  return (
    <div className={`progress-stat progress-stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function formatDelta(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}
