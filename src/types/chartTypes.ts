// types/chartTypes.ts

export enum ChartType {
  LINE = "LINE",
  BAR = "BAR",
  AREA = "AREA",
  PIE = "PIE",
  DOUGHNUT = "DOUGHNUT",
  POLARAREA = "POLARAREA",
  RADAR = "RADAR",
  SCATTER = "SCATTER",
  BUBBLE = "BUBBLE",
}

export interface Dataset {
  label?: string;
  data: number[];
  type?: ChartType;
  backgroundColor: string | string[];
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface ChartOptions {
  [key: string]: any;
}

export interface Chart {
  id: string;
  name: string;
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
}
