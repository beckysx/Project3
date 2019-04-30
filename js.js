var dataset=[{},{},{},{},{}]
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
    dataset[(i-1)/2].top=[]
    d[i].forEach(function(a){
        var ob={"name":a.Name,"ticket":a.TicketsSold,"rate":a.Rate,"genre":a.Genre}
        dataset[(i-1)/2].top.push(ob)})
    }
  else{
    dataset[i/2].oscar=[]
    d[i].forEach(function(a){
        var ob={"name":a.Name,"ticket":a.TicketsSold,"rate":a.Rate,"genre":a.Genre}
        dataset[i/2].oscar.push(ob)})
}
  }
})
