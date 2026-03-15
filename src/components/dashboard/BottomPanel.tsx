import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { TrendPoint } from '../../services/types';

interface Props {
  points: TrendPoint[];
}

interface TrendChartProps {
  title: string;
  unit: string;
  color: string;
  threshold: number;
  values: number[];
  xData: string[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, unit, color, threshold, values, xData }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    const chart = instanceRef.current;

    chart.setOption({
      backgroundColor: 'transparent',
      animation: false,
      grid: { left: 40, right: 10, top: 18, bottom: 20 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLabel: { color: '#8ea6c7', fontSize: 8 },
        axisLine: { lineStyle: { color: '#1b375f' } },
      },
      yAxis: {
        type: 'value',
        name: unit,
        axisLabel: { color: '#8ea6c7', fontSize: 8 },
        nameTextStyle: { color: '#8ea6c7', fontSize: 8, padding: [0, 0, 0, -6] },
        splitLine: { lineStyle: { color: '#1b375f' } },
      },
      series: [
        {
          name: title,
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: values,
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}55` },
              { offset: 1, color: `${color}00` },
            ]),
          },
          markLine: {
            symbol: 'none',
            label: { color: '#8ea6c7', formatter: `阈值 ${threshold}` },
            lineStyle: { color: '#8ea6c7', type: 'dashed', width: 1 },
            data: [{ yAxis: threshold }],
          },
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [color, threshold, title, unit, values, xData]);

  useEffect(() => {
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="trend-card">
      <div className="trend-card-title">{title}</div>
      <div ref={chartRef} className="trend-chart" />
    </div>
  );
};

export const BottomPanel: React.FC<Props> = ({ points }) => {
  const xData = points.map((point) => new Date(point.timestamp).toLocaleTimeString());

  return (
    <section className="panel bottom-panel">
      <div className="bottom-head">
        <h4 className="metric-title" style={{ margin: 0 }}>
          趋势分析
        </h4>
        <span className="badge">最近 {points.length} 个采样点</span>
      </div>
      <div className="trend-grid">
        <TrendChart
          title="最大油膜压力"
          unit="MPa"
          color="#ff5468"
          threshold={10}
          values={points.map((point) => point.maxPressure)}
          xData={xData}
        />
        <TrendChart
          title="最小油膜厚度"
          unit="μm"
          color="#1fdb90"
          threshold={9}
          values={points.map((point) => point.minFilmThickness)}
          xData={xData}
        />
        <TrendChart
          title="最高油膜温度"
          unit="°C"
          color="#ffb648"
          threshold={105}
          values={points.map((point) => point.temperature)}
          xData={xData}
        />
      </div>
    </section>
  );
};
