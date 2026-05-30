export type TypeProfile = {
  name: string;
  description: string;
};

export const explicitTypeProfiles: Record<string, TypeProfile> = {
  "A-N-D-R": {
    name: "研究OS刷新派",
    description:
      "AGI級AIの到来を前提に、研究活動そのものをAI-nativeに再設計しようとするタイプです。AIを単なる道具ではなく、探索・検証・判断・制度設計に関わる共同主体として捉えています。既存のアカデミアの形式にも強い変革可能性を見ています。",
  },
  "A-N-H-R": {
    name: "人間中心AI改革派",
    description:
      "AIの発展を強く意識し、研究ワークフローや制度の再設計にも前向きですが、研究の価値判断や最終的な意味づけは人間が担うべきだと考えるタイプです。AI-nativeでありながら、人間の解釈や責任を重視します。",
  },
  "C-T-H-P": {
    name: "古典的アカデミア守護者",
    description:
      "AIの有用性は認めつつも、研究の本質や学術制度の基本構造は大きく変える必要がないと考えるタイプです。AIは補助ツールとして使いながら、人間中心の伝統的な研究スタイルを重視します。",
  },
  "A-T-H-P": {
    name: "未来危機感ありの慎重派",
    description:
      "AIやAGIが研究環境に大きな影響を与える可能性は感じていますが、実際の研究プロセスや制度の変更には慎重なタイプです。変化を予感しながらも、既存の学術的規範を簡単には手放しません。",
  },
  "C-N-D-R": {
    name: "実務的AI改革派",
    description:
      "AGIの到来までは強く前提にしないものの、現在利用可能なAIだけでも研究ワークフローや制度を十分に変えられると考えるタイプです。未来予測よりも、現実の運用改善と実験的な仕組みづくりを重視します。",
  },
  "A-N-D-P": {
    name: "AI研究チーム実装派",
    description:
      "AIの急速な発展を見据え、研究プロセスにAIを深く組み込み、探索や検証の一部をAIに委譲することにも前向きなタイプです。一方で、学術制度そのものの大幅な再設計には比較的慎重です。",
  },
  "C-N-H-R": {
    name: "制度改革型AI活用派",
    description:
      "AGI前提の未来予測には慎重ですが、現在のAIを研究ワークフローに組み込むことや、AI利用を前提にした学術制度の見直しには前向きなタイプです。人間の主導性を保ちながら制度をアップデートしようとします。",
  },
};

export const generatedDescriptionParts: Record<string, string> = {
  A: "AIの急速な発展を研究設計の前提に置く",
  C: "現在の研究文化との連続性を重視する",
  N: "AIを研究プロセス全体に組み込もうとする",
  T: "AIを主に補助ツールとして捉える",
  D: "探索や判断の一部をAIに委譲することに前向き",
  H: "研究判断における人間の主導性を重視する",
  R: "学術制度の再設計に前向き",
  P: "既存の学術制度の安定性を重視する",
};

export function getTypeProfile(typeCode: string): TypeProfile {
  return explicitTypeProfiles[typeCode] ?? generateTypeProfile(typeCode);
}

function generateTypeProfile(typeCode: string): TypeProfile {
  const [ca, tn, hd, pr] = typeCode.split("-");
  const radicalCount = [ca, tn, hd, pr].filter((letter) => ["A", "N", "D", "R"].includes(letter)).length;

  const name = (() => {
    if (ca === "A" && tn === "T" && hd === "D" && pr === "R") {
      return "AGI前提の制度再設計派";
    }
    if (ca === "C" && tn === "N" && hd === "H" && pr === "P") {
      return "現実的AI活用バランス派";
    }
    if (ca === "A" && tn === "N" && hd === "H" && pr === "P") {
      return "人間主導AIネイティブ派";
    }
    if (radicalCount >= 3) {
      return "選択的AI改革派";
    }
    if (radicalCount === 2) {
      return "ハイブリッド研究設計派";
    }
    return "慎重なAI活用派";
  })();

  const description = `${[ca, tn, hd, pr]
    .map((letter) => generatedDescriptionParts[letter])
    .join("一方で、")}傾向があります。AI時代の変化を一枚岩で捉えるのではなく、研究計画、作業工程、判断責任、制度設計のどこを変えるべきかを選択的に見極めるタイプです。`;

  return { name, description };
}
