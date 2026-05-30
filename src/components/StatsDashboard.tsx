import { axisDefinitions } from "../data/questions";
import { calculateStatistics } from "../lib/statistics";
import type { ResultRecord } from "../lib/storage";
import ScoreBar from "./ScoreBar";
import SimpleLineChart from "./SimpleLineChart";

type StatsDashboardProps = {
  records: ResultRecord[];
  onClear: () => void;
  onHome: () => void;
  storageMode: "shared" | "local";
};

function StatsDashboard({ records, onClear, onHome, storageMode }: StatsDashboardProps) {
  const stats = calculateStatistics(records);
  const isShared = storageMode === "shared";

  const handleClear = () => {
    if (window.confirm("このブラウザに保存された統計データを削除します。よろしいですか？")) {
      onClear();
    }
  };

  return (
    <section className="stats-screen" aria-labelledby="stats-title">
      <header className="screen-header">
        <div>
          <p className="eyebrow">{isShared ? "Shared Statistics" : "Local Statistics"}</p>
          <h2 id="stats-title">{isShared ? "共有統計" : "このブラウザの統計"}</h2>
          <p className="screen-lead">
            {isShared
              ? "共有集計用の保存先に記録された、個人情報を含まない診断結果だけを集計しています。"
              : "このブラウザに保存された、個人情報を含まない診断結果だけを集計しています。"}
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={onHome}>
            トップに戻る
          </button>
          <button className="danger-button" disabled={records.length === 0} type="button" onClick={handleClear}>
            この端末の統計データを削除する
          </button>
        </div>
      </header>

      {!stats ? (
        <div className="empty-state">
          <p>
            {isShared
              ? "まだ共有保存された診断結果がありません。診断を完了すると、個人情報を含まない結果データが共有集計用の保存先に保存されます。"
              : "まだ保存された診断結果がありません。診断を完了すると、個人情報を含まない結果データがこのブラウザ内に保存されます。"}
          </p>
        </div>
      ) : (
        <>
          <section className="metric-grid" aria-label="統計サマリー">
            <MetricCard label="保存済み結果数" value={`${stats.count}件`} />
            <MetricCard label="平均AI急進度スコア" value={`${stats.averageScore}点`} />
            <MetricCard label="中央値" value={`${stats.medianScore}点`} />
            <MetricCard label="最高点 / 最低点" value={`${stats.maxScore} / ${stats.minScore}`} />
          </section>

          <section className="stats-layout">
            <div className="stats-card">
              <h3>4軸平均スコア</h3>
              <div className="stack-list">
                {axisDefinitions.map((axis) => (
                  <ScoreBar key={axis.code} label={`${axis.code}：${axis.label}`} value={stats.axisAverages[axis.code]} />
                ))}
              </div>
            </div>

            <div className="stats-card">
              <h3>AI急進側になった割合</h3>
              <div className="stack-list">
                {axisDefinitions.map((axis) => (
                  <ScoreBar
                    key={axis.code}
                    label={`${axis.code}軸で${axis.radicalLetter}になった割合`}
                    tone="quiet"
                    value={stats.radicalSideRates[axis.code]}
                  />
                ))}
              </div>
            </div>

            <div className="stats-card">
              <h3>スコア帯ごとの分布</h3>
              <div className="distribution-list">
                {stats.bandDistribution.map((item) => (
                  <div className="distribution-row" key={item.label}>
                    <span>{item.label}</span>
                    <div className="mini-track" aria-hidden="true">
                      <span style={{ width: `${item.percentage}%` }} />
                    </div>
                    <strong>{item.count}件</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-card">
              <h3>タイプコード別ランキング</h3>
              <div className="ranking-list">
                {stats.typeRanking.map((item, index) => (
                  <div className="ranking-row" key={item.typeCode}>
                    <span>{index + 1}</span>
                    <strong>{item.typeCode}型</strong>
                    <em>{item.count}件</em>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="stats-card trend-card">
            <h3>最新100件のスコア推移</h3>
            <SimpleLineChart values={stats.trendScores} />
          </section>
        </>
      )}
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default StatsDashboard;
