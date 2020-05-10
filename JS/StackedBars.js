//Vado a caricare i file esterni presenti all'interno del file json

var data;
d3.json("/home/luca/Scrivania/First_Project_infoVis/DataSet/dataset.json", function(d)){
    data = d;

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
    .range([height, o]);

//Settaggio dei colori

var colors = ["#24b41f", "#b4621f", "#b41f1f", "#1fa8b4", "#1f24b4"];




}