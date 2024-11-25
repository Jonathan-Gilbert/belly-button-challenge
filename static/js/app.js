// Function to build the bar chart
function buildBarChart(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var samples = data.samples;
    var result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Create the data for the bar chart
    var barData = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h' // Horizontal bar chart
    }];

    // Define the layout for the bar chart
    var barLayout = {
      title: 'Top 10 OTUs Found in Sample',
      xaxis: { title: 'Sample Value' },
      yaxis: { title: 'OTU ID' },
      showlegend: false
    };

    // Plot the bar chart using Plotly
    Plotly.newPlot('bar-chart', barData, barLayout);
  });
}

// Function to build the bubble chart
function buildBubbleChart(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var samples = data.samples;
    var result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Create the data for the bubble chart
    var bubbleData = [{
      x: otu_ids, // OTU IDs for the x-axis
      y: sample_values, // Sample values for the y-axis
      text: otu_labels, // Hover text (OTU labels)
      mode: 'markers', // Bubble chart mode
      marker: {
        size: sample_values, // Marker size based on sample values
        color: otu_ids, // Marker color based on OTU IDs
        colorscale: 'YlGnBu', // Color scale for the bubbles
        showscale: true // Show color scale on the side
      }
    }];

    // Define the layout for the bubble chart
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Value' },
      showlegend: false
    };

    // Plot the bubble chart using Plotly
    Plotly.newPlot('bubble-chart', bubbleData, bubbleLayout);
  });
}

// Function to build the metadata display
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata
    PANEL.html("");

    // Loop through each key-value pair and append it to the metadata panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Function to build the dropdown menu
function buildDropdown() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var sampleNames = data.names;
    var dropdown = d3.select("#selDataset");

    // Populate the dropdown with the sample IDs
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    // Build the charts and metadata for the first sample
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener to update charts when a new sample is selected
function optionChanged(newSample) {
  buildBarChart(newSample);
  buildBubbleChart(newSample);  // Update the bubble chart with the new sample
  buildMetadata(newSample);  // Update metadata as well
}

// Initialize the dashboard
buildDropdown();

