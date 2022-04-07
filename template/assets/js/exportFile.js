getDate = function() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = mm + '/' + dd + '/' + yyyy;
	return today;
}

exportExcel = function() {
	console.log("copyed:");
	var rowCount = $('#copystatisticTable tr').length;
	console.log("table: " + rowCount);     
	$("#copystatisticTable").table2excel({
        filename: "statistic_detail"+getDate()+".xls",
		fileext: ".xls",
        name: "Hpone Nai Tech statistic data", 
        exclude_img: true,
        exclude_links: true,
        exclude: ".dntinclude",
        exclude_inputs: true
    }); 
}

exportPdf = function() {
			$('#copy-statistic-table').show();
            html2canvas($('#copystatisticTable')[0], {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
						pageSize: {
							width: 'auto',
							height: 'auto'
						},
                        content: [{
                            image: data,
                           // width: 550,
							//height: 'auto'
                        }],
						 pageSize: 'letter',
						pageOrientation: 'landscape',
						pageMargins: [ 0, 0, 0, 0 ],
                    };
                    pdfMake.createPdf(docDefinition).download("statistic-details(" + getDate()+ ").pdf");
					$('#copy-statistic-table').hide();

                }
            });
}

function tableToCSV() {
 
            // Variable to store the final csv data
            var csv_data = [];
 
            // Get each row data
            var rows = document.getElementsByTagName('tr');
            for (var i = 0; i < rows.length; i++) {
 
                // Get each column data
                var cols = rows[i].querySelectorAll('td,th');
 
                // Stores each csv row data
                var csvrow = [];
                for (var j = 0; j < cols.length; j++) {
					let classAttributeValue = cols[j].getAttribute("class");
					let styleAttributeValue = cols[j].getAttribute("style");
					console.log("style attr: " + styleAttributeValue)
					//console.log("attribute value: " + attributeValue)
                    // Get the text data of each cell
                    // of a row and push it to csvrow
					if(classAttributeValue !== "dntinclude") {
						if( styleAttributeValue !== "display:none") {
							console.log("cols: " + cols[j].innerHTML)
							csvrow.push(cols[j].innerHTML);
						}
					}
                }
 
                // Combine each column value with comma
                csv_data.push(csvrow.join(","));
            }
 
            // Combine each row data with new line character
            csv_data = csv_data.join('\n');
 
            // Call this function to download csv file 
            downloadCSVFile(csv_data);
 
}

function downloadCSVFile(csv_data) {
 
            // Create CSV file object and feed
            // our csv_data into it
            CSVFile = new Blob([csv_data], {
                type: "text/csv"
            });
 
            // Create to temporary link to initiate
            // download process
            var temp_link = document.createElement('a');
 
            // Download csv file
            temp_link.download = "statistic-detail(" + getDate() + ").csv";
            var url = window.URL.createObjectURL(CSVFile);
            temp_link.href = url;
 
            // This link should not be displayed
            temp_link.style.display = "none";
            document.body.appendChild(temp_link);
 
            // Automatically click the link to
            // trigger download
            temp_link.click();
            document.body.removeChild(temp_link);
}

exportCSV = function() {
	console.log("here export CSV")	
	tableToCSV();
}