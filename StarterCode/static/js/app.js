//url Link path:
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 

//Build the Demographic Info uding the metadata
function Build_Metadata(sample) {
  d3.json(url).then((data) => {
    let metadata= data.metadata;
    let test_subject= metadata.filter(each_sample => each_sample.id == sample);
    let result= test_subject[0];
    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => panel.append("h6").text(`${key}: ${value}`));
  })
}


// Build_plot function to build the plots for each chosen sample 
function Build_Plots(sample)
{
  // Fetch the JSON data and console log it//
  d3.json(url).then((data) => {

    let metadata= data.metadata.filter(each_sample => each_sample.id == sample)[0];
    let washing_freq = parseInt(metadata.wfreq);
    let range = ["0-1", "1-2", "2-3", "3-4", "4=5", "5=6", "6=7", "7-8", "8-9"] 
    let washingdata = [
      { 
        value: parseInt(washing_freq),
        title: { text: "Belly Button Washing Frequency <br> Srubs per Week" },
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge",
        gauge: {
          axis: { visible: true, 
            range: [null, 9],
             },
          steps: [
            { range: [0, 1], color: "ivory"},
            { range: [1, 2], color: "floralwhite" },
            { range: [2, 3], color: "oldlace" },
            { range: [3, 4], color: " blanchedalmond " },
            { range: [4, 5], color: "peachpuff" },
            { range: [5, 6], color: "sandybrown" },
            { range: [6, 7], color: "darkorange" },
            { range: [7, 8], color: "chocolate" },
            { range: [8, 9], color: "sienna" }]
        }
      }];
      

      

    let gauge_layout = { width: 600, height: 400 };
    Plotly.newPlot('gauge', washingdata,gauge_layout);
  


    //Find the test object match the new chosen ID 
    let test_subject = data.samples.filter( each_sample=> each_sample.id == sample);
    let new_sample = test_subject[0]; 

    //Slice the first 10 sample_values 
    let top_values = new_sample.sample_values.slice(0, 10); 
    console.log(top_values);
    // reverse the data because we want the highest values on the top
    top_values.reverse();

    // slice top 10 otu_ids of an individual 
    let top_otu_ids = new_sample.otu_ids.slice(0, 10);
    console.log(top_otu_ids);
    // reverse it here to match with the labels
    top_otu_ids.reverse();

    // get the labels for each OTU labels for bar chart 
    let otu_label = top_otu_ids.map(label => "OTU " + label);
    console.log(`OTU IDs: ${otu_label}`);

    // get top 10 labels for each values of OTUs
    let labels = new_sample.otu_labels.slice(0, 10);
    console.log(labels);

    // Bar Graph 
    let bar_graph = [{
      x: top_values,
      y: otu_label,
      text: labels,
      orientation: 'h', 
      type: 'bar', 
      marker:
      {
        color: "mediumseagreen"
      }
    }];
    Plotly.newPlot('bar', bar_graph);


    // Customize the buble graph color. 
    color_map = arr => arr.map(i => `hsl(${i/15},100,40`)
    let buble_color = color_map(new_sample.otu_ids); 
  
    // Buble Graph 
    let buble_data = [{
      x: new_sample.otu_ids,
      y: new_sample.sample_values,
      text: new_sample.otu_labels,
      mode: 'markers',
      marker: {
        color: buble_color,
        size: new_sample.sample_values, 
      }}];

    let layout = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Types Of Bacteria"},
      showlegend: false
      };

    Plotly.newPlot('bubble', buble_data, layout);
  });
}


//Init function to set the main page
function init(){
  let dropdownMenu = d3.select("#selDataset"); 
  
  d3.json(url).then((data) => {
    let names = data.names; 
    names.forEach(function(sample) {
    dropdownMenu.append("option")
                .text(sample)
                .property("value",sample);
  });

  Build_Plots(data.names[0]);
  Build_Metadata(data.names[0]);

  })
};

//OptionChanged to update the new testing sample. 
function optionChanged(new_sample){
  Build_Plots(new_sample);
  Build_Metadata(new_sample);
};

init(); 