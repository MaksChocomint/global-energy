import React from "react";
import {
  Chart as ChartJS,
  registerables,
  ChartTypeRegistry,
  ChartData,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartType } from "@/types/blockTypes";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables, ChartDataLabels);

interface Dataset {
  data: number[];
  type: string;
  label: string;
  yAxisID: string;
  backgroundColor: string;
}

interface Props {
  chart: ChartType;
}

const transformDoughnutData = (datasets: Dataset[]): ChartData<"doughnut"> => {
  const transformedData: ChartData<"doughnut"> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  datasets.forEach((dataset) => {
    if (dataset.data.length > 0) {
      transformedData.labels?.push(dataset.label);
      transformedData.datasets[0].data.push(dataset.data[0]);
      (transformedData.datasets[0].backgroundColor as string[]).push(
        dataset.backgroundColor
      );
    }
  });

  return transformedData;
};

const ChartComponent: React.FC<Props> = ({ chart }) => {
  let data: ChartData<keyof ChartTypeRegistry> = chart.data as ChartData<
    keyof ChartTypeRegistry
  >;
  let options: ChartOptions<keyof ChartTypeRegistry> = chart.options || {};

  // Handle the custom 'area' chart type
  let chartType: keyof ChartTypeRegistry =
    chart.type.toLowerCase() as keyof ChartTypeRegistry;
  if (chart.type.toLowerCase() === "area") {
    chartType = "line";
    data.datasets = data.datasets.map((dataset: any) => ({
      ...dataset,
      type: "line",
      fill: true, // Enable filling the area under the line
    }));
  }

  data.datasets = data.datasets.map((dataset: any) => {
    if (dataset.type === "line") {
      return { ...dataset, borderColor: dataset.backgroundColor };
    }
    return dataset;
  });

  if (chart.type.toLowerCase() === "doughnut") {
    data = transformDoughnutData(data.datasets as Dataset[]);
    options = {
      plugins: {
        legend: options.plugins?.legend || {
          position: "bottom",
        },
        datalabels: {
          formatter: (value, context) => {
            if (Number(value) < 3) return null; // Don't display labels for values < 3%
            const label = context.chart.data.labels?.[context.dataIndex];
            return `${label}\n${value}%`; // Display the label and percentage
          },
          color: "#fff", // Label color
          textAlign: "center",
          font: {
            weight: "bold",
          },
        },
      },
      responsive: options.responsive !== undefined ? options.responsive : true,
    };
  } else {
    options = {
      ...options,
      plugins: {
        ...options.plugins,
        datalabels: {
          display: false, // Disable data labels for non-doughnut charts
        },
      },
    };
  }

  return (
    <div className="w-full">
      <h3 className="text-center tracking-wider text-lg font-medium mb-2">
        {chart.name}
      </h3>
      <Chart
        className="w-full p-6 rounded-xl border"
        type={chartType}
        data={data}
        options={options}
      />
    </div>
  );
};

export default ChartComponent;
