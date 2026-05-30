import { axisDefinitions, axisOrder, type AxisCode } from "../data/questions";
import { scoreBandLabels, type ScoreBand } from "./scoring";
import type { ResultRecord } from "./storage";

export type DistributionItem = {
  label: ScoreBand;
  count: number;
  percentage: number;
};

export type TypeRankingItem = {
  typeCode: string;
  count: number;
  percentage: number;
};

export type StatisticsSummary = {
  count: number;
  averageScore: number;
  medianScore: number;
  maxScore: number;
  minScore: number;
  axisAverages: Record<AxisCode, number>;
  bandDistribution: DistributionItem[];
  typeRanking: TypeRankingItem[];
  radicalSideRates: Record<AxisCode, number>;
  trendScores: number[];
};

export function calculateStatistics(records: ResultRecord[]): StatisticsSummary | null {
  if (records.length === 0) {
    return null;
  }

  const scores = records.map((record) => record.overallScore);
  const count = records.length;
  const axisAverages = axisDefinitions.reduce(
    (averages, axis) => ({
      ...averages,
      [axis.code]: round1(average(records.map((record) => record.axisScores[axis.code]))),
    }),
    {} as Record<AxisCode, number>,
  );
  const bandDistribution = scoreBandLabels.map((band) => {
    const bandCount = records.filter((record) => record.scoreBand === band).length;
    return {
      label: band,
      count: bandCount,
      percentage: round1((bandCount / count) * 100),
    };
  });
  const typeRanking = Object.entries(
    records.reduce(
      (ranking, record) => ({
        ...ranking,
        [record.typeCode]: (ranking[record.typeCode] ?? 0) + 1,
      }),
      {} as Record<string, number>,
    ),
  )
    .map(([typeCode, typeCount]) => ({
      typeCode,
      count: typeCount,
      percentage: round1((typeCount / count) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.typeCode.localeCompare(b.typeCode));
  const radicalSideRates = axisOrder.reduce(
    (rates, axis) => {
      const radicalLetter = axisDefinitions.find((definition) => definition.code === axis)?.radicalLetter;
      const radicalCount = records.filter((record) => record.axisLetters[axis] === radicalLetter).length;

      return {
        ...rates,
        [axis]: round1((radicalCount / count) * 100),
      };
    },
    {} as Record<AxisCode, number>,
  );

  return {
    count,
    averageScore: round1(average(scores)),
    medianScore: round1(median(scores)),
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores),
    axisAverages,
    bandDistribution,
    typeRanking,
    radicalSideRates,
    trendScores: [...records].reverse().map((record) => record.overallScore),
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
