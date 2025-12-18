// src/services/MockDataService.ts
import type { SimulationParams, BearingTelemetry } from './types';

class MockDataService {
  // 默认工况
  private params: SimulationParams = {
    rpm: 3000,
    load: 10000,
    eccentricity: 0.5,
  };

  private intervalId: any = null;
  private subscribers: ((data: BearingTelemetry) => void)[] = [];

  // 启动模拟 (默认 100ms 刷新一次)
  public start(intervalMs: number = 100) {
    if (this.intervalId) return;
    console.log("🚀 Simulation Engine Started");
    
    this.intervalId = setInterval(() => {
      this.broadcast(this.calculatePhysics());
    }, intervalMs);
  }

  // 停止模拟
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // UI 调用此方法更新参数
  public updateParams(newParams: Partial<SimulationParams>) {
    this.params = { ...this.params, ...newParams };
  }

  // UI 调用此方法订阅数据
  public subscribe(callback: (data: BearingTelemetry) => void) {
    this.subscribers.push(callback);
    return () => { // 返回取消订阅函数
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // 私有：计算物理逻辑
  private calculatePhysics(): BearingTelemetry {
    const { rpm, load } = this.params;
    const noise = (Math.random() - 0.5) * 0.5; // 添加噪声

    // 简单物理近似公式
    const pressure = (load / 1000) * 0.8 + (rpm / 10000) * 5 + noise;
    const temp = 40 + (rpm / 500) * 2 + (load / 8000) + noise;
    const vib = (rpm / 3000) * 10 + noise;

    // 生成假装是 3D 场的数据 (72个点)
    const field = new Array(72).fill(0).map((_, i) => {
      // 在底部(约36-40索引处)压力最大
      const dist = Math.abs(i - 36);
      return dist < 10 ? pressure * (1 - dist/10) : 0;
    });

    return {
      timestamp: Date.now(),
      scalars: {
        maxPressure: parseFloat(Math.max(0, pressure).toFixed(2)),
        minFilmThickness: parseFloat((100 - load/600).toFixed(2)),
        temperature: parseFloat(temp.toFixed(1)),
        vibrationAmp: parseFloat(Math.abs(vib).toFixed(2)),
      },
      fieldData: {
        pressureDistribution: field
      }
    };
  }

  private broadcast(data: BearingTelemetry) {
    this.subscribers.forEach(cb => cb(data));
  }
}

// 导出单例
export const mockService = new MockDataService();