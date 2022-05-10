getDate = function() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = mm + '/' + dd + '/' + yyyy;
	return today;
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

exportCSV = function() {
	console.log("here export CSV")	
	tableToCSV();
}
