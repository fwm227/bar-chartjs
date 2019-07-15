## Bar Chart

> The bar-chart visualization plugin

[![Build Status](https://travis-ci.org/reming0227/bar-chartjs.svg?branch=master)](https://travis-ci.org/reming0227/bar-chartjs) [![Version](https://img.shields.io/badge/npm-1.0.2-blue.svg)](https://www.npmjs.com/package/bar-chartjs)

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
  labels: ['Mon', 'Tues', 'Wed'],
  series: [{
    style: {
      default: 'blue',
      active: 'red'
    },
    data: [
     100,
     230,
     170]
  },
  {
    style: {
      default: 'yellow',
      active: 'red'
    },
    data: [
     -170,
     170,
     100]
  },
  {
    data: [
     170,
     20,
     -80]
  },
  {
    style: {
      default: 'green',
      active: 'red'
    },
    data: [
     170,
     170,
     -230]
  }]
};
new BarChart(canvas, Option);
```

## ⚙ Config

```javascript
{
  series: [{
    style: {
      default: 'rgba(16, 142, 233, 0.6)',
      select: 'rgb(16, 142, 233)'
    },
    data: []
  },
  ...],
  labels: [],
  margin: {
    top: 30,
    bottom: 30
  },
  xAxis: {
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
  yAxis: {
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
  guideLine: {
    style: '#ccc',
    width: 1
  },
  defaultBar: { // set default style of bar
    style: {
      default: 'rgba(16, 142, 233, 0.6)',
      select: 'rgb(16, 142, 233)'
    }
  },
  duration: 500,
  tooltip: {
    title: '',
    style: 'rgba(0, 0, 0, 0.6)',
    height: 50,
    radius: 4,
    mark: {
      radius: 5
    },
    font: {
      size: 14,
      family: 'Arial',
      style: 'rgb(255, 255, 255)'
    }
  }
}
```


## 📃 License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Reming
