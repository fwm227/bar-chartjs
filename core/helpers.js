const helpers = {
  /**
   * Format tick
   * @param  {[type]} minTick    min tick
   * @param  {[type]} maxTick    max tick
   * @param  {[type]} stepNumber step number
   * @return {[type]}            format tick
   */
  formatTick: function () {
    var ticks = [];
    var caculateTick = function (minTick, maxTick, stepNumber) {
      var step = (maxTick - minTick) / stepNumber;

      var log10Step = Math.log10(step);
      var tempStep;
      var formatStep;
      var extStepNum;
      var forStepNum;

      Math.pow(10, parseInt(log10Step)) === step ?
      tempStep = Math.pow(10, parseInt(log10Step)) : tempStep = Math.pow(10, parseInt(log10Step + 1));

      formatStep = (step / tempStep).toFixed(6);
      // modify step
      if (formatStep >= 0 && formatStep <= 0.1) formatStep = 0.1;
      else if (formatStep >= 0.100001 && formatStep <= 0.2) formatStep = 0.2;
      else if (formatStep >= 0.200001 && formatStep <= 0.25) formatStep = 0.25;
      else if (formatStep >= 0.250001 && formatStep <= 0.5) formatStep = 0.5;
      else formatStep = 1;

      formatStep *= tempStep;

      // modify min-tick
      if (parseInt(minTick / formatStep) !== (minTick / formatStep)) minTick = parseInt(minTick / formatStep) * formatStep;
      // modify max-tick
      if (parseInt(maxTick / formatStep) !== (maxTick / formatStep)) maxTick = (parseInt(maxTick / formatStep) + 1) * formatStep;
      // modify step-number
      forStepNum = (maxTick - minTick) / formatStep;
      if (stepNumber > forStepNum) {
        extStepNum = stepNumber - forStepNum;
        if (!extStepNum % 2) maxTick = maxTick + formatStep * parseInt(extStepNum / 2);
        else maxTick = maxTick + formatStep * parseInt(extStepNum / 2 + 1);
        minTick = minTick - formatStep * parseInt(extStepNum / 2);
      }
      ticks.push([minTick, maxTick, formatStep, stepNumber]);
    }
    return function caculateTicks(minTick, maxTick, stepNumber) {
      if (arguments.length) caculateTick(minTick, maxTick, stepNumber);
      else return ticks;
    };
  },
  getSuitableStep: function (minTick, maxTick) {
    var step, formatMax = maxTick;
    var caculateTicks = this.formatTick();
    for (var i = 10; i >= 5; i--) {
      caculateTicks(minTick, maxTick, i);
    }
    var ticks = caculateTicks();
    // get suitable tick
    var tempMin = Number.MAX_VALUE;
    var idxTag;
    console.log(ticks);
    ticks.forEach(function (tick, idx) {
      if (tick[1] <= tempMin) {
        tempMin = tick[1];
        idxTag = idx;
      }
    });
    console.log(ticks[idxTag]);
    return ticks[idxTag];
  },
  /**
   * Get ticks
   * @param  {Number} minTick - min tick
   * @param  {Number} maxTick - max tick
   * @param  {Number} stepNumber - step number
   * @return {Array}            ticks of bar-chart
   */
  getTick: function (minTick, maxTick) {
    return this.getSuitableStep(minTick, maxTick);
  },
  /**
   * Animation request
   * @return {Function} animatin function
   */
  requestAnimationFrame: function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60); // simulate FPS of browser
    };
  }
}

export default helpers;
