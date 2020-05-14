//Vado a caricare i file esterni presenti all'interno del file json

var data;
d3.json("(/home/luca/Scrivania/InfoVis_First_Project/DataSet/dataset.json", function(d){
    data = d
    print (data);


//Definisco i Margini

var margin = {

    top : 20,
    right : 40,
    bottom : 40,
    left : 80
},

//Quindi vado a calcolare la larghezza e l'altezza del mio "Foglio"

width = 1300 - margin.left - margin.right, //larghezza
height = 615 - margin.top - margin.bottom; //altezza

//Ora vado a definire  SVG

var svg = d3.select(".viz-portfolio_delinquent-status").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Trasposizione dei dati su un layers

var dataset = d3.layout.stack()(["Velocità", "Tiro", "Passaggio", "Dribbling", "Fisico"].map(function(stat){
    return data.map(function(d){
        return {name: d.Nome, y: +d[stat], current: stat};
    });

}));

//Settaggio della x

var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d){ return d.name;}))
    .rangeRoundBands([0, width], .4);

//Settaggio dell y

var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

//Settaggio dei colori

var colors = ["#24b41f", "#b4621f", "#b41f1f", "#1fa8b4", "#1f24b4"];

//Ora passiamo alla fase di definizione e disegno degli assi

var yAxis = d3.svg.axis()
    .scale(y)
    .orient(left)
    .ticks(10)
    .tickSize(-width, 0 ,0)
    .tickFormat(function(d){return d});

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    call(xAxis);

//Funzione che fa la media tra la somma delle statistiche totale e il numero delle statistiche stesse 
//ed approssima tale media per eccesso

var sum = 0;
var mean = 0;
dataset.forEach(function(d, i){
    sum += d[i].y
    mean = sum / 5
    alert(Math.cell(mean))//Così da avere valori compresi tra 0 e 100 sull'asse delle y

});

//Ora devo raggruppare per parametro per poi fare un rettangolo per ciascun gruppo definito
 var groups = svg.selectAll(".value")
    .data(dataset)
    .enter().append("g")
    .attr("class","value")
    .attr('fill', function(d, i){
        return colors[i];
    })

var rect = groups.selectAll("rect")
    .data(function(d) {
        return d;
    })

.enter()
.append("rect")
.attr("x", function(d){
    return x(d.name);

})

.attr("y", function(d){
    return y(d.y0 + d.y);

})
.attr("height", function(d) {return y(d.y0) - y(d.y0 + d.y);
})
.attr("width", x.rangedBar())
.on("mouseover", function(){
    tooltip.style("display", null);
})
.on("mouseout", function() {
    tooltip.style("display", "none");
})
.on("mousemove", function(d){
    var xPosition = d3.mouse(yhis)[0] -15;
    var yPosition = d3.mouse(this)[1] -25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text(d.y);
})
.on("click", function(d){
    return barChanged(d);
})

var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");


// Creazione della legenda per rendere il grafico intuibile
var legend = svg.selectAll(".legend")
.data(colors)
.enter().append("g")
.attr("class", "legend")
.attr("transform", function (d, i) {
              return "translate(" + i * -70 + ",283)";
 })

legend.append("rect")
.attr("x", width - 453)
.attr("width", 10)
.attr("y", 295)
.attr("height", 10)
.style("fill", function(d, i) {
    return colors.reverse().slice()[i];
})

legend.append("text")
.attr("x", width - 440)
.attr("y", 300)
.attr("width", 40)
.attr("dy", ".35em")
.style("text-anchor", "start")
.text(function(d, i) {
  switch (i) {
    case 0: return "Velocità";
    case 1: return "Tiro";
    case 2: return "Passaggio";
    case 3: return "Dribbling";
    case 4: return "Fisico";
  }
});

//Ora qui andremo ad implementare la funzione richiesta

//function barChanged(d){

//}





//Qui dop la transizione ci sarà un riordino del dataset con i valori corretti




});

 
