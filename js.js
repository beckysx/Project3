var dataset={"name":"Five years","ticket":2348091312,"children":[
  {'year':"2014","ticket":378415107,"children":[{'year':"2014"},{'year':"2014"}]},
  {'year':"2015","ticket":513823537,"children":[{'year':"2015"},{'year':"2015"}]},
  {'year':"2016","ticket":455242712,"children":[{'year':"2016"},{'year':"2016"}]},
  {'year':"2017","ticket":442991687,"children":[{'year':"2017"},{'year':"2017"}]},
  {'year':"2018","ticket":557618269,"children":[{'year':"2018"},{'year':"2018"}]}
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

// title
var title=d3.select("body").append("svg")
.attr('id', 'title')
.attr('height', 250)
.attr('width', 1000)

title.append("rect")
    .attr('x',0)
    .attr('y',25)
    .attr('width', 950)
    .attr('height', 225)
    .style('fill', 'white');

title.append("text")
.attr('x', '20')
.attr('y', '90')
.text("Top-Sellings")
.attr('class', 'title')

title.append("text")
.attr('x', '300')
.attr('y', '220')
.text("VS")
.style('font-size', 190)
.style('font-family', 'Abril Fatface')

title.append("text")
.attr('x', '580')
.attr('y', '220')
.text("Oscar Nominees")
.attr('class', 'title')

var getScatterData=function(dataset,year){
  var newDataset=[]
  dataset.forEach(function(d){
    if (d.data.year==year){
      var movieGenre=d.data.genre.split(",")
      var repetition=movieGenre.length
      for(i=0;i<repetition;i++){
        var newD={"rank":d.data.rank,
                  "name":d.data.name,
                  "ticket":d.data.ticket,
                  "rate":d.data.rate,
                  "group":d.data.type,
                  "year":d.data.year}
        var genreArray=d.data.genre.split(",")
        newD.genre=genreArray[i]
        newDataset.push(newD)
      }
    }
  })
  return newDataset
}

var getAllScatterData=function(dataset){
  var newDataset=[]
  dataset.forEach(function(d){
      var movieGenre=d.data.genre.split(",")
      var repetition=movieGenre.length
      for(i=0;i<repetition;i++){
        var newD={"rank":d.data.rank,
                  "name":d.data.name,
                  "ticket":d.data.ticket,
                  "rate":d.data.rate,
                  "group":d.data.type,
                  "year":d.data.year}
        var genreArray=d.data.genre.split(",")
        newD.genre=genreArray[i]
        newDataset.push(newD)
      }
  })
  return newDataset
}

Promise.all([o14,t14,o15,t15,o16,t16,o17,t17,o18,t18])
.then(function(d){
  // get data
  for(i=0;i<d.length;i++){
  if (i%2!=0){
    dataset.children[(i-1)/2].children[0].name="top"
    dataset.children[(i-1)/2].children[0].children=[]
    var tsum=0
    d[i].forEach(function(a){
      var genre=a.Genre.replace(/\s*/g,"")
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"rank":a.ID,"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":genre,"year":parseInt(a.Year),"type":a.Type}
        dataset.children[(i-1)/2].children[0].children.push(ob)})
    dataset.children[(i-1)/2].children[0].ticket=tsum
    }
  else{
    dataset.children[i/2].children[1].name="oscar"
    dataset.children[i/2].children[1].children=[]
    var tsum=0
    d[i].forEach(function(a){
      var genre=a.Genre.replace(/\s*/g,"")
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"rank":a.ID,"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":genre,"year":parseInt(a.Year),"type":a.Type}
        dataset.children[i/2].children[1].children.push(ob)})
    dataset.children[i/2].children[1].ticket=tsum
}
  }

  var screen={width:850,height:800};
  var margin = {top: 50, right: 50, bottom: 50, left: 500};
  var w = screen.width - margin.left - margin.right;
  var h = screen.height - margin.top - margin.bottom;

  var svg=d3.select("body").append("svg")
  .attr('width', screen.width)
  .attr('height', screen.height)
  .attr('id', 'window')

    // circle packing
    var pack=d3.pack()
    .size([950,800])
    .padding(2)
    var root=d3.hierarchy(dataset)
                .sum(function(d){
                  return d.ticket})
                .sort(function(a,b){
                  return b.ticket-a.ticket})
    let nodes=pack(root).descendants()
    console.log(nodes)

    // color scale
    var highScale=d3.scaleLinear()
        .domain([7.5, 8.5])
        .range([0, 1]);
    var lowScale=d3.scaleLinear()
        .domain([5.5, 7.5])
        .range([0, 1]);
    var redStart="#F7E2E5"
    var redEnd="#B23143"
    var redScale = d3.interpolate(redStart,redEnd)
    var blueStart="#50B2D8"
    var blueEnd="#F7E2E5"
    var blueScale = d3.interpolate(blueStart,blueEnd)

    var groupScale=d3.scaleLinear()
        .domain([6.9, 7.7])
        .range([0.2, 1])


    // color legend
    var lowGradient=
    svg.append("defs").append("linearGradient")
    .attr('id', 'lowGradient')
    .attr('x1', "0%")
    .attr('y1', "0%")
    .attr('x2', "100%")
    .attr('y2', "0%")

    lowGradient.append("stop")
    .attr('offset', "0%")
    .attr('stop-color', blueStart.toString())

    lowGradient.append("stop")
    .attr('offset', "100%")
    .attr('stop-color', blueEnd.toString())

    var highGradient=
    svg.append("defs").append("linearGradient")
    .attr('id', 'highGradient')
    .attr('x1', "0%")
    .attr('y1', "0%")
    .attr('x2', "100%")
    .attr('y2', "0%")

    highGradient.append("stop")
    .attr('offset', "0%")
    .attr('stop-color', redStart.toString())

    highGradient.append("stop")
    .attr('offset', "100%")
    .attr('stop-color', redEnd.toString())

    var groupGradient=
    svg.append("defs").append("linearGradient")
    .attr('id', 'groupGradient')
    .attr('x1', "0%")
    .attr('y1', "0%")
    .attr('x2', "100%")
    .attr('y2', "0%")

    groupGradient.append("stop")
    .attr('offset', "0%")
    .attr('stop-color', "#BFBFBF")

    groupGradient.append("stop")
    .attr('offset', "100%")
    .attr('stop-color', "#000000")

    // filmcolor legend
    var filmcolor=svg.append("g").attr('id', 'filmcolor')
    filmcolor.append("text")
    .attr('x', '10')
    .attr('y', '25')
    .text("Single Movie Rating")
    .attr('class', 'explain')

    filmcolor.append("rect")
        .attr('x',130 )
        .attr('y',10 )
        .attr('width', 100)
        .attr('height', 20)
        .style('fill', 'url(#lowGradient')
    filmcolor.append("rect")
        .attr('x',230 )
        .attr('y',10 )
        .attr('width', 100)
        .attr('height', 20)
        .style('fill', 'url(#highGradient')

    var filmColorScale=d3.scaleLinear()
        .domain([5.5, 8.5])
        .range([130, 330]);

    var filmColorAxis=d3.axisBottom(filmColorScale)
                      .tickSize(2)
                      .ticks(5)

    svg.append("g").attr('id', 'filmcolorAxis').call(filmColorAxis)
    .attr('transform', 'translate(' + 0 + ',' + 32 + ')')


    // groupcolor legend
    var groupcolor=svg.append("g").attr('id', 'groupcolor')

    groupcolor.append("text")
    .attr('x', 360)
    .attr('y', 25)
    .text("Group Average Rating")
    .attr('class', 'explain')

    groupcolor.append("rect")
        .attr('x',510 )
        .attr('y',10 )
        .attr('width', 200)
        .attr('height', 20)
        .style('fill', 'url(#groupGradient)')

    var groupColorScale=d3.scaleLinear()
        .domain([6.9, 7.7])
        .range([510, 710]);

    var groupColorAxis=d3.axisBottom(groupColorScale)
                      .tickSize(2)

    svg.append("g").attr('id', 'groupcolorAxis').call(groupColorAxis)
    .attr('transform', 'translate(' + 0 + ',' + 32 + ')')

    // zoom and drag

    var zoomfunction=function(){
      d3.select(this).selectAll("circle").attr("transform",d3.event.transform)
    }
    var zoom=d3.zoom()
    .scaleExtent([1,5])
    .on('zoom', zoomfunction)

    var drag=d3.drag()
               .on("drag", function(d){
                 this.x = this.x || 0;
                this.y = this.y || 0;
                this.x += d3.event.dx;
                this.y += d3.event.dy;
                d3.select(this).attr('transform', 'translate(' + this.x + ',' + this.y + ')')
                })
    for (i=0;i<5;i++){
      var g=svg.append("g").attr("id",function(){return "y"+(2014+i)})
      g.call(drag)
      g.call(zoom)
      }

    // draw circles
    nodes.slice(1).forEach(function(d){

        d3.select("#y"+d.data.year)
        .append('circle')
        .attr('cx', d.x-100)
        .attr('cy', d.y+20)
        .attr('r',d.r)
        .style('fill', function(){
          if (d.height==2){return "gray"}
          else if (d.height==1){return "black"}
          else if (d.height==0){
            if (d.data.rate<=7.5){
              return blueScale(lowScale(d.data.rate))
            }
            else {
              return redScale(highScale(d.data.rate))
            }
            }
        })
        .attr('fill-opacity', function(){
          if (d.height==2){return 0.3}
          else if (d.height==1){
            var rateArray=d.children.map(function(a){return parseInt(a.data.rate)})
            var rateSum=rateArray.reduce(function(a,b){
              return a+b
            })
            var rateAve=rateSum/rateArray.length
            return groupScale(rateAve)
          }
          else if (d.height==0){return 1}
    })
        .attr('class', function(){
          if (d.height==2){return "big"}
        })
        .attr('id', function(){
          if(d.height==1){
            return 'circle'+d.data.year+d.data.name
          }
          else if (d.height==0) {
            var a=d.data.name.replace(/\.*\(*\)*\:*\-*\s*/g,"")
            return 'circle'+a+d.data.type
          }
          else{
            return "big"+d.data.year
          }
        })
        .attr('class', 'y'+d.data.year)
        .on('mouseover', function(){
          var a=d3.select(this)
          .attr('stroke', '#FF9811')
          .attr('stroke-width', 2)
          var check=d3.select(this).attr('id')
          if(check.slice(0,3)!="big"){
            var b=d3.select(this).attr('id').replace("circle","")
            var group=d3.select('#g'+b)
            var y=group.select("rect").attr('y')
            var dy=260-y
            d3.select("#info").selectAll("g")
            .transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr('transform', 'translate(' + 0 + ',' + dy + ')')
          }

        })
        .on('mouseout', function(){
          var a=d3.select(this).attr('stroke', 'none')
      })
        .on("click",function(){

        })
      })


    // information part
    var infowindow=d3.select("body").append("svg")
    .attr('id', 'infowindow')
    .attr('width', 460)
    .attr('height', 1000)

    var infoscreen={width:460,height:1000};
    var m = {left: 30, right: 30};
    var width = infoscreen.width - m.left - m.right;

    var info=d3.select("body").append("svg")
    .attr('id', 'info')
    .attr('width', infoscreen.width)
    .attr('height', infoscreen.height)
    .attr('clip-path', 'url(#cover)')

    info.append("clipPath")
    .attr('id', 'cover')
    .append('rect')
    .attr('x', 40)
    .attr('y', 260)
    .attr('width', width)
    .attr('height',infoscreen.height)

    infowindow.append('rect')
        .attr('x',120 )
        .attr('y',0 )
        .attr('width', 250)
        .attr('height', 250)
        .style('fill', 'white');

    infowindow.append("svg:image")
    .attr('xlink:href', function(){return "d1.png"})
    .attr('x', 120)
    .attr('y', 0)
    .attr('width', 250)
    .attr('height', 250)

    // decoration
    infowindow.append("rect")
        .attr('x', 0)
        .attr('y', 250)
        .attr('width', 460)
        .attr('height',750)
        .style('fill', 'black');

    for (i=0;i<30;i++){
      infowindow.append("rect")
          .attr('x', 10)
          .attr('y', function(){
            return 260+i*25
          })
          .attr('width', 10)
          .attr('height',10)
          .style('fill', function(){
            if(i<11){
              return '#FF9811'
            }
            else{return "white"}
          })}
    for (i=0;i<30;i++){
      infowindow.append("rect")
          .attr('x', 440)
          .attr('y', function(){
            return 260+i*25
          })
          .attr('width', 10)
          .attr('height',10)
          .style('fill', function(){
            if(i<11){
              return '#FF9811'
            }
            else{return "white"}
          })}

    // Actrual Information
    nodes.slice(6).forEach(function(d,i){
      if(d.height==1){
        var baseline=260+i*260
        var group=info.append("g").attr('id', function(){
          return "g"+d.data.year+d.data.name
        })

        // info background
        group.append("rect")
            .attr('x',30 )
            .attr('y',baseline)
            .attr('width', width)
            .attr('height', 250)
            .attr('fill', 'white')
        // info title
        group.append("text")
        .attr('x',60)
        .attr('y', baseline+30)
        .text('Group Information')
        .attr('class', 'infoTitle')
        // more details
            //year
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+60)
            .text(function(){
              var year=d.data.year
              return "Year: "+year
            })
            .attr('class', 'detail')
            // group type
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+90)
            .text(function(){
              var type=d.data.name
              if(type=="top"){return "Group Type: Top-Sellings"}
              else{return "Group Type: Oscar Nominees"}
            })
            .attr('class', 'detail')
            //Average tickets
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+120)
            .text(function(){
              var ticketSum=d.data.ticket
              var movienum=d.children.length
              var ticketAve=Math.round(ticketSum/movienum)
              return "Average Tickets Sold: "+ ticketAve
            })
            .attr('class', 'detail')
            //Average Rating
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+150)
            .text(function(){
              var rateArray=d.children.map(function(a){return parseInt(a.data.rate)})
              var rateSum=rateArray.reduce(function(a,b){
                return a+b
              })
              var rateAve=(rateSum/rateArray.length).toFixed(2)
              return "Average Movie Rating: "+ rateAve
            })
            .attr('class', 'detail')

      }
      else{
        var baseline=260+i*260
        var group=info.append("g").attr('id', function(){
          var a=d.data.name.replace(/\.*\(*\)*\:*\-*\s*/g,"")
          return "g"+a+d.data.type
        })

        // info background
        group.append("rect")
            .attr('x',30 )
            .attr('y',baseline)
            .attr('width', width)
            .attr('height', 250)
            .attr('fill', 'white')

        // info title
        group.append("text")
        .attr('x',80)
        .attr('y', baseline+30)
        .text('Movie Information')
        .attr('class', 'infoTitle')

        // more details
            //year
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+60)
            .text(function(){
              var year=d.data.year
              return "Year: "+year
            })
            .attr('class', 'detail')

            // group type
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+90)
            .text(function(){
              var type=d.data.type
              var rank=d.data.rank
              if(type=="top"){return "Top-Sellings"}
              else if (type=="oscar"&&rank=="1") {
                return "Best Picture Winner!"
              }
              else{return "Best Picture Nominees"}
            })
            .attr('class', 'detail')

            //Name
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+120)
            .text(function(){
              var name=d.data.name
              return "Name: "+ name
            })
            .attr('class', 'detail')

            //tickets
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+150)
            .text(function(){
              var ticket=d.data.ticket
              return "Tickets Sold: "+ ticket
            })
            .attr('class', 'detail')
            //Rating
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+180)
            .text(function(){
              var rate=d.data.rate
              return "Rating: "+ rate+"/10"
            })
            .attr('class', 'detail')
            //Genre
            group.append("text")
            .attr('x', 80)
            .attr('y', baseline+210)
            .text(function(){
              var genre=d.data.genre
              return "Genre: "+genre
            })
            .attr('class', 'detail')


      }
    })

    // Scatterplot part
    var year="all"
    var scatterscreen={width:1350,height:600}
    var sm = {top: 150, right: 10, bottom: 30, left: 10}
    var swidth = scatterscreen.width - sm.left - sm.right
    var sheight = scatterscreen.height - sm.top - sm.bottom;

    var scatterSvg=d3.select("body").append("svg")
    .attr('height', scatterscreen.height)
    .attr('width', scatterscreen.width)
    .attr('id', 'scatterSvg')

    scatterSvg.append("rect")
        .attr('x', sm.left)
        .attr('y', sm.top-20)
        .attr('width', swidth)
        .attr('height', sheight+30)
        .attr('fill-opacity', 1)
        .style('fill', '#111')

    for(i=0;i<8;i++){
      scatterSvg.append("line")
          .attr('x1', 35)
          .attr('y1', function(){return 150+i*60})
          .attr('x2', 1330)
          .attr('y2',function(){return 150+i*60})
          .attr('stroke', 'grey')
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '10,5')

    }



        //button click change
        for(i=0;i<6;i++){
          //click button
          scatterSvg.append("svg:image")
          .attr('xlink:href', function(){
            if(i==5){return "close.png"}
            else{return "open.png"}
          })
          .attr('x', function(){return sm.left+i*170})
          .attr('y', function(){
            if(i==5){return 8}
            else{return 0}
          })
          .attr('width', 120)
          .attr('height', 120)
          .attr('id', function(){
            if(i==5){return "boardall"}
            else{return "board"+(2014+i)}
            })
          .on('mouseover', function(){
            var clickedid=d3.select(this).attr('id')
            var clickedyear=clickedid.slice(5)
            if (clickedyear!=year.toString()){
              d3.select(this)
              .attr('xlink:href', "close.png")
              .attr('y', 8)
            }
            else if (clickedyear=="all") {
              d3.select(this)
              .attr('xlink:href', "close.png")
              .attr('y', 8)
            }


          })
          .on('mouseout',function(){
            var clickedid=d3.select(this).attr('id')
            var clickedyear=clickedid.slice(5)
            if (clickedyear!=year.toString()){
              d3.select(this)
              .attr('xlink:href', "open.png")
              .attr('y', 0)
            }

          })
          .on('click',function(){
            // former button
            d3.select("#board"+year)
            .attr('xlink:href', "open.png")
            .attr('y', 0)
            //new button change
            d3.select(this)
            .attr('xlink:href', "close.png")
            .attr('y', 8)
            var clickedid=d3.select(this).attr('id')
            var clickedyear=clickedid.slice(5)
            var circleNum=d3.select("#scatterSvg")
            .selectAll("circle").size()

            if(clickedyear!="all"){
              var yeari=year
              year=parseInt(clickedyear)

              var scatterData=getScatterData(nodes.slice(16),year)
              if (scatterData.length>circleNum){
                var circles=scatterSvg.selectAll("circle")
                .data(scatterData)

                circles.enter()
                .append('circle')
                .attr('cx',function(d){return xScale(d.genre)})
                .attr('cy', function(d){return yScale(d.rate)})
                .attr('r',4)
                .style('fill', function(d){
                  if(d.group=="top"){return "#009392"}
                  else{return "#ca562c"}
                })
                .merge(circles)
                .transition()
    						.duration(1000)
                .attr('cx',function(d){return xScale(d.genre)})
                .attr('cy', function(d){return yScale(d.rate)})
                .attr('r',4)
                .style('fill', function(d){
                  if(d.group=="top"){return "#009392"}
                  else{return "#ca562c"}
                })
              }
              else if (scatterData.length<circleNum) {
                var circles=scatterSvg.selectAll("circle")
                .data(scatterData)

                circles.exit()
                .remove()
                .merge(circles)
                .transition()
    						.duration(1000)
                .attr('cx',function(d){return xScale(d.genre)})
                .attr('cy', function(d){return yScale(d.rate)})
                .attr('r',4)
                .style('fill', function(d){
                  if(d.group=="top"){return "#009392"}
                  else{return "#ca562c"}
                })

              }



            }
            else{
              var scatterData=getAllScatterData(nodes.slice(16))

              var circles=scatterSvg.selectAll("circle")
              .data(scatterData)

              circles.enter()
              .append('circle')
              .attr('cx',function(d){return xScale(d.genre)})
              .attr('cy', function(d){return yScale(d.rate)})
              .attr('r',4)
              .style('fill', function(d){
                if(d.group=="top"){return "#009392"}
                else{return "#ca562c"}
              })
              .merge(circles)
              .transition()
  						.duration(1000)
              .attr('cx',function(d){return xScale(d.genre)})
              .attr('cy', function(d){return yScale(d.rate)})
              .attr('r',4)
              .style('fill', function(d){
                if(d.group=="top"){return "#009392"}
                else{return "#ca562c"}
              })

            }



          } )

          // text on board
          scatterSvg.append("text")
          .attr('x', function(){
            if(i==5){return sm.left+25+i*170}
            else{return sm.left+40+i*170}})
          .attr('y', 85)
          .text(function(){
            if(i==5){return "5 Years"}
            else{return 2014+i}})
          .attr('class', 'boardYear')
        }

        //draw the scatterplot
            //get movie genre list
            var genreArray=[]
            nodes.slice(16).forEach(function(d){
              var movieGenre=d.data.genre.split(",")
              movieGenre.forEach(function(genre){
                if(genreArray.includes(genre)==false){
                  genreArray.push(genre)
                }
              })
            })

            // scales
            var xRange=[]
            for (i=0;i<18;i++){
              var length=swidth-20
              var dx=length/18
              var middleX=Math.round(sm.right+10+dx/2+i*dx)
              xRange.push(middleX)
            }

            var yScale=d3.scaleLinear()
                .domain([5.5,9])
                .range([scatterscreen.height-sm.bottom,sm.top]);
            var xScale=d3.scaleOrdinal()
            .domain(genreArray)
            .range(xRange)


            // axis
            var xAxis=d3.axisLeft(yScale)
                              .tickSize(0)

            scatterSvg.append("g")
            .attr('id', 'scatterXaxis')
            .call(xAxis)
            .attr('stroke', 'white')
            .attr('transform', 'translate(' + 30 + ',' + 0 + ')')

            scatterSvg.append("g").selectAll("text")
            .data(genreArray)
            .enter()
            .append("text")
            .attr('text-anchor', 'middle')
            .attr('x', function(d){return xScale(d)})
            .attr('y', scatterscreen.height-5)
            .text(function(d){return d})
            .attr('class', 'yaxisText')


            //draw circles
            var scatterData=getAllScatterData(nodes.slice(16))

            scatterSvg.selectAll("circle")
            .data(scatterData)
            .enter()
            .append('circle')
            .attr('cx',function(d){return xScale(d.genre)})
            .attr('cy', function(d){return yScale(d.rate)})
            .attr('r',4)
            .style('fill', function(d){
              if(d.group=="top"){return "#009392"}
              else{return "#ca562c"}
            })





})
