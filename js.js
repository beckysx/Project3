var dataset=[
{'year':"2014","ticket":378415107,"children":[{},{}]},
{'year':"2015","ticket":513823537,"children":[{},{}]},
{'year':"2016","ticket":455242712,"children":[{},{}]},
{'year':"2017","ticket":442991687,"children":[{},{}]},
{'year':"2018","ticket":557618269,"children":[{},{}]}
]
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
    dataset[(i-1)/2].children[0].name="top"
    dataset[(i-1)/2].children[0].children=[]
    var tsum=0
    d[i].forEach(function(a){
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":a.Genre}
        dataset[(i-1)/2].children[0].children.push(ob)})
    dataset[(i-1)/2].children[0].ticket=tsum
    }
  else{
    dataset[i/2].children[1].name="oscar"
    dataset[i/2].children[1].children=[]
    var tsum=0
    d[i].forEach(function(a){
      tsum=tsum+parseInt(a.TicketsSold)
        var ob={"name":a.Name,"ticket":parseInt(a.TicketsSold),"rate":a.Rate,"genre":a.Genre}
        dataset[i/2].children[1].children.push(ob)})
    dataset[i/2].children[1].ticket=tsum
}
  }
console.log(dataset)

var pack=d3.pack()
.size([1000,700])

var root=d3.hierarchy(dataset)
.sum(function(d){
  return d.value
})
 var nodes=pack.nodes
})
