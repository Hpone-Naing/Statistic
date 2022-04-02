exportExcel = function(exportExcelBtn) {
	$( "#copy-statistic-table" ).load( "../ui-features/dropdowns.html #statisticTableId" );
	
}

exportPdf = function(exportCSVBtn) {
	console.log("here export Pdf")
	exportBtn = $(exportCSVBtn);
}

exportCSV = function(exportCSVBtn) {
	console.log("here export CSV")
	exportBtn = $(exportCSVBtn);
	
}