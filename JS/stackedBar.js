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
  
//Implementazione della funzione principale,  Facendo click con il pulsante sinistro del mouse su una sezione della barra, 
//per tutte le barre questa sezione si scambia di posto con la sezione che si trova sopra di essa. Fai in modo che le transizioni siano progressive e non a salti.

// function switchRect(d){

//   var i = d.index; 
//   var statistiche = [];
//   var max = dataset.length -1;
//   statistiche[0] = dataset[i];
//   var ind1 = i;
//   var ind2 = i+1;
//   if (i == max){//Se cliccosull ultimo rect me lo scambia con il primo
//     ind2 = 0;
//   }

//   dataset[ind1] = dataset[ind2];
//   dataset[ind2] = statistiche[0];


// }


// // //ricalcolo del dataset
// function update() {
  
//   rect = d3.select(".viz-portfolio-delinquent-status").selectAll("path").data(dataset);
//   rect.transition()
//   .duration(1000)
 
//   .attr("d", rect)
//   .attr("fill", function(d){
//     return colori[i];
//   })
//   //.attr("transform", "translate(0," +  + ")")
  
//   // .attr("height", d.y)
//   //  .attr("width", x.rangeBand())
  



//   // var transition = svg.transition().duration(1000);

//   // //riordino barre
  
//   // transition.selectAll("g.value rect")
//   // .attr("x", function(d) {
//   //         return x(d.name);
//   //     })
//   // .attr("y", function(d) {
//   //         return y((d.y0+ d.y)/5);
//   //     })
//   // .attr("height", function(d) {
//   //         return (y(d.y0) - y(d.y0+ d.y))/5;
//   //     })


//   // var groups = svg.selectAll(".value")
//   // .data(dataset);

//   // groups.selectAll("rect")
//   // .data(function(d) {
//   // return d;
//   // })

//   // //creazione della transizione da eseguire
  
    
//   // transition.select(".x.axis")
//   // .call(yxAxis)
//   // .selectAll("g")


  var g1 = svg.selectAll("#a.value")
        .data(dataset);
  var g2 = svg.selectAll("#b.value")
        .data(dataset) 

  var r1 = g1.selectAll("#a.value rect")
  .data(function(d){
      return d;
  })


  .on("click", function(d){
    changer1r2(d);

  })

  

 
  
  //Separato il click tra i vari rect appartenenti allo stesso gruppo, ora qui funziona se si clicca sul rect giusto
  function changer1r2(d,i){
    var r2 = g2.selectAll("#b.value rect")
    .data(function(d){
      return(d);
    })
  
    var heightr1Array = [103.5, 100.05, 86.25, 86.25, 92, 87.4, 88.55, 92, 72.45, 64.4];

          
    var heightr2Array = [106.95, 105.8, 96.60000000000001, 98.9, 97.74999999999997, 94.30000000000001, 94.30000000000001, 103.5, 97.75, 101.19999999999999];
    var heightr1 = 0;
    var heightr2 =0;
    var statistica1 = d.current
  

    if(statistica1 == "Velocità"){//Con questo prendo l'height del rect corrente che è stato cliccato
      var calc1 = (d.y0+d.y);
      heightr1 += calc1;
        
  }
    
   
  

   // var difference = heightr1 - heightr2;


 
    
    
    
    r1.transition()
    .duration(1000)
    .attr("transform", "translate(0," + (-d.y) + ")")
    , r2.transition()
    .duration(1000)
    .attr("transform","translate(0, " + (heightr1) +")");




  }

  






// function change(d){
//   var g1 = svg.selectAll("#a.value")
//           .data(dataset)

//   var g2 = svg.selectAll("#b.value")
//           .data(dataset)  
//   var g3 = svg.selectAll("#c.value")
//           .data(dataset)
//   var g4 = svg.selectAll("#d.value")
//           .data(dataset)
//   var g5 = svg.selectAll("#e.value")
//           .data(dataset)
//   var r1 = g1.selectAll("#a.value rect")
//           .data(function(d){
//               return d;
//           })
         
        
       
          
//   var r2 = g2.selectAll("#b.value rect")
//           .data(function(d){
//             return(d);
//           })

        
        
//   var r3 = g3.selectAll("#c.value rect")
//           .data(function(d){
//             return(d);
//           })
         
//   var r4 = g4.selectAll("#d.value rect")
//           .data(function(d){
//             return(d);
//           })
        
//   var r5 = g5.selectAll("#e.value rect")
//           .data(function(d){
//             return(d);
//           })
        

//   //Transizione tra i due rettangoli se non en commento una le fanno tutte insieme perchè vedono un click e partono DEVO isolare i click E SISTEMARE LA POS DEI RETTANGOLI(Eliminare Spazi bianchi)
//   r1 = g1.selectAll("rect").data(function(d){
//       return (d)
//     });
//   r1.transition()
//   .duration(1000)
//   .attr("transform", "translate(0," + (-d.y)+ ")")
//   , r2.transition()
//   .duration(1000)
//   .attr("transform","translate(0, " + (d.y)+")");




//   // r2 = g2.selectAll("rect").data(function(d){
//   //   return(d)
//   // });

//   // r2.transition()
//   // .duration(1000)
//   // .attr("transform", "translate(0," + -d.y + ")")
//   // , r3.transition()
//   // .duration(1000)
//   // .attr("transform", "translate(0," + d.y + ")");

//   // r3 = g3.selectAll("rect").data(function(d){
  //   return(d)
  // });

  // r3.transition()
  // .duration(1000)
  // .attr("transform", "translate(0," + -d.y + ")")
  // , r4.transition()
  // .duration(1000)
  // .attr("transform", "translate(0," + d.y + ")");

  // r4= g4.selectAll("rect").data(function(d){
  //   return(d)
  // });

  // r4.transition()
  // .duration(1000)
  // .attr("transform", "translate(0," + -d.y + ")")
  // , r5.transition()
  // .duration(1000)
  // .attr("transform", "translate(0," + d.y + ")");

    
    

  //}



 
    

});

