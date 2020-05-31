//Attenzione: in Chrome la visualizzazione dà problemi solo se index.html viene aperto direttamente, mentre se viene eseguito un server http su una specifica porta essa viene eseguita in modo corretto

//Caricamento dati esterni tramite file JSON
var data;
d3.json("data/dataset.json", function(d) {
    data = d;

//Margini 
var margin = {
				top: 20,
				right: 40,
				bottom: 40,
				left: 80
			},

width = 1300 - margin.left - margin.right,  //Larghezza
height = 615 - margin.top - margin.bottom;  //Altezza

//SVG
var svg = d3.select(".viz-portfolio-delinquent-status").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//POrtare i dati dal dataset sul layout
var dataset = d3.layout.stack()(["Velocità", "Tiro", "Passaggio", "Dribbling", "Fisico"].map(function(stat) {
return data.map(function(d) { 
    return {name: d.Nome, y: +d[stat], current: stat};
  });
}));

//Settaggio per l'asse delle x
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.name; }))
  .rangeRoundBands([0, width], .4);

//Settaggio per l'asse delle y
var y = d3.scale.linear()
  .domain([0,100])
  .range([height, 0]);

//Settaggio colori, poi in seguito li devo cambiare
var colori = ["#1fb4b2", "#2a2d2e", "#ba1849", "#1ad94a", "#350af5"];


// Disegno delgi assi
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

//Funzione di supporto che fa la somma totale del punteggio di ogni statistica per ogni istanza
//In seguito poi cambiare con la media, basta dividere la somma per 5, sistemare la visaione corretta del grafico con height100 e non 600
var sum = 0;
dataset.forEach(function(d, i){
  sum += d[i].y

});	
setOfId = ["a", "b", "c", "d", "e"]

//Creazione di gruppi per ogni parametro e rettangoli per ogni gruppo
var groups = svg.selectAll(".value")
  .data(dataset)
  //Senza questo comando non veranno visualizzati i gruppi di rettangoli
  .enter().append("g")
  .attr("class", "value")
  //Questo attributi per assegnare ai rettangoli i colori relativi senno sono tutti neri
  .attr('fill', function(d, i) { 
		return colori[i];
  })
  //Qui vado ad assegnare un id per ciascun gruppo, dove un gruppo è una riga contentente i 10 nomi
  .attr("id", function(d,i){
    return setOfId[i];
  })
 

	
var rect = groups.selectAll("rect")
  .data(function(d) {
	  return d;
  })
  //OK, qui si associa ogni rettangolo al nome corrsipondente sull'asse x, se omesso si sposta un singolo gruppo di rettangoli verso sinistra con nesssun nome associato
  .enter()
  .append("rect")
  .attr("x", function(d) {
	 return x(d.name);
  })

  //Ok, qui associa i rettangoli all'asse y ovvero al valore corrispondente, se omesso vi saranno tutti rettangoli sull'asse 0 di y quindi in cima
  .attr("y", function(d) {
	  return y((d.y0+ d.y)/5);//questa azione viene effettuata per rappreesentare l'overall del giocatore compreso tra 0 e 100
   })
   //Questo attributo se omesso non farà visualizzare nessun rettangolo perchè definisce l'altezza dei rettangolo stessi
  .attr("height", function(d) { 
	  return (y(d.y0) - y(d.y0+ d.y))/5;//questa azione viene effettuata per rappreesentare l'overall del giocatore compreso tra 0 e 100
   })
  .attr("width", x.rangeBand())

  
 
  .on("mouseover", function() { //Effetto opacità e contorno per evidenziare un certo rettangolo
	  d3.select(this).style("opacity", 0.75);
      d3.select(this).attr("stroke","Black").attr("stroke-width",0.8);
      tooltip.style("display", null); })
  .on("mouseout", function() { //fine effetto opacità e contorno
	  d3.select(this).style("opacity", 1);
      d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
      tooltip.style("display", "none"); })
  // .on("mousemove", function(d) { //Display Nome statistica, valore assoluto e percentuale rispetto al totale
  //     var xPosition = d3.mouse(this)[0] - 15;
  //     var yPosition = d3.mouse(this)[1] - 25;
  //     tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
  //     tooltip.select("text").text(d.current + ":  " + d.y  + "\n" + " (" + (Math.round((d.y/sum)*100)) + "%)");
  // })
  // .on("click", function(d) {

  //   // switchRect();
  //   // tooltip.style('display', 'none');
  //   // update();
  //  change(d);
  // }) 
  
  
//Preparazione del tooltip, inizialmente il display è nascosto
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 110)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 54)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

// Disegno della Legenda
var legend = svg.selectAll(".legend")
  .data(colori)
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
	  return colori.reverse().slice()[i];
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
  

var idrect1 = ["r1a", "r1b", "r1c", "r1d", "r1e", "r1f", "r1g", "r1h", "r1i", "r1l"];
var idrect2 = ["r2a", "r2b", "r2c", "r2d", "r2e", "r2f", "r2g", "r2h", "r2i", "r2l"];
var idrect3 = ["r3a", "r3b", "r3c", "r3d", "r3e", "r3f", "r3g", "r3h", "r3i", "r3l"];
var idrect4 = ["r4a", "r4b", "r4c", "r4d", "r4e", "r4f", "r4g", "r4h", "r4i", "r4l"];



var g1 = svg.selectAll("#a.value")
      .data(dataset);
var g2 = svg.selectAll("#b.value")
      .data(dataset);
var g3 = svg.selectAll("#c.value")
      .data(dataset);
var g4 = svg.selectAll("#d.value")
      .data(dataset);

var r1 = g1.selectAll("#a.value rect")
.data(function(d){
    return d;
})
.attr("id", function(d,i){
  return idrect1[i]
})
.on("click", function(d){
  changer1r2(d);

})

var r2 = g2.selectAll("#b.value rect")
.data(function(d){
  return(d);
})
.attr("id", function(d,i){
  return idrect2[i];
})
.on("click", function(d){
  changer2r3(d);
})


var r3 = g3.selectAll("#c.value rect")
.data(function(d){
  return(d);
})
.attr("id", function(d,i){
  return idrect3[i];
})
.on("click", function(d){
   changer3r4(d);
})

var r4 = g4.selectAll("#d.value rect")
.data(function(d){
  return(d);
})
.attr("id", function(d,i){
  return idrect4[i];
})
// .on("click", function(d){
//    changer4r5(d);
// })

//Prima funzione: se si clicca sul rettangolo del primo gruppo si scambia con quello appartenente al secondo gruppo
function changer1r2(d){


  var heightr1a = parseInt(g1.select("#a.value #r1a").attr("height"));
  var heightr2a = parseInt(g2.select("#b.value #r2a").attr("height"));

  var heightr1b = parseInt(g1.select("#a.value #r1b").attr("height"));
  var heightr2b = parseInt(g2.select("#b.value #r2b").attr("height"));

  var heightr1c = parseInt(g1.select("#a.value #r1c").attr("height"));
  var heightr2c = parseInt(g2.select("#b.value #r2c").attr("height"));

  var heightr1d = parseInt(g1.select("#a.value #r1d").attr("height"));
  var heightr2d = parseInt(g2.select("#b.value #r2d").attr("height"));

  var heightr1e = parseInt(g1.select("#a.value #r1e").attr("height"));
  var heightr2e = parseInt(g2.select("#b.value #r2e").attr("height"));

  var heightr1f = parseInt(g1.select("#a.value #r1f").attr("height"));
  var heightr2f = parseInt(g2.select("#b.value #r2f").attr("height"));

  var heightr1g = parseInt(g1.select("#a.value #r1g").attr("height"));
  var heightr2g = parseInt(g2.select("#b.value #r2g").attr("height"));

  var heightr1h = parseInt(g1.select("#a.value #r1h").attr("height"));
  var heightr2h = parseInt(g2.select("#b.value #r2h").attr("height"));

  var heightr1i = parseInt(g1.select("#a.value #r1i").attr("height"));
  var heightr2i = parseInt(g2.select("#b.value #r2i").attr("height"));

  var heightr1l = parseInt(g1.select("#a.value #r1l").attr("height"));
  var heightr2l = parseInt(g2.select("#b.value #r2l").attr("height"));

  
  var r1a = g1.select("#a.value #r1a");
  var r2a = g2.select("#b.value #r2a");

  var r1b = g1.select("#a.value #r1b");
  var r2b = g2.select("#b.value #r2b");

  var r1c = g1.select("#a.value #r1c");
  var r2c = g2.select("#b.value #r2c");

  var r1d = g1.select("#a.value #r1d");
  var r2d = g2.select("#b.value #r2d");

  var r1e = g1.select("#a.value #r1e");
  var r2e = g2.select("#b.value #r2e");

  var r1f = g1.select("#a.value #r1f");
  var r2f = g2.select("#b.value #r2f");

  var r1g = g1.select("#a.value #r1g");
  var r2g = g2.select("#b.value #r2g");

  var r1h = g1.select("#a.value #r1h");
  var r2h = g2.select("#b.value #r2h");

  var r1i = g1.select("#a.value #r1i");
  var r2i = g2.select("#b.value #r2i");

  var r1l = g1.select("#a.value #r1l");
  var r2l = g2.select("#b.value #r2l");


  r1a.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2a) + ")")
  
  , r2a.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1a) +")");


  r1b.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2b) + ")")

  ,r2b.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1b) + ")");


  r1c.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2c) + ")")

  ,r2c.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1c) + ")");


  r1d.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2d) + ")")

  ,r2d.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1d) + ")");


  r1e.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2e) + ")")

  ,r2e.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1e) + ")");


  r1f.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2f) + ")")

  ,r2f.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1f) + ")");


  r1g.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2g) + ")")

  ,r2g.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1g) + ")");


  r1h.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2h) + ")")

  ,r2h.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1h) + ")");


  r1i.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2i) + ")")

  ,r2i.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1i) + ")");


  r1l.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr2l) + ")")

  ,r2l.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr1l) + ")");




}

//Prima funzione: se si clicca sul rettangolo del secondo gruppo si scambia con quello appartenente al terzo gruppo
function changer2r3(d){

  var heightr2a = parseInt(g2.select("#b.value #r2a").attr("height"));
  var heightr3a = parseInt(g3.select("#c.value #r3a").attr("height"));

  var heightr2b = parseInt(g2.select("#b.value #r2b").attr("height"));
  var heightr3b = parseInt(g3.select("#c.value #r3b").attr("height"));

  var heightr2c = parseInt(g2.select("#b.value #r2c").attr("height"));
  var heightr3c = parseInt(g3.select("#c.value #r3c").attr("height"));

  var heightr2d = parseInt(g2.select("#b.value #r2d").attr("height"));
  var heightr3d = parseInt(g3.select("#c.value #r3d").attr("height"));

  var heightr2e = parseInt(g2.select("#b.value #r2e").attr("height"));
  var heightr3e = parseInt(g3.select("#c.value #r3e").attr("height"));

  var heightr2f = parseInt(g2.select("#b.value #r2f").attr("height"));
  var heightr3f = parseInt(g3.select("#c.value #r3f").attr("height"));

  var heightr2g = parseInt(g2.select("#b.value #r2g").attr("height"));
  var heightr3g = parseInt(g3.select("#c.value #r3g").attr("height"));

  var heightr2h = parseInt(g2.select("#b.value #r2h").attr("height"));
  var heightr3h = parseInt(g3.select("#c.value #r3h").attr("height"));

  var heightr2i = parseInt(g2.select("#b.value #r2i").attr("height"));
  var heightr3i = parseInt(g3.select("#c.value #r3i").attr("height"));

  var heightr2l = parseInt(g2.select("#b.value #r2l").attr("height"));
  var heightr3l = parseInt(g3.select("#c.value #r3l").attr("height"));


  var r2a = g2.select("#b.value #r2a");
  var r3a = g3.select("#c.value #r3a");

  var r2b = g2.select("#b.value #r2b");
  var r3b = g3.select("#c.value #r3b");

  var r2c = g2.select("#b.value #r2c");
  var r3c = g3.select("#c.value #r3c");

  var r2d = g2.select("#b.value #r2d");
  var r3d = g3.select("#c.value #r3d");

  var r2e = g2.select("#b.value #r2e");
  var r3e = g3.select("#c.value #r3e");

  var r2f = g2.select("#b.value #r2f");
  var r3f = g3.select("#c.value #r3f");

  var r2g = g2.select("#b.value #r2g");
  var r3g = g3.select("#c.value #r3g");

  var r2h = g2.select("#b.value #r2h");
  var r3h = g3.select("#c.value #r3h");

  var r2i = g2.select("#b.value #r2i");
  var r3i = g3.select("#c.value #r3i");

  var r2l = g2.select("#b.value #r2l");
  var r3l = g3.select("#c.value #r3l");


  r2a.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3a) + ")")
  
  , r3a.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2a) +")");


  r2b.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3b) + ")")

  ,r3b.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2b) + ")");


  r2c.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3c) + ")")

  ,r3c.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2c) + ")");


  r2d.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3d) + ")")

  ,r3d.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2d) + ")");


  r2e.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3e) + ")")

  ,r3e.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2e) + ")");


  r2f.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3f) + ")")

  ,r3f.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2f) + ")");


  r2g.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3g) + ")")

  ,r3g.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2g) + ")");


  r2h.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3h) + ")")

  ,r3h.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2h) + ")");


  r2i.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3i) + ")")

  ,r3i.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2i) + ")");


  r2l.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr3l) + ")")

  ,r3l.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr2l) + ")");


}

//Prima funzione: se si clicca sul rettangolo del terzo gruppo si scambia con quello appartenente al quarto gruppo

function changer3r4(d){

  var heightr3a = parseInt(g3.select("#c.value #r3a").attr("height"));
  var heightr4a = parseInt(g4.select("#d.value #r4a").attr("height"));

  var heightr3b = parseInt(g3.select("#c.value #r3b").attr("height"));
  var heightr4b = parseInt(g4.select("#d.value #r4b").attr("height"));

  var heightr3c = parseInt(g3.select("#c.value #r3c").attr("height"));
  var heightr4c = parseInt(g4.select("#d.value #r4c").attr("height"));

  var heightr3d = parseInt(g3.select("#c.value #r3d").attr("height"));
  var heightr4d = parseInt(g4.select("#d.value #r4d").attr("height"));

  var heightr3e = parseInt(g3.select("#c.value #r3e").attr("height"));
  var heightr4e = parseInt(g4.select("#d.value #r4e").attr("height"));

  var heightr3f = parseInt(g3.select("#c.value #r3f").attr("height"));
  var heightr4f = parseInt(g4.select("#d.value #r4f").attr("height"));

  var heightr3g = parseInt(g3.select("#c.value #r3g").attr("height"));
  var heightr4g = parseInt(g4.select("#d.value #r4g").attr("height"));

  var heightr3h = parseInt(g3.select("#c.value #r3h").attr("height"));
  var heightr4h = parseInt(g4.select("#d.value #r4h").attr("height"));

  var heightr3i = parseInt(g3.select("#c.value #r3i").attr("height"));
  var heightr4i = parseInt(g4.select("#d.value #r4i").attr("height"));

  var heightr3l = parseInt(g3.select("#c.value #r3l").attr("height"));
  var heightr4l = parseInt(g4.select("#d.value #r4l").attr("height"));


  var r3a = g3.select("#c.value #r3a");
  var r4a = g4.select("#d.value #r4a");

  var r3b = g3.select("#c.value #r3b");
  var r4b = g4.select("#d.value #r4b");

  var r3c = g3.select("#c.value #r3c");
  var r4c = g4.select("#d.value #r4c");

  var r3d = g3.select("#c.value #r3d");
  var r4d = g4.select("#d.value #r4d");

  var r3e = g3.select("#c.value #r3e");
  var r4e = g4.select("#d.value #r4e");

  var r3f = g3.select("#c.value #r3f");
  var r4f = g4.select("#d.value #r4f");

  var r3g = g3.select("#c.value #r3g");
  var r4g = g4.select("#d.value #r4g");

  var r3h = g3.select("#c.value #r3h");
  var r4h = g4.select("#d.value #r4h");

  var r3i = g3.select("#c.value #r3i");
  var r4i = g4.select("#d.value #r4i");

  var r3l = g3.select("#c.value #r3l");
  var r4l = g4.select("#d.value #r4l");


  r3a.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4a) + ")")
  
  , r4a.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3a) +")");


  r3b.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4b) + ")")

  ,r4b.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3b) + ")");


  r3c.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4c) + ")")

  ,r4c.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3c) + ")");


  r3d.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4d) + ")")

  ,r4d.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3d) + ")");


  r3e.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4e) + ")")

  ,r4e.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3e) + ")");


  r3f.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4f) + ")")

  ,r4f.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3f) + ")");


  r3g.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4g) + ")")

  ,r4g.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3g) + ")");


  r3h.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4h) + ")")

  ,r4h.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3h) + ")");


  r3i.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4i) + ")")

  ,r4i.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3i) + ")");


  r3l.transition()
  .duration(1000)
  .attr("transform", "translate(0," + (-heightr4l) + ")")

  ,r4l.transition()
  .duration(1000)
  .attr("transform","translate(0, " + (heightr3l) + ")");


}

    

});

