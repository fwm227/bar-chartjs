## Bar Chart

> The bar-chart visualization plugin

[![Build Status](https://travis-ci.org/reming0227/bar-chart.svg?branch=master)](https://travis-ci.org/reming0227/bar-chart) [![Version](https://img.shields.io/badge/npm-0.0.1-blue.svg)](https://www.npmjs.com/package/bar-chartjs)

## 📦 Installation

### CDN Import
```html
<script type="text/javascript" src="https://unpkg.com/bar-chartjs/lib/index.min.js"></script>
```

### Module Import
```javascript
npm install bar-chartjs --save
yarn add bar-chartjs
```

## 🔨 Usage

```javascript
var Option = {
  data: [50, 270, 100],
  labels: ['Mon', 'Tues', 'Wed']
};
new BarChart(canvas, Option);
```

## ⚙ Config

```javascript
{
  data: [],
  labels: [],
  xAxis: {
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#333',
      width: 1
    }
  },
  yAxis: {
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#aaa',
      width: 1
    }
  },
  bar: {
    style: {
      default: 'rgba(16, 142, 233, 0.6)',
      select: 'rgb(16, 142, 233)',
    }
  },
  style: {
    axis: '#aaa',
    line: '#ccc'
  },
  duration: 2000,
  tooltip: {
    radius: 4,
    font: {
      size: 14,
      family: 'Arial',
      style: 'rgba(0, 0, 0, 0.6)'
    }
  }
}
```


## 📃 License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Reming
