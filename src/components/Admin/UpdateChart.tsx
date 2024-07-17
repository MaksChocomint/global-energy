import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const UpdateChart: React.FC = () => {
  const [charts, setCharts] = useState<{ id: string; name: string }[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>("");
  const [primaryMin, setPrimaryMin] = useState<null | number>(null);
  const [secondaryMin, setSecondaryMin] = useState<null | number>(null);
  const [primaryMax, setPrimaryMax] = useState<null | number>(null);
  const [secondaryMax, setSecondaryMax] = useState<null | number>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("BAR");
  const [labels, setLabels] = useState("");
  const [primaryDatasets, setPrimaryDatasets] = useState([
    { label: "", dataPoints: "", backgroundColor: "", type: "bar" },
  ]);
  const [secondaryDatasets, setSecondaryDatasets] = useState([
    { label: "", dataPoints: "", backgroundColor: "", type: "bar" },
  ]);
  const [unit, setUnit] = useState("");
  const [secondaryUnit, setSecondaryUnit] = useState("");
  const [responsive, setResponsive] = useState(true);
  const [legendPosition, setLegendPosition] = useState("bottom");
  const [xStacked, setXStacked] = useState(false);
  const [yStacked, setYStacked] = useState(false);
  const [indexAxis, setIndexAxis] = useState(false);
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await axios.get("/api/getCharts");
        setCharts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке графиков", error);
      }
    };

    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/getTopics");
        setTopics(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке топиков", error);
      }
    };

    fetchCharts();
    fetchTopics();
  }, []);

  const handleChartChange = async (chartId: string) => {
    setSelectedChart(chartId);
    try {
      const response = await axios.get(`/api/getChart/${chartId}`);
      const chartData = response.data;

      setName(chartData.name);
      setLabels(chartData.data.labels.join(", "));
      setPrimaryDatasets(
        chartData.data.datasets
          .filter((ds: { yAxisID: string }) => ds.yAxisID === "primary")
          .map(
            (ds: {
              label: string;
              data: number[];
              type: string;
              backgroundColor: string;
            }) => ({
              label: ds.label,
              dataPoints: ds.data.join(", "),
              type: ds.type,
              backgroundColor: ds.backgroundColor,
            })
          )
      );
      setSecondaryDatasets(
        chartData.data.datasets
          .filter((ds: { yAxisID: string }) => ds.yAxisID === "secondary")
          .map(
            (ds: {
              label: string;
              data: number[];
              type: string;
              backgroundColor: string;
            }) => ({
              label: ds.label,
              dataPoints: ds.data.join(", "),
              type: ds.type,
              backgroundColor: ds.backgroundColor,
            })
          )
      );
      setUnit(chartData.options.scales.primary?.title.text || "");
      setSecondaryUnit(chartData.options.scales.secondary?.title.text || "");
      setResponsive(chartData.options.responsive);
      setPrimaryMin(chartData.options.scales.primary?.min || null);
      setSecondaryMin(chartData.options.scales.secondary?.min || null);
      setLegendPosition(chartData.options.plugins.legend.position);
      setXStacked(chartData.options.scales.x.stacked);
      setYStacked(chartData.options.scales.primary?.stacked || false);
      setIndexAxis(chartData.options.indexAxis === "y");
      setTopic(chartData.topicId);
    } catch (error) {
      console.error("Ошибка при загрузке данных графика", error);
    }
  };

  const handleDatasetChange = (
    index: number,
    field: string,
    value: string,
    isSecondary: boolean
  ) => {
    const setDatasets = isSecondary ? setSecondaryDatasets : setPrimaryDatasets;
    const datasets = isSecondary ? secondaryDatasets : primaryDatasets;
    const newDatasets = datasets.map((dataset, i) =>
      i === index ? { ...dataset, [field]: value } : dataset
    );
    setDatasets(newDatasets);
  };

  const addDataset = (isSecondary = false) => {
    const setDatasets = isSecondary ? setSecondaryDatasets : setPrimaryDatasets;
    const datasets = isSecondary ? secondaryDatasets : primaryDatasets;
    setDatasets([
      ...datasets,
      { label: "", dataPoints: "", backgroundColor: "", type: "bar" },
    ]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrimaryDatasets = primaryDatasets.map((dataset) => ({
      label: dataset.label,
      data:
        dataset.type === "bubble" || dataset.type === "scatter"
          ? dataset.dataPoints.split(";").map((point) => {
              const [x, y, r] = point
                .split(",")
                .map((num) => parseFloat(num.trim()));
              return { x, y, r };
            })
          : dataset.dataPoints
              .split(",")
              .map((point) => parseFloat(point.trim())),
      backgroundColor: dataset.backgroundColor,
      type: dataset.type,
      yAxisID: "primary",
    }));

    const parsedSecondaryDatasets = secondaryDatasets
      .filter((dataset) => dataset.label && dataset.dataPoints)
      .map((dataset) => ({
        label: dataset.label,
        data:
          dataset.type === "bubble" || dataset.type === "scatter"
            ? dataset.dataPoints.split(";").map((point) => {
                const [x, y, r] = point
                  .split(",")
                  .map((num) => parseFloat(num.trim()));
                return { x, y, r };
              })
            : dataset.dataPoints
                .split(",")
                .map((point) => parseFloat(point.trim())),
        backgroundColor: dataset.backgroundColor,
        type: dataset.type,
        yAxisID: "secondary",
      }));

    const chartData = {
      labels: labels.split(",").map((label) => label.trim()),
      datasets: [
        ...parsedPrimaryDatasets,
        ...(parsedSecondaryDatasets.length > 0 ? parsedSecondaryDatasets : []),
      ].filter(
        (dataset) => dataset.label && dataset.data && dataset.data.length > 0
      ),
    };

    const chartOptions =
      secondaryUnit && parsedSecondaryDatasets.length > 0
        ? {
            responsive,
            plugins: {
              legend: {
                position: legendPosition,
              },
            },
            layout: {
              padding: {
                left: 50,
              },
            },
            scales: {
              x: {
                stacked: xStacked,
              },
              primary: {
                type: "linear",
                min: primaryMin,
                max: primaryMax,
                position: "left",
                stacked: yStacked,
                title: {
                  display: true,
                  text: unit,
                  align: "center",
                  padding: { top: 0, bottom: 0 },
                  font: { size: 14 },
                  color: "#000",
                  rotation: -90,
                },
              },
              secondary: {
                type: "linear",
                min: secondaryMin,
                max: secondaryMax,
                position: "right",
                stacked: yStacked,
                title: {
                  display: true,
                  text: secondaryUnit,
                  align: "center",
                  padding: { top: 0, bottom: 0 },
                  font: { size: 14 },
                  color: "#000",
                  rotation: -90,
                },
              },
            },
            indexAxis: indexAxis ? "y" : "x", // Add indexAxis based on state
          }
        : {
            responsive,
            plugins: {
              legend: {
                position: legendPosition,
              },
            },
            layout: {
              padding: {
                left: 50,
              },
            },
            scales: {
              x: {
                stacked: xStacked,
              },
              primary: !indexAxis
                ? {
                    type: "linear",
                    min: primaryMin,
                    max: primaryMax,
                    position: "left",
                    stacked: yStacked,
                    title: {
                      display: true,
                      text: unit,
                      align: "center",
                      padding: { top: 0, bottom: 0 },
                      font: { size: 14 },
                      color: "#000",
                      rotation: -90,
                    },
                  }
                : {
                    stacked: yStacked,
                  },
            },
            indexAxis: indexAxis ? "y" : "x", // Add indexAxis based on state
          };

    try {
      const response = await axios.put(`/api/updateChart`, {
        id: selectedChart,
        name,
        type: chartData.datasets[0].type?.toUpperCase(),
        data: chartData,
        options: type !== "doughnut" ? chartOptions : null,
        topicId: topic,
      });

      setMessage("График обновлен успешно");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при обновлении графика");
    } finally {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <form
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center">Обновить график</h2>
        <div>
          <label htmlFor="chart" className="block text-lg">
            Выберите график
          </label>
          <select
            id="chart"
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
            value={selectedChart}
            onChange={(e) => handleChartChange(e.target.value)}
            required
          >
            <option value="">Выберите график</option>
            {charts.map((chart) => (
              <option key={chart.id} value={chart.id}>
                {chart.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="block text-lg">
            Название графика:
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="labels" className="block text-lg">
            Массив данных (разделенные запятыми)
          </label>
          <input
            type="text"
            id="labels"
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </div>
        <fieldset>
          <legend className="text-lg">Наборы данных:</legend>
          {primaryDatasets.map((dataset, index) => (
            <div key={index} className="mt-4 p-4 border rounded-lg">
              <div>
                <label
                  htmlFor={`primary-dataset-type-${index}`}
                  className="block text-lg"
                >
                  Тип набора данных:
                </label>
                <select
                  id={`primary-dataset-type-${index}`}
                  value={dataset.type}
                  onChange={(e) =>
                    handleDatasetChange(index, "type", e.target.value, false)
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                >
                  <option value="line">Линейный</option>
                  <option value="bar">Столбчатый</option>
                  <option value="area">Площадной</option>
                  <option value="pie">Круговой</option>
                  <option value="doughnut">Кольцевой</option>
                  <option value="polararea">Полярная область</option>
                  <option value="radar">Радар</option>
                  <option value="bubble">Пузырьковый</option>
                  <option value="scatter">Точечный</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={`primaryLabel${index}`}
                  className="block text-lg"
                >
                  Метка набора данных
                </label>
                <input
                  type="text"
                  id={`primaryLabel${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.label}
                  onChange={(e) =>
                    handleDatasetChange(index, "label", e.target.value, false)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`primaryDataPoints${index}`}
                  className="block text-lg"
                >
                  Точки данных (разделенные запятыми):
                </label>
                <input
                  type="text"
                  id={`primaryDataPoints${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.dataPoints}
                  onChange={(e) =>
                    handleDatasetChange(
                      index,
                      "dataPoints",
                      e.target.value,
                      false
                    )
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`primaryBackgroundColor${index}`}
                  className="block text-lg"
                >
                  Цвет фона (в RGB: rgb(r, g, b) или HEX: #xxxxxx формате):
                </label>
                <input
                  type="text"
                  id={`primaryBackgroundColor${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.backgroundColor}
                  onChange={(e) =>
                    handleDatasetChange(
                      index,
                      "backgroundColor",
                      e.target.value,
                      false
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 block w-full px-3 py-2 bg-green-500 text-lg text-white bg-primary rounded-md shadow-sm focus:outline-none"
            onClick={() => addDataset(false)}
          >
            Добавить набор данных
          </button>
        </fieldset>
        <fieldset>
          <legend className="text-lg">Вторичные наборы данных:</legend>
          {secondaryDatasets.map((dataset, index) => (
            <div key={index} className="mt-4 p-4 border rounded-lg">
              <div>
                <label
                  htmlFor={`secondary-dataset-type-${index}`}
                  className="block text-lg"
                >
                  Тип набора данных:
                </label>
                <select
                  id={`secondary-dataset-type-${index}`}
                  value={dataset.type}
                  onChange={(e) =>
                    handleDatasetChange(index, "type", e.target.value, true)
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                >
                  <option value="line">Линейный</option>
                  <option value="bar">Столбчатый</option>
                  <option value="area">Площадной</option>
                  <option value="pie">Круговой</option>
                  <option value="doughnut">Кольцевой</option>
                  <option value="polararea">Полярная область</option>
                  <option value="radar">Радар</option>
                  <option value="bubble">Пузырьковый</option>
                  <option value="scatter">Точечный</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={`secondaryLabel${index}`}
                  className="block text-lg"
                >
                  Метка набора данных:
                </label>
                <input
                  type="text"
                  id={`secondaryLabel${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.label}
                  onChange={(e) =>
                    handleDatasetChange(index, "label", e.target.value, true)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`secondaryDataPoints${index}`}
                  className="block text-lg"
                >
                  Точки данных (разделенные запятыми):
                </label>
                <input
                  type="text"
                  id={`secondaryDataPoints${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.dataPoints}
                  onChange={(e) =>
                    handleDatasetChange(
                      index,
                      "dataPoints",
                      e.target.value,
                      true
                    )
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`secondaryBackgroundColor${index}`}
                  className="block text-lg"
                >
                  Цвет фона (в RGB: rgb(r, g, b) или HEX: #xxxxxx формате):
                </label>
                <input
                  type="text"
                  id={`secondaryBackgroundColor${index}`}
                  className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
                  value={dataset.backgroundColor}
                  onChange={(e) =>
                    handleDatasetChange(
                      index,
                      "backgroundColor",
                      e.target.value,
                      true
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 block w-full px-3 py-2 text-lg bg-blue-500 text-white bg-primary rounded-md shadow-sm focus:outline-none"
            onClick={() => addDataset(true)}
          >
            Добавить вторичный набор данных
          </button>
        </fieldset>
        <div>
          <label htmlFor="primary-min" className="block text-lg">
            Минимальное значение первичной шкалы:
          </label>
          <input
            type="number"
            id="primary-min"
            value={String(primaryMin)}
            onChange={(e) => {
              setPrimaryMin(Number(e.target.value));
            }}
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="primary-max" className="block text-lg">
            Максимальное значение первичной шкалы:
          </label>
          <input
            type="number"
            id="primary-max"
            value={String(primaryMax)}
            onChange={(e) => {
              setPrimaryMax(Number(e.target.value));
            }}
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="secondary-min" className="block text-lg">
            Минимальное значение вторичной шкалы:
          </label>
          <input
            type="number"
            id="secondary-min"
            value={String(secondaryMin)}
            onChange={(e) => {
              setSecondaryMin(Number(e.target.value));
            }}
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="secondary-max" className="block text-lg">
            Максимальное значение вторичной шкалы:
          </label>
          <input
            type="number"
            id="secondary-max"
            value={String(secondaryMax)}
            onChange={(e) => {
              setSecondaryMax(Number(e.target.value));
            }}
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-lg">
            Единица измерения для первичного набора данных:
          </label>
          <input
            type="text"
            id="unit"
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="secondaryUnit" className="block text-lg">
            Единица измерения для вторичного набора данных:
          </label>
          <input
            type="text"
            id="secondaryUnit"
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
            value={secondaryUnit}
            onChange={(e) => setSecondaryUnit(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="responsive"
            checked={responsive}
            onChange={(e) => setResponsive(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="responsive" className="block text-lg">
            Адаптивный
          </label>
        </div>
        <div>
          <label htmlFor="legendPosition" className="block text-lg">
            Позиция легенды:
          </label>
          <select
            id="legendPosition"
            value={legendPosition}
            onChange={(e) => setLegendPosition(e.target.value)}
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="top">Вверху</option>
            <option value="bottom">Внизу</option>
            <option value="left">Слева</option>
            <option value="right">Справа</option>
          </select>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="xStacked"
            checked={xStacked}
            onChange={(e) => setXStacked(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="xStacked" className="block text-lg">
            Сложение по X
          </label>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="yStacked"
            checked={yStacked}
            onChange={(e) => setYStacked(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="yStacked" className="block text-lg">
            Сложение по Y
          </label>
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="indexAxis"
            checked={indexAxis}
            onChange={(e) => setIndexAxis(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="indexAxis" className="block text-lg">
            Горизонтальные столбцы
          </label>
        </div>
        <div>
          <label htmlFor="topic" className="block text-lg ">
            Выберите топик:
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Выберите топик</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 text-lg bg-purple-500 text-white bg-primary rounded-md shadow-sm focus:outline-none"
          >
            Сохранить изменения
          </button>
        </div>
      </form>
      {isModalOpen && (
        <MessageModal
          message={message}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UpdateChart;
