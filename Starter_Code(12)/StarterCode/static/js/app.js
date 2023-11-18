const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


let sV = []
let iDs = []
let oLabels = []
let names = []


let bubbleSv = []
let bubbleIds = []

let meta = []

d3.json(url).then((data) => {
    for (let i=0; i < data["metadata"].length; i++){
        demographic = data["metadata"][i]
        meta.push(demographic)
    }

    for (let i=0; i < data["names"].length; i++){
        dataNames = data["names"][i]
        names.push(dataNames)
    }

    for (let i=0; i < data["names"].length; i++){
    
        id = data["samples"][i]["id"]
    
        let sampleV = data["samples"][i]["sample_values"];
        bubbleSv.push(sampleV)

        let otuIds = data["samples"][i]["otu_ids"];
        bubbleIds.push(otuIds)

        let outL = data["samples"][i]["otu_labels"];
    
        let extractedSampleV = sampleV.slice(0,10);
        let sortSampleV = extractedSampleV.reverse()
        sV.push(sortSampleV)

        let extractedotuIds = otuIds.slice(0,10);
        let formattedIds = extractedotuIds.map(item => "OTU " + item).reverse()
        iDs.push(formattedIds);

        let extractedoutL = outL.slice(0,10);
        oLabels.push(extractedoutL);


    populateDropdownWithD3();
    
    init();

    initTwo();

    initDemo();

    initGauge();

}}).catch(error => {
    console.error("An error occurred:", error);
});

// event listener: when user picks a different name, it will trigger the optionChanged funciton
d3.select("#selDataset").on("change", function() {
    const selectedValue = d3.select(this).property("value");
    optionChanged(selectedValue);
});



function optionChanged(selectedId) {
    const index = names.indexOf(selectedId);
        updatePlotly(sV[index], iDs[index]);
        updateBubble(bubbleIds[index], bubbleSv[index]);
        updateDemo(meta[index]);
        updateGauge(meta[index]["wfreq"])
}

function populateDropdownWithD3() {
    const dropdown = d3.select("#selDataset");

    // Bind names to dropdown
    dropdown.selectAll("option")
        // tying names list to this dropdown
        .data(names)

        // focus on any name in the names list that isn't already in the dropdown (in this case all the names)
        .enter()

        //how each name appears as a selectable option in our dropdown
        .append("option")

        //make the displayed text of this option be the name
        .text(d => d)

        //the option displayed will also be the value in the background
        .attr("value", d => d)
    

}

function fColor(y){
    if (y > 2000) {
      return "yellow"
    }
    else if (y > 1750){
      return "gold"
    } 
    else if (y > 1500){
      return "green"
    }
    else if (y > 1250){
        return "cyan"
      }
    else if (y > 1000){
        return "blue"
      }
    else if (y > 750){
        return "teal"
      }
    else if (y > 500){
        return "pink"
      }
    else if (y > 250){
        return "orange"
      }
    else if (y > 50){
        return "red"
      }
    else { return "black"}
  }

  function fOp(y){
    if (y > 2000) {
        return 1
      }
      else if (y > 1750){
        return 0.9
      } 
      else if (y > 1500){
        return 0.8
      }
      else if (y > 1250){
          return 0.7
        }
      else if (y > 1000){
          return 0.6
        }
      else if (y > 750){
          return 0.5
        }
      else if (y > 500){
          return 0.4
        }
      else if (y > 250){
          return 0.3
        }
      else if (y > 50){
          return 0.2
        }
      else { return 0.1}
    }

const panel = d3.select("#sample-metadata");


function updateDemo(x){
    panel.html("");  // Clear previous data
    panel.append("div").text(`ID: ${x.id}`);
    panel.append("div").text(`Ethnicity: ${x.ethnicity}`);
    panel.append("div").text(`Gender: ${x.gender}`);
    panel.append("div").text(`Age: ${x.age}`);
    panel.append("div").text(`Location: ${x.location}`);
    panel.append("div").text(`bbtype: ${x.bbtype}`);
    panel.append("div").text(`wfreq: ${x.wfreq}`);
}

function updateGauge(x){
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: x,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number"
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
}


function updatePlotly(x, y) {
    var plotdata = [{
        type: 'bar',
        x: x,
        y: y,
        orientation: 'h'
    }];

    Plotly.newPlot("bar", plotdata);
}

function updateBubble(id,sv){
    var trace1 = [{
        x: id,
        y: sv,
        mode: 'markers', 
        marker: {
            color: id.map(val => fColor(val)),
            opacity: id.map(val => fOp(val)),
            size: sv.map(val => val)
        }
  }];

  var layout = {
    //title: 'Marker Size and Color',
    showlegend: false,
    height: 600,
    width: 1000
  };
  
  Plotly.newPlot("bubble", trace1, layout);
};


console.log('Sample Values:', sV);
console.log('OTU iDs:', iDs);
console.log('OTU Labels:', oLabels);
console.log('Data Names:', names);
console.log('Demographic Info:', meta);


function init() {
    updatePlotly(sV[0], iDs[0]);
}

function initTwo(){
    updateBubble(bubbleIds[0], bubbleSv[0]);
}

function initDemo(){
    updateDemo(meta[0])
}

function initGauge(){
    updateGauge(meta[0]["wfreq"])
}