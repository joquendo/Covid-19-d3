import { createLineChart, initLineChart } from './line_chart';
import { addContainer } from '../d3helpers';
import { createCheckBox, createSelectBox } from '../filters';
import { createSummaryTable, initSummaryTable } from '../summaryTable';

// Default chart config
const lineChartOptions = {
  yProperty: 'cases',
  lines: [
    {
      property: 'cases',
    },
    {
      property: 'deaths',
    },
  ],
  lineMap: {
    cases: 'cases-line',
    cases_accum: 'cases-line',
    deaths_accum: 'deaths-line',
    deaths: 'deaths-line',
  },
  area: { property: 'cases' },
};

const lineChartConfig = {
  state: '*All States*', // HacktoberFest Issue: would be cool if we got the users location and set this to default
  accum: false,
};

const build = (data) => {
  const chartId = 'line-chart';

  const buildChart = () => {
    const states = data.states[lineChartConfig.state];
    const { accum } = lineChartConfig;
    lineChartOptions.yProperty = accum ? 'cases_accum' : 'cases';
    lineChartOptions.area.property = accum ? 'cases_accum' : 'cases';

    if (lineChartOptions.lines) {
      lineChartOptions.lines.forEach((line) => {
        line.property = accum ? `${line.property}_accum` : line.property.replace('_accum', '');
      });
    }

    createSummaryTable(chartId, states);

    const dataSelection = lineChartConfig.domain
      ? states.filter(
          (d) =>
            d.date?.valueOf() >= lineChartConfig.domain[0]?.valueOf() &&
            d.date?.valueOf() <= lineChartConfig.domain[1]?.valueOf()
        )
      : states;

    createLineChart({
      // eslint-disable-next-line no-use-before-define
      updateConfig,
      data: dataSelection,
      ...lineChartOptions,
      ...lineChartConfig,
    });
  };

  const updateConfig = (option) => {
    if (!option) return;
    const [key, value] = Object.entries(option)[0];
    lineChartConfig[key] = value;
    buildChart();
  };

  const toggleLine = (option) => {
    let lineCategory;
    let show;

    for (const key of option) {
      lineCategory = key;
      show = option[key];
    }

    lineChartOptions.lines.forEach((line) => {
      if (line.property) {
        // get line
      }
    });
  };

  addContainer(chartId);
  createSelectBox(
    chartId,
    'state',
    Object.keys(data.states).sort(),
    updateConfig
  );

  createCheckBox(chartId, 'accum', 'Show Cumulative', updateConfig);
  createCheckBox(chartId, 'deaths', 'Show Deaths Only', toggleLine);
  createCheckBox(chartId, 'cases', 'Show Cases Only', toggleLine);

  initSummaryTable(chartId);
  const _data = data.states[lineChartConfig.state];
  initLineChart(chartId, { ...lineChartOptions, data: _data, updateConfig });

  // Hacktoberfest issue: create a time selection control

  buildChart();
};

export default build;
