import { axisOrder, questions, type Direction, type Question } from "../data/questions";

export function shuffle<T>(items: T[]): T[] {
  const copied = [...items];

  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]];
  }

  return copied;
}

export function createQuestionSet(questionPool: Question[] = questions): Question[] {
  const selected = axisOrder.flatMap((axis) => {
    const axisQuestions = questionPool.filter((question) => question.axis === axis);
    const radical = sampleByDirection(axisQuestions, "radical", 2);
    const traditional = sampleByDirection(axisQuestions, "traditional", 2);
    const selectedIds = new Set([...radical, ...traditional].map((question) => question.id));
    const remaining = shuffle(axisQuestions.filter((question) => !selectedIds.has(question.id)));
    const filler = remaining.slice(0, 1);

    return [...radical, ...traditional, ...filler];
  });

  return shuffle(selected);
}

function sampleByDirection(questionsForAxis: Question[], direction: Direction, count: number): Question[] {
  return shuffle(questionsForAxis.filter((question) => question.direction === direction)).slice(0, count);
}
