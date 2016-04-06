/* globals d3, Draggable */
'use strict';
(function () {

  var campaigns = [
      { action: 'Social', cost: 5 },
      { action: 'Banner Ad', cost: 25 },
      { action: 'Radio', cost: 50 },
      { action: 'Print', cost: 75 },
      { action: 'Video', cost: 100 },
      { action: 'Website', cost: 150 },
      { action: 'Event', cost: 300 },
      { action: 'TV Spot', cost: 500 }
    ],
    relativeWidth = 300,
    width = parseInt(d3.select('#wheel').style('width'), 10),
    mySvg = d3.select('#wheel').append('svg')
      .attr('width', width)
      .attr('height', width),
    myGroup = mySvg.append('g')
      .attr('transform', 'translate(' + (width / 2)  + ',' + (width / 2) + ')'),
    myArc = d3.svg.arc()
      .innerRadius(width / 5)
      .outerRadius(width / 2),
    myInput = d3.select('input'),
    numberOfSegments,
    radians,
    degrees;

  // Returns filtered campaign array based on budget input
  function getCampaigns() {
    return campaigns.filter((val) => {
      return (val.cost <= parseInt(myInput.node().value, 10)) ? true : false;
    });
  }

  function render() {
    //var segments = myGroup.selectAll('g').data(d3.range(numberOfSegments)),
    var segments = myGroup.selectAll('g').data(getCampaigns()),
      segGroup;

    radians = (Math.PI * 2) / numberOfSegments;
    degrees = 360 / numberOfSegments;

    myArc.startAngle(function (d,i) { return radians * i; });
    myArc.endAngle(function (d,i) { return radians * (i + 1);});

    segGroup = segments.enter().append('g');

    segGroup.append('path');
    segGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '6%')
      .append('textPath')
        .attr('stroke','black')
        .attr('text-anchor', 'middle')
        .attr('startOffset', function () {
          return (numberOfSegments + 11) + '%';
        })
        .attr('xlink:href', function (d) {
          return '#' + d.action;
        })
        .text(function (d) {
          return d.action;
        });


    d3.selectAll('g g path')
      .attr('d', myArc)
      .attr('fill', function (d, i) {
        return 'hsl(' + (i * degrees) + ',100%,50%)';
      })
      .attr('id', function (d) {
        return d.action;
      });

    d3.selectAll('g g text')
      .attr('font-size', () => {
        return 20 * (width / relativeWidth);
      });

    segments.exit().remove();

    //segments.exit().remove();
    d3.select('#number').text(parseInt(myInput.node().value, 10) * 1000);
  }

  numberOfSegments = getCampaigns().length;
  console.log(numberOfSegments);
  render();

  myInput.on('input', function () {
    numberOfSegments = campaigns.filter((val) => {
      return (val.cost > parseInt(this.value, 10)) ? false : true;
    }).length;
    render();
  });

  Draggable.create('#wheel svg', {
    type: 'rotation',
    throwProps: true,
    throwResistance: 10000,
    minDuration: 5
  });

  window.onresize = function () {
    width = parseInt(d3.select('#wheel').style('width'), 10);

    mySvg.attr('width', width)
      .attr('height', width);

    myGroup.attr('transform', 'translate(' + (width / 2)  + ',' + (width / 2) + ')');

    myArc.innerRadius(width / 5);
    myArc.outerRadius(width / 2);

    render();
  };
})();
