## Bar Chart

> The bar-chart visualization plugin

[![Build Status](https://travis-ci.org/reming0227/bar-chartjs.svg?branch=master)](https://travis-ci.org/reming0227/bar-chartjs) [![Version](https://img.shields.io/badge/npm-1.0.1-blue.svg)](https://www.npmjs.com/package/bar-chartjs)

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
```html
<canvas id="canvas"></canvas>
```
```javascript
var canvas = document.querySelector('#canvas');
var Option = {
  data: [50, 270, 100],
  labels: ['Mon', 'Tues', 'Wed']
};
new BarChart(canvas, Option);
```

## ⚙ Config

```javascript
{
  data: [], // data of y-axis
  labels: [], // data of x-axis
  margin: { // margin-space
    top: 30,
    bottom: 30
  },
  xAxis: { // config of x-axis
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#333',
      width: 1
    },
    tick: {
      style: '#333',
      width: 1,
      length: 6
    }
  },
  yAxis: { // config of y-axis
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#333',
      width: 1
    },
    tick: {
      style: '#333',
      width: 1,
      length: 6
    }
  },
  guideLine: { // config of guide-line
    style: '#ccc',
    width: 1
  },
  bar: { // config of bar
    style: {
      default: 'rgba(16, 142, 233, 0.6)',
      select: 'rgb(16, 142, 233)',
    }
  },
  duration: 500, // duration of animation
  tooltip: { // config of tooltip
    title: '',
    style: 'rgba(0, 0, 0, 0.6)',
    height: 50,
    radius: 4,
    mark: { // config of mark
      radius: 5,
      style: 'rgb(16, 142, 233)'
    },
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
