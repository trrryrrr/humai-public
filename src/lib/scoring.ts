import { axisDefinitions, axisOrder, type AxisCode, type Question } from "../data/questions";
import { getTypeProfile } from "../data/typeDescriptions";

export type AnswerValue = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<string, AnswerValue>;

export type AxisScoresRecord = Record<AxisCode, number>;
export type AxisLetters = {
  CA: "C" | "A";
  TN: "T" | "N";
  HD: "H" | "D";
  PR: "P" | "R";
};

export type ScoreBand = "0-20" | "21-40" | "41-60" | "61-80" | "81-100";

export type AxisScore = {
  axis: AxisCode;
  label: string;
  score: number;
  displayScore: number;
  letter: AxisLetters[AxisCode];
  sideName: string;
  traditionalLetter: string;
  radicalLetter: string;
  traditionalName: string;
  radicalName: string;
  measurement: string;
  traditionalDescription: string;
  radicalDescription: string;
};

export type DiagnosisResult = {
  totalScore: number;
  typeCode: string;
  typeName: string;
  typeDescription: string;
  bandComment: string;
  scoreBand: ScoreBand;
  axisScores: AxisScore[];
  axisScoreRecord: AxisScoresRecord;
  axisLetters: AxisLetters;
};

export const scoreBandLabels: ScoreBand[] = ["0-20", "21-40", "41-60", "61-80", "81-100"];

export const scoreBandComments: Record<ScoreBand, string> = {
  "0-20":
    "AI伝統派。AIを使うとしても、研究の本質は従来型の人間中心モデルにあると考える傾向があります。",
  "21-40": "慎重活用派。AIの便利さは認めつつも、研究の核心や制度変更には慎重です。",
  "41-60":
    "中間・選択的活用派。AIの可能性を感じつつ、領域や用途によって使い分けるバランス型です。",
  "61-80": "AI研究変革派。AIを研究ワークフローに深く組み込み、研究文化の変化にも前向きです。",
  "81-100":
    "AI急進派。AGI時代を見据え、研究活動・著者性・査読・教育・共同研究のあり方まで再設計しようとする傾向があります。",
};

export function getItemScore(question: Question, answer: AnswerValue): number {
  if (question.direction === "radical") {
    return ((answer - 1) / 4) * 100;
  }

  return ((5 - answer) / 4) * 100;
}

export function isCompleteAnswers(questionSet: Question[], answers: Partial<Answers>): answers is Answers {
  return questionSet.length > 0 && questionSet.every((question) => answers[question.id] !== undefined);
}

export function calculateDiagnosis(questionSet: Question[], answers: Answers): DiagnosisResult {
  const axisScores = axisDefinitions.map((axis) => {
    const axisQuestions = questionSet.filter((question) => question.axis === axis.code);
    const score =
      axisQuestions.reduce((sum, question) => sum + getItemScore(question, answers[question.id]), 0) /
      axisQuestions.length;
    const isRadicalSide = score >= 50;

    return {
      axis: axis.code,
      label: axis.label,
      score,
      displayScore: Math.round(score),
      letter: isRadicalSide ? axis.radicalLetter : axis.traditionalLetter,
      sideName: isRadicalSide ? axis.radicalName : axis.traditionalName,
      traditionalLetter: axis.traditionalLetter,
      radicalLetter: axis.radicalLetter,
      traditionalName: axis.traditionalName,
      radicalName: axis.radicalName,
      measurement: axis.measurement,
      traditionalDescription: axis.traditionalDescription,
      radicalDescription: axis.radicalDescription,
    };
  });

  const totalScore = Math.round(
    axisScores.reduce((sum, axisScore) => sum + axisScore.score, 0) / axisScores.length,
  );
  const axisLetters = axisScores.reduce(
    (record, axisScore) => ({
      ...record,
      [axisScore.axis]: axisScore.letter,
    }),
    {} as AxisLetters,
  );
  const axisScoreRecord = axisScores.reduce(
    (record, axisScore) => ({
      ...record,
      [axisScore.axis]: axisScore.displayScore,
    }),
    {} as AxisScoresRecord,
  );
  const typeCode = axisOrder.map((axis) => axisLetters[axis]).join("-");
  const typeProfile = getTypeProfile(typeCode);
  const scoreBand = getScoreBand(totalScore);

  return {
    totalScore,
    typeCode,
    typeName: typeProfile.name,
    typeDescription: typeProfile.description,
    bandComment: scoreBandComments[scoreBand],
    scoreBand,
    axisScores,
    axisScoreRecord,
    axisLetters,
  };
}

export function getScoreBand(score: number): ScoreBand {
  if (score <= 20) return "0-20";
  if (score <= 40) return "21-40";
  if (score <= 60) return "41-60";
  if (score <= 80) return "61-80";
  return "81-100";
}
