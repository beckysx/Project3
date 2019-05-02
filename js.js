var dataset={"name":"Five years","ticket":2348091312,"children":[
  {'year':"2014","ticket":378415107,"children":[{},{}]},
  {'year':"2015","ticket":513823537,"children":[{},{}]},
  {'year':"2016","ticket":455242712,"children":[{},{}]},
  {'year':"2017","ticket":442991687,"children":[{},{}]},
  {'year':"2018","ticket":557618269,"children":[{},{}]}
]}

var o14=d3.csv("2014Oscar.csv")
var t14=d3.csv("2014Top.csv")
var o15=d3.csv("2015Oscar.csv")
var t15=d3.csv("2015Top.csv")
var o16=d3.csv("2016Oscar.csv")
var t16=d3.csv("2016Top.csv")
var o17=d3.csv("2017Oscar.csv")
var t17=d3.csv("2017Top.csv")
var o18=d3.csv("2018Oscar.csv")
var t18=d3.csv("2018Top.csv")

Promise.all([o14,t14,o15,t15,o16,t16,o17,t17,o18,t18]).then(function(d){
  for(i=0;i<d.length;i++){
  if (i%2!=0){
    dataset.children[(i-1)/2].children[0].name="top"
    dataset.children[(i-1)/2].children[0].children=[]
    var tsum=0
    d[i].forEach(function(a){
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":a.Genre}
        dataset.children[(i-1)/2].children[0].children.push(ob)})
    dataset.children[(i-1)/2].children[0].ticket=tsum
    }
  else{
    dataset.children[i/2].children[1].name="oscar"
    dataset.children[i/2].children[1].children=[]
    var tsum=0
    d[i].forEach(function(a){
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":a.Genre}
        dataset.children[i/2].children[1].children.push(ob)})
    dataset.children[i/2].children[1].ticket=tsum
}
  }

  var screen={width:1700,height:1300};
  var margin = {top: 150, right: 100, bottom: 150, left: 100};
  var w = screen.width - margin.left - margin.right;
  var h = screen.height - margin.top - margin.bottom;


var pack=d3.pack()
.size([w,h])
.padding(4)

var root=d3.hierarchy(dataset)
            .sum(function(d){
              return d.ticket})
            .sort(function(a,b){
              return b.ticket-a.ticket})

let nodes=pack(root).descendants()
console.log(nodes)

// color scale
var layer2=d3.scaleOrdinal()
.domain([2014,2015,2016,2017,2018])
.range(["#A7BCC6","#CFBCCC","#B9B4B4","#C4AF89","#F3CC89"])

// zoom and drag
/*var zoom=d3.zoom()
.scaleExtent([1 / 2, 8])
.on('zoom', zoomfunction)*/

var drag=d3.drag()
        .on("drag", dragfunction)

var svg=d3.select("body").append("svg")
.attr('width', screen.width)
.attr('height', screen.height)
//.call(zoom)

var innerSpace=svg.append("g").attr('class', 'inner_space')
.call(drag)

var zoomfunction=function(){
  innerSpace.attr("transform", d3.event.transform)
}

var dragfunction=function(dataset){
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y)

}



// all circles
innerSpace.selectAll("circle").data(nodes.slice(1))
.enter()
    .append('circle')
    .attr('cx', function(d){return d.x-200})
    .attr('cy', function(d){return d.y-45})
    .attr('r',function(d){return d.r} )
    .style('fill', function(d){
      if (d.height==3){
        return "white"
      }
      else if (d.height==2){
        return "#A7BCC6"
      }
      else if (d.height==1){
        if (d.data.name=="top"){return "#F9B4A4"}
        else {
          return "#D5909C"
        }
      }
      else if (d.height==0){
        return "white"
      }
    })
    .attr('fill-opacity', 0.5)
    .on('mouseover', function(){
      var a=d3.select(this)
      a.style('fill-opacity', 1)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
    })
    .on('mouseout', function(){
      var a=d3.select(this)
      a.style('fill-opacity', 0.5)
      .attr('stroke', 'none')
    })
})
