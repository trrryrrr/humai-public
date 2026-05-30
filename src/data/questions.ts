export type AxisCode = "CA" | "TN" | "HD" | "PR";
export type Direction = "radical" | "traditional";

export type Question = {
  id: string;
  axis: AxisCode;
  direction: Direction;
  text: string;
};

export type AxisDefinition = {
  code: AxisCode;
  label: string;
  traditionalLetter: "C" | "T" | "H" | "P";
  radicalLetter: "A" | "N" | "D" | "R";
  traditionalName: string;
  radicalName: string;
  measurement: string;
  traditionalDescription: string;
  radicalDescription: string;
};

export const axisOrder: AxisCode[] = ["CA", "TN", "HD", "PR"];

export const axisDefinitions: AxisDefinition[] = [
  {
    code: "CA",
    label: "AGI前提度",
    traditionalLetter: "C",
    radicalLetter: "A",
    traditionalName: "Continuity / 連続派",
    radicalName: "AGI-Premised / AGI前提派",
    measurement:
      "AGIや急速なAI発展を、研究計画・キャリア設計・大学院教育・分野選択の前提にどれくらい入れているか。",
    traditionalDescription:
      "C / 連続派：AIの影響を認めつつも、研究文化や研究訓練は現在から連続的に変化すると見る立場です。",
    radicalDescription:
      "A / AGI前提派：AGI級AIや急速なAI発展を、研究テーマ、キャリア、教育、制度設計の前提に入れる立場です。",
  },
  {
    code: "TN",
    label: "AIネイティブ度",
    traditionalLetter: "T",
    radicalLetter: "N",
    traditionalName: "Tool-Use / 道具利用派",
    radicalName: "AI-Native / AIネイティブ派",
    measurement: "AIを翻訳・要約・文章修正などの補助ツールとして使うのか、研究プロセス全体に組み込むのか。",
    traditionalDescription:
      "T / 道具利用派：AIを主に翻訳、要約、文章修正、コード補助などの補助ツールとして使う立場です。",
    radicalDescription:
      "N / AIネイティブ派：文献探索、仮説生成、研究ノート、コード、実験設計、論文草稿までAIと統合する立場です。",
  },
  {
    code: "HD",
    label: "認識委譲度",
    traditionalLetter: "H",
    radicalLetter: "D",
    traditionalName: "Human-Sovereign / 人間主権派",
    radicalName: "Delegated / 委譲・分散派",
    measurement: "仮説生成、探索、検証、優先順位づけ、暫定判断をどこまでAIに委ねられると考えるか。",
    traditionalDescription:
      "H / 人間主権派：重要な研究判断や意味づけは、人間が主導すべきだと考える立場です。",
    radicalDescription:
      "D / 委譲・分散派：監査や検証を前提に、探索、仮説生成、再現性確認、暫定判断の一部をAIに委譲する立場です。",
  },
  {
    code: "PR",
    label: "制度再設計度",
    traditionalLetter: "P",
    radicalLetter: "R",
    traditionalName: "Preservation / 制度保存派",
    radicalName: "Redesign / 制度再設計派",
    measurement: "論文、査読、著者性、研究評価、研究室、大学院教育などの学術制度をAI前提で変えるべきと考えるか。",
    traditionalDescription:
      "P / 制度保存派：論文、査読、著者性、大学院、学会などの既存制度を基本的に維持すべきだと考える立場です。",
    radicalDescription:
      "R / 制度再設計派：AI利用ログ、貢献者表示、AI査読支援、研究評価、研究室運営などをAI時代に合わせて再設計すべきだと考える立場です。",
  },
];

export const questions: Question[] = [
  {
    id: "q01",
    axis: "CA",
    direction: "radical",
    text: "今後5年以内に、AIは多くの研究分野で「優秀な共同研究者」に近い役割を担うようになると思う。",
  },
  {
    id: "q02",
    axis: "CA",
    direction: "radical",
    text: "自分の研究テーマやキャリアは、AGI級AIが存在する未来から逆算して考えるべきだと思う。",
  },
  {
    id: "q03",
    axis: "CA",
    direction: "radical",
    text: "現在の大学院教育や研究訓練は、AIの発展によって近い将来かなり陳腐化する可能性があると思う。",
  },
  {
    id: "q04",
    axis: "CA",
    direction: "radical",
    text: "AIによって、科学研究の進歩は従来の数十年分が数年に圧縮されるような非連続な加速を経験しうると思う。",
  },
  {
    id: "q05",
    axis: "CA",
    direction: "radical",
    text: "これからの研究計画では、AIが次世代のAIや研究ツールを自ら改善していく可能性を前提に入れるべきだと思う。",
  },
  {
    id: "q06",
    axis: "CA",
    direction: "radical",
    text: "近い将来、研究者に求められる主要スキルは、専門知識そのものよりも、AIと協働して問いを設計する能力に移ると思う。",
  },
  {
    id: "q07",
    axis: "CA",
    direction: "radical",
    text: "研究分野やテーマを選ぶとき、その領域がAIによってどれくらい自動化・加速されるかを重要な判断材料にすべきだと思う。",
  },
  {
    id: "q08",
    axis: "CA",
    direction: "traditional",
    text: "現在のAIはまだAGIとはかなり距離があり、研究計画の前提にするには不確実性が大きすぎると思う。",
  },
  {
    id: "q09",
    axis: "CA",
    direction: "traditional",
    text: "AIがどれほど発展しても、実験、検証、制度、専門家コミュニティの速度制約によって、研究の変化は比較的ゆっくり進むと思う。",
  },
  {
    id: "q10",
    axis: "CA",
    direction: "traditional",
    text: "AGIの到来を前提にして研究計画を立てるのは、現時点ではやや早すぎると思う。",
  },
  {
    id: "q11",
    axis: "CA",
    direction: "traditional",
    text: "AIの影響は大きいとしても、研究者の基本的な仕事の進め方は現在と連続的に変化していくと思う。",
  },
  {
    id: "q12",
    axis: "CA",
    direction: "traditional",
    text: "人文学・社会科学・基礎理論のような領域では、AI時代でも人間の長期的な読解や解釈訓練の重要性は大きく変わらないと思う。",
  },
  {
    id: "q13",
    axis: "CA",
    direction: "traditional",
    text: "将来のAIを意識しすぎるより、現時点で確立された研究方法を着実に身につけることの方が重要だと思う。",
  },
  {
    id: "q14",
    axis: "TN",
    direction: "radical",
    text: "AIは文章作成や要約だけでなく、研究テーマの発見や仮説生成にも積極的に使うべきだと思う。",
  },
  {
    id: "q15",
    axis: "TN",
    direction: "radical",
    text: "文献探索、研究ノート、仮説検討、コード、論文草稿をAIと連携した一つのワークフローに統合したい。",
  },
  {
    id: "q16",
    axis: "TN",
    direction: "radical",
    text: "将来の研究者は、単独で作業するよりも、複数のAIエージェントからなる「個人研究チーム」と働くようになると思う。",
  },
  {
    id: "q17",
    axis: "TN",
    direction: "radical",
    text: "論文検索、データ分析、シミュレーション、コード生成、図表作成をAIでつなぐことは、研究の標準的な作法になると思う。",
  },
  {
    id: "q18",
    axis: "TN",
    direction: "radical",
    text: "研究の初期段階では、人間が白紙から考えるより、AIと大量の案を出してから絞り込む方がよいと思う。",
  },
  {
    id: "q19",
    axis: "TN",
    direction: "radical",
    text: "研究室やゼミは、AIの使い方を個人任せにするのではなく、AI-nativeな共同研究ワークフローを組織的に設計すべきだと思う。",
  },
  {
    id: "q20",
    axis: "TN",
    direction: "radical",
    text: "AIを使うことで、自分の専門外の分野や方法論にも踏み込みやすくなり、研究の探索範囲を広げられると思う。",
  },
  {
    id: "q21",
    axis: "TN",
    direction: "traditional",
    text: "AIの主な役割は、翻訳、要約、文章修正、コード補助などの限定的な支援にとどめるべきだと思う。",
  },
  {
    id: "q22",
    axis: "TN",
    direction: "traditional",
    text: "研究の中心的な問いや構想は、AIではなく人間が独力で考えるべきだと思う。",
  },
  {
    id: "q23",
    axis: "TN",
    direction: "traditional",
    text: "AIを研究プロセスに深く組み込みすぎると、データが豊富で既存研究の多い領域に研究が偏りやすくなると思う。",
  },
  {
    id: "q24",
    axis: "TN",
    direction: "traditional",
    text: "重要な文献については、AIの要約に頼る前に、研究者自身が時間をかけて読むべきだと思う。",
  },
  {
    id: "q25",
    axis: "TN",
    direction: "traditional",
    text: "AIは研究ワークフローの中心ではなく、必要なときだけ呼び出す補助的な道具である方が望ましいと思う。",
  },
  {
    id: "q26",
    axis: "TN",
    direction: "traditional",
    text: "AIを使わない試行錯誤や遠回りには、研究者の独創性を育てる重要な価値があると思う。",
  },
  {
    id: "q27",
    axis: "HD",
    direction: "radical",
    text: "十分な検証プロセスがあれば、AIが提案した研究仮説を人間発の仮説と同等に扱ってよいと思う。",
  },
  {
    id: "q28",
    axis: "HD",
    direction: "radical",
    text: "文献探索や反例探索は、人間が一つ一つ確認するより、AIエージェントに広く探索させる方がよいと思う。",
  },
  {
    id: "q29",
    axis: "HD",
    direction: "radical",
    text: "将来的には、研究プロジェクトの一部についてAIが暫定的な意思決定を行ってもよいと思う。",
  },
  {
    id: "q30",
    axis: "HD",
    direction: "radical",
    text: "査読前の論文チェック、再現性確認、反論候補の探索は、AIにかなりの部分を任せてよいと思う。",
  },
  {
    id: "q31",
    axis: "HD",
    direction: "radical",
    text: "研究AIが実験計画を立て、コードを書き、結果を分析し、人間が監査するという分担は十分にありうると思う。",
  },
  {
    id: "q32",
    axis: "HD",
    direction: "radical",
    text: "AI時代の研究者の役割は、すべてを自分で判断することから、AIの判断を監査し方向づけることへ移ると思う。",
  },
  {
    id: "q33",
    axis: "HD",
    direction: "traditional",
    text: "研究上の重要な判断は、たとえAIが高性能でも、最終的には人間が最初から最後まで主導すべきだと思う。",
  },
  {
    id: "q34",
    axis: "HD",
    direction: "traditional",
    text: "AIによる研究支援は便利だが、研究の核心部分をAIに任せることには強い抵抗がある。",
  },
  {
    id: "q35",
    axis: "HD",
    direction: "traditional",
    text: "AIが生成した仮説や解釈には、人間が生成したものよりも高い疑いの基準を適用すべきだと思う。",
  },
  {
    id: "q36",
    axis: "HD",
    direction: "traditional",
    text: "論文の採否、研究費の採択、研究者評価のような判断にAIを深く関与させるべきではないと思う。",
  },
  {
    id: "q37",
    axis: "HD",
    direction: "traditional",
    text: "AIはもっともらしい誤りを出すため、研究判断の委譲は本質的に危険だと思う。",
  },
  {
    id: "q38",
    axis: "HD",
    direction: "traditional",
    text: "研究の責任は判断プロセスそのものと切り離せないので、AIへの委譲には明確な限界を設けるべきだと思う。",
  },
  {
    id: "q39",
    axis: "PR",
    direction: "radical",
    text: "AI時代には、論文の著者表示よりも、映画のエンドロールのような貢献者表示が重要になると思う。",
  },
  {
    id: "q40",
    axis: "PR",
    direction: "radical",
    text: "査読や研究評価には、AIによる自動検証や多段階レビューを本格的に組み込むべきだと思う。",
  },
  {
    id: "q41",
    axis: "PR",
    direction: "radical",
    text: "論文には、AIをどの工程でどのように使ったかを示すAI利用ログや検証履歴を添付するのが望ましいと思う。",
  },
  {
    id: "q42",
    axis: "PR",
    direction: "radical",
    text: "研究成果の単位は、論文だけでなく、データ、コード、プロンプト、AIとの対話ログ、再現性チェックまで含めて評価されるべきだと思う。",
  },
  {
    id: "q43",
    axis: "PR",
    direction: "radical",
    text: "大学や研究室は、AIエージェントを含む「研究制作スタジオ」のような形に変わっていくべきだと思う。",
  },
  {
    id: "q44",
    axis: "PR",
    direction: "radical",
    text: "研究評価は、論文数や引用数だけでなく、再現性、透明性、AI利用の適切さ、探索範囲の広さを重視する仕組みに変えるべきだと思う。",
  },
  {
    id: "q45",
    axis: "PR",
    direction: "traditional",
    text: "AIが発展しても、論文、査読、学会、大学院といった既存の学術制度は基本的に維持されるべきだと思う。",
  },
  {
    id: "q46",
    axis: "PR",
    direction: "traditional",
    text: "AI時代だからといって、著者性や研究評価のルールを大きく変える必要はないと思う。",
  },
  {
    id: "q47",
    axis: "PR",
    direction: "traditional",
    text: "査読にAIを使うことは、機密性や責任の観点から厳しく制限されるべきだと思う。",
  },
  {
    id: "q48",
    axis: "PR",
    direction: "traditional",
    text: "研究成果として最も重要なのは、今後も査読済み論文という形式であり続けると思う。",
  },
  {
    id: "q49",
    axis: "PR",
    direction: "traditional",
    text: "AI利用の開示ルールは必要だが、学術制度全体を作り替えるほどの変化ではないと思う。",
  },
  {
    id: "q50",
    axis: "PR",
    direction: "traditional",
    text: "研究の信頼性を守るためには、著者、査読者、評価者を人間中心に保つ制度設計が重要だと思う。",
  },
];

export const answerOptions = [
  { value: 1, label: "全くそう思わない" },
  { value: 2, label: "あまりそう思わない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "ややそう思う" },
  { value: 5, label: "強くそう思う" },
] as const;
