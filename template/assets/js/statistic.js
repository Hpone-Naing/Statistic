$(document).ready(function(){
	//$('[data-toggle="tooltip"]').tooltip();
	var actions = $(".statistic-table td:last-child").html();
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		paginationDestory(statistic_table);
		console.log("here add new button ..")
		//$(this).attr("disabled", "disabled");
		var index = $(".statistic-table tbody tr:last-child").index();
		var rowLength = $('.statistic-table tr').length;
		console.log("row length: " + rowLength);
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><input type="text" class="form-control" name="department" id="department"></td>' +
            '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$(".statistic-table").append(row);
		$(".statistic-table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        //$('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		paginationDestory(statistic_table);
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}	
		 $('#statisticTableId').DataTable();
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
		//$('#statisticTableId').DataTable();
		paginationDestory(statistic_table)
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
		 $('#statisticTableId').DataTable();
    });

});

searchStatistics = function(search) {
	paginationDestory(statistic_table);
	var searchBtn = $(search);
		console.log("tr length: " + $(".statistic-table tbody tr ").length);
		$(".statistic-table tbody tr ").show();		
		let searchString = "";
		var searchKey = searchBtn.val().trim();
		console.log("search key: " + searchKey);
		if(searchKey === "" || searchKey === null) {
			$('#statisticTableId').DataTable();
		}
	    $("document").ready(function() {
			var matchRow = 0;
			$('.statistic-table > tbody  > tr').each(function(trIndex, trElement) {
				$(trElement).find('td').each(function(index, element) {   
					var colVal = $(element).text();
					searchString = searchString.concat("/", colVal.trim());
				});
						if(! searchString.toLowerCase().match(searchKey.toLowerCase(), 'g')) {
							$(trElement).hide();
							console.log("tr length: " + trElement.length);
						}
						else {
									console.log("match row ength: " + (matchRow++));
									if(matchRow >= 9) {
										$('#statisticTableId').DataTable();
									}
						}
						searchString = "";

			});
										 

		});
}

searchStatistics1 = function(search1) {
	console.log("here translate..........................")
	var translateBtn = $(search1);
	currentLanguage = translateBtn.parent().attr("lang");
			console.log("current lang: " + currentLanguage)
	    if(currentLanguage === "my") {
			$("*").each(function() {
				  currentElement = this;
				  $.each(currentElement.attributes, function(i, attrib){
					if(attrib.name === "lang") {
						if (attrib.value === "en") {
						  $(currentElement).show();
						} else if (attrib.value === "my") {
						  $(currentElement).hide();
						}
					}
				  });
			})
		}else if(currentLanguage === "en") {
			$("*").each(function() {
				  currentElement = this;
				  $.each(currentElement.attributes, function(i, attrib){
					if(attrib.name === "lang") {
						if (attrib.value === "my") {
						  $(currentElement).show();
						} else if (attrib.value === "en") {
						  $(currentElement).hide();
						}
					}
				  });
			})

		} 
}

var ExcelToJSON = function() {
	paginationDestory(statistic_table);
  	var actions = $(".statistic-table td:last-child").html();
  this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function(sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var productList = JSON.parse(JSON.stringify(XL_row_object));

        var rows = $('#statisticTableId tbody');
        // console.log(productList)
        for (i = 0; i < productList.length; i++) {
			console.log("count: " + i);
			  var columns = Object.values(productList[i])
			  rows.append(`
							<tr>
								<td>${columns[0]}</td>
								<td>${columns[1]}</td>
								<td>${columns[2]}</td>
								<td>` + actions + `</td>
							</tr>
						`);
        }
      })
            $('#statisticTableId').DataTable();
    };
    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
  var errMsg = $('span[name="errormsg"]');
  var files = evt.target.files; // FileList object
  console.log("files..................." + files[0].name)
  var fileExtension = files[0].name.split('.')[1];
  console.log("file extensions:  " + fileExtension)
  if(fileExtension === "xlsx" || fileExtension === "xls") {
			errMsg.hide();
			console.log("this is excel file");
			var xl2json = new ExcelToJSON();
			xl2json.parseExcel(files[0]);
		} else {
			errMsg.show();
			console.log("this is not excel file")
			errMsg.html("Please select excel file.");
		}
}

document.getElementById('excel-file-upload').addEventListener('change', handleFileSelect, false);

function paginationDestory(table) {
	table = $(table).DataTable( {
			paging: false
		});
 
		table.destroy();
}

var statistic_table = $(".statistic-table");

