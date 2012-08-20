var fs = require('fs');

// Force encoding to ascii text
fs.readFile('biccodes.csv', 'ascii', function(err,data){
	if(err) {
		console.error("Could not open file: %s", err);
		process.exit(1);
	}

	

	var outputlines = [];

	var lines = data.split("\r");
	for(var i in lines){
		var line = lines[i].split(";");

		var from = line[0];
		var to = line[1];
		var bic = line[2];

		outputlines.push( '\t{from:' + from + ', to:' + to + ', bic: "' + bic + '"}' ) ;
	}

	var output = "var bics = [\n";
	output += outputlines.join(",\n");
	output += "];";

	fs.writeFile("biccodes.js", output, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 
});
