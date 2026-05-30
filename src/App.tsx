import { useEffect, useMemo, useState } from "react";
import ScoreBar from "./components/ScoreBar";
import StatsDashboard from "./components/StatsDashboard";
import { answerOptions, questions, type Question } from "./data/questions";
import { createQuestionSet } from "./lib/random";
import {
  calculateDiagnosis,
  isCompleteAnswers,
  type Answers,
  type AnswerValue,
  type DiagnosisResult,
} from "./lib/scoring";
import {
  appendResultRecord,
  clearResultRecords,
  getResultsStorageMode,
  readResultRecords,
  type ResultRecord,
} from "./lib/storage";

type Screen = "home" | "quiz" | "result" | "stats";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [questionSet, setQuestionSet] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [records, setRecords] = useState<ResultRecord[]>([]);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const storageMode = getResultsStorageMode();

  const currentQuestion = questionSet[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = questionSet.filter((question) => answers[question.id] !== undefined).length;
  const progressPercent = questionSet.length === 0 ? 0 : Math.round((answeredCount / questionSet.length) * 100);
  const answerSummary = useMemo(
    () => questionSet.map((question) => answers[question.id] ?? null),
    [answers, questionSet],
  );

  useEffect(() => {
    void refreshRecords();
  }, []);

  const refreshRecords = async () => {
    setRecords(await readResultRecords());
  };

  const startQuiz = () => {
    setQuestionSet(createQuestionSet(questions));
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setScreen("quiz");
  };

  const showStats = async () => {
    await refreshRecords();
    setScreen("stats");
  };

  const selectAnswer = (value: AnswerValue) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  const goBack = () => {
    if (currentIndex === 0) {
      setScreen("home");
      return;
    }

    setCurrentIndex((index) => index - 1);
  };

  const goNext = () => {
    if (currentAnswer === undefined) {
      return;
    }

    if (currentIndex < questionSet.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    void showResult();
  };

  const showResult = async () => {
    if (!isCompleteAnswers(questionSet, answers)) {
      return;
    }

    setIsSavingResult(true);
    const nextResult = calculateDiagnosis(questionSet, answers);
    const nextRecords = await appendResultRecord(nextResult);

    setResult(nextResult);
    setRecords(nextRecords);
    setScreen("result");
    setIsSavingResult(false);
  };

  const clearStats = () => {
    clearResultRecords();
    setRecords([]);
  };

  return (
    <main className="app-shell">
      {screen === "home" && (
        <HomeScreen recordCount={records.length} storageMode={storageMode} onStart={startQuiz} onStats={showStats} />
      )}

      {screen === "quiz" && currentQuestion && (
        <QuizScreen
          answerSummary={answerSummary}
          answeredCount={answeredCount}
          currentAnswer={currentAnswer}
          currentIndex={currentIndex}
          currentQuestion={currentQuestion}
          onBack={goBack}
          isSavingResult={isSavingResult}
          onNext={goNext}
          onSelectAnswer={selectAnswer}
          progressPercent={progressPercent}
          questionCount={questionSet.length}
        />
      )}

      {screen === "result" && result && (
        <ResultScreen result={result} onHome={() => setScreen("home")} onRestart={startQuiz} onStats={showStats} />
      )}

      {screen === "stats" && (
        <StatsDashboard records={records} storageMode={storageMode} onClear={clearStats} onHome={() => setScreen("home")} />
      )}
    </main>
  );
}

type HomeScreenProps = {
  onStart: () => void;
  onStats: () => void;
  recordCount: number;
  storageMode: "shared" | "local";
};

function HomeScreen({ onStart, onStats, recordCount, storageMode }: HomeScreenProps) {
  const isShared = storageMode === "shared";

  return (
    <section className="home-screen" aria-labelledby="app-title">
      <div className="hero-copy">
        <p className="eyebrow">Academic AI Orientation Index</p>
        <h1 id="app-title">アカデミックAI急進度診断</h1>
        <p className="subtitle">あなたの研究OSはどれくらいAI-nativeか？</p>
        <p className="intro-text">
          この診断は、AI時代の研究スタイルに対するあなたの立場を、4つの軸と0〜100点のAI急進度スコアで可視化します。正式な心理診断ではなく、自己理解や議論のきっかけとしてお使いください。
        </p>
        <p className="privacy-note">
          また、診断結果は個人情報を含まない形で
          {isShared ? "共有集計用の保存先に送信され、" : "このブラウザ内に"}
          最新100件まで集計されます。名前、メールアドレス、所属、年齢、性別、IPアドレス、回答本文、個別回答、質問ID、質問文は保存しません。
        </p>
        <div className="home-actions">
          <button className="primary-button" type="button" onClick={onStart}>
            診断を始める
          </button>
          <button className="secondary-button" type="button" onClick={onStats}>
            統計を見る
          </button>
        </div>
      </div>

      <aside className="overview-panel" aria-label="診断の概要">
        <div>
          <span className="overview-number">50</span>
          <p>質問プール</p>
        </div>
        <div>
          <span className="overview-number">20</span>
          <p>診断ごとに抽出</p>
        </div>
        <div>
          <span className="overview-number">4</span>
          <p>研究スタイル軸</p>
        </div>
        <div>
          <span className="overview-number">{recordCount}</span>
          <p>{isShared ? "共有集計結果" : "保存済み結果"}</p>
        </div>
      </aside>
    </section>
  );
}

type QuizScreenProps = {
  answerSummary: Array<AnswerValue | null>;
  answeredCount: number;
  currentAnswer?: AnswerValue;
  currentIndex: number;
  currentQuestion: Question;
  isSavingResult: boolean;
  onBack: () => void;
  onNext: () => void;
  onSelectAnswer: (value: AnswerValue) => void;
  progressPercent: number;
  questionCount: number;
};

function QuizScreen({
  answerSummary,
  answeredCount,
  currentAnswer,
  currentIndex,
  currentQuestion,
  isSavingResult,
  onBack,
  onNext,
  onSelectAnswer,
  progressPercent,
  questionCount,
}: QuizScreenProps) {
  const isLastQuestion = currentIndex === questionCount - 1;

  return (
    <section className="quiz-screen" aria-labelledby="question-title">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Question</p>
          <h2 id="question-title">
            {currentIndex + 1} / {questionCount}
          </h2>
        </div>
        <p className="answered-count">{answeredCount}問回答済み</p>
      </header>

      <ScoreBar value={progressPercent} />

      <article className="question-panel">
        <p className="axis-tag">{currentQuestion.axis}軸</p>
        <h3>{currentQuestion.text}</h3>
        <div className="answer-grid" role="radiogroup" aria-label="回答を選択">
          {answerOptions.map((option) => (
            <button
              aria-checked={currentAnswer === option.value}
              className={currentAnswer === option.value ? "answer-option is-selected" : "answer-option"}
              key={option.value}
              onClick={() => onSelectAnswer(option.value)}
              role="radio"
              type="button"
            >
              <span>{option.value}</span>
              {option.label}
            </button>
          ))}
        </div>
      </article>

      <div className="question-dots" aria-label="回答状況">
        {answerSummary.map((answer, index) => (
          <span
            className={[
              "question-dot",
              index === currentIndex ? "is-current" : "",
              answer !== null ? "is-answered" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={`${index}-${answer ?? "empty"}`}
          />
        ))}
      </div>

      <footer className="navigation-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          戻る
        </button>
        <button className="primary-button" disabled={currentAnswer === undefined || isSavingResult} type="button" onClick={onNext}>
          {isLastQuestion ? (isSavingResult ? "保存中..." : "結果を見る") : "次へ"}
        </button>
      </footer>
    </section>
  );
}

type ResultScreenProps = {
  result: DiagnosisResult;
  onHome: () => void;
  onRestart: () => void;
  onStats: () => void;
};

function ResultScreen({ result, onHome, onRestart, onStats }: ResultScreenProps) {
  return (
    <section className="result-screen" aria-labelledby="result-title">
      <header className="result-hero">
        <div>
          <p className="eyebrow">Result</p>
          <h2 id="result-title">{result.typeCode}型</h2>
          <p className="type-name">{result.typeName}</p>
        </div>
        <div className="score-card" aria-label={`総合AI急進度スコア ${result.totalScore}点`}>
          <span>総合AI急進度スコア</span>
          <strong>{result.totalScore}</strong>
          <small>/100点</small>
        </div>
      </header>

      <ScoreBar value={result.totalScore} />

      <div className="result-copy">
        <p className="band-comment">{result.bandComment}</p>
        <p>{result.typeDescription}</p>
      </div>

      <section className="axis-section" aria-label="4軸スコア">
        <h3>4軸スコア</h3>
        <div className="axis-list">
          {result.axisScores.map((axisScore) => (
            <article className="axis-row" key={axisScore.axis}>
              <div className="axis-row-header">
                <div>
                  <p>{axisScore.label}</p>
                  <strong>
                    {axisScore.traditionalLetter} / {axisScore.radicalLetter}：{axisScore.sideName}
                  </strong>
                </div>
                <span>{axisScore.displayScore}</span>
              </div>
              <ScoreBar value={axisScore.displayScore} />
              <p className="axis-description">{axisScore.measurement}</p>
              <div className="axis-explain-grid">
                <p>{axisScore.traditionalDescription}</p>
                <p>{axisScore.radicalDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="result-actions">
        <button className="primary-button" type="button" onClick={onRestart}>
          もう一度診断する
        </button>
        <button className="secondary-button" type="button" onClick={onStats}>
          統計を見る
        </button>
        <button className="secondary-button" type="button" onClick={onHome}>
          トップに戻る
        </button>
      </div>
    </section>
  );
}

export default App;
