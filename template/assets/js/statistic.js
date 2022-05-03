var firebaseRowCount = 0;
function loadStatisticList(currentTableId) {
	var currentTableRow = $('#'+currentTableId+' tbody');
	currentTableRow.find("tr").remove();
	var path = 'statistic/'+currentTableId;
	var number = 1;
	var count = 0;
	getCollection(path).orderByChild('status').equalTo('active').on('value', (snapshot) => {
		snapshot.forEach((child) => {
			//checkbox.parent().parent().parent().children('div[name="configName"]').find('#configuration_id').attr("value", child.val().elementId);
			  var id = child.key;
			  var date = child.val().date;
			  var subject = child.val().subject;
			  var cost = child.val().cost;
			  var note = child.val().note;
			  console.log("id / date / subject / cost / note " + id + " / " + date + " / " + subject + " / " + cost + " / " + note)
			  var tr = `
								<tr>
									<td data-statistic-attr="id" style="display:none">${id}</td>
									<td>${number++}</td>
									<td data-statistic-attr="date">${date}</td>
									<td data-statistic-attr="subject">${subject}</td>
									<td data-statistic-attr="cost">${cost}</td>
									<td data-statistic-attr="note">${note}</td>
									<td class="dntinclude">
                            <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                            <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                            <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                        </td>
									
								</tr>
							`
							
			currentTableRow.append(tr);
		});
		console.log("number of loop: " + count++);
	})
}

$(document).ready(function(){
	//$('[data-toggle="tooltip"]').tooltip();
		// Append table with add row form on add new button click
    $(".add-new").click(function(){
		paginationDestory(statistic_table);
		console.log("here add new button ..")
		$(this).attr("disabled", "disabled");
		var index = $("#"+current_statistic_table.attr("id") +" tbody tr:last-child").index();
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="number" data-statistic-attr="id"></td>' +
            '<td><input type="text" class="form-control date" name="date" data-statistic-attr="id" placeholder="yy-mm-dd" onclick="selectDate(this)"></td>' +
            '<td><input type="text" class="form-control" name="subject" id="subject"></td>' +
			'<td><input type="text" class="form-control" name="cost" id="cost"></td>' +
			'<td><input type="text" class="form-control" name="note" id="note"></td>' +
			'<td class="dntinclude">' +
                            '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
                            '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
                            '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>' +
                        '</td>' +
        '</tr>';
    	current_statistic_table.append(row);
		$("#"+current_statistic_table.attr("id") +" tbody tr").eq(index + 1).find(".add, .edit").toggle();
		//$("#" + current_statistic_table.attr("id") +"tbody tr").eq(index + 1).find(".add, .edit").toggle();
        //$('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		console.log("here add button click:..........................");
		var updatedStatistic = new Object();
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
		var date, subject, cost, note;
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
				date = $(this).parents("tr").find('input[type="text"][data-statistic-attr="date"]').val();
				subject = $(this).parents("tr").find('input[type="text"][data-statistic-attr="subject"]').val();
				cost = $(this).parents("tr").find('input[type="text"][data-statistic-attr="cost"]').val();
				note = $(this).parents("tr").find('input[type="text"][data-statistic-attr="note"]').val();
				id = $(this).parents("tr").find('input[type="text"][data-statistic-attr="id"]').val();
				
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			updatedStatistic.elementId = id;
			updatedStatistic.date = date;
			updatedStatistic.subject = subject;
			updatedStatistic.cost = cost;
			updatedStatistic.note = note;
			updatedStatistic.status = 'active';
			console.log(updatedStatistic);
			console.log("current table id: " + current_statistic_table.attr("id"));
			if(current_statistic_table.attr("id") === "brickKiln1") {
				update(updatedStatistic,"statistic/brickKiln1",updatedStatistic.elementId);
			}
			 if(current_statistic_table.attr("id") === "brickKiln1_oil") {
				update(updatedStatistic, "statistic/brickKiln1_oil",  updatedStatistic.elementId);
			}
			 if(current_statistic_table.attr("id") === "brickKiln1_landSide") {
				update(updatedStatistic, "statistic/brickKiln1_landSide", updatedStatistic.elementId);
			}
		
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}	
		location.reload(true);
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() +'" data-statistic-attr="'+$(this).attr("data-statistic-attr")+'">');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
		//$('#statisticTableId').DataTable();
		var deletedStatistic = new Object();
        $(this).parents("tr").remove();
		deletedStatistic.date = $(this).parents("tr").find('[data-statistic-attr="date"]').html();
		deletedStatistic.subject = $(this).parents("tr").find('[data-statistic-attr="subject"]').html();
		deletedStatistic.cost = $(this).parents("tr").find('[data-statistic-attr="cost"]').html();
		deletedStatistic.note = $(this).parents("tr").find('[data-statistic-attr="note"]').html();
		deletedStatistic.elementId = $(this).parents("tr").find('[data-statistic-attr="id"]').html();
		deletedStatistic.status = 'inactive';
		console.log(deletedStatistic);
		if(current_statistic_table.attr("id") === "brickKiln1") {
				update(deletedStatistic,"statistic/brickKiln1",deletedStatistic.elementId);
		}
	    if(current_statistic_table.attr("id") === "brickKiln1_oil") {
			update(deletedStatistic, "statistic/brickKiln1_oil",  deletedStatistic.elementId);
		}
		if(current_statistic_table.attr("id") === "brickKiln1_landSide") {
			update(deletedStatistic, "statistic/brickKiln1_landSide", deletedStatistic.elementId);
		}
		$(".add-new").removeAttr("disabled");
    });

});

searchStatistics = function(search) {
	console.log("here search statistic:...................");
	var matchRow = 0;
	//paginationDestory(statistic_table);
	var searchBtn = $(search);	
		current_statistic_table.find("tbody, tr").show();	
		let searchString = "";
		var searchKey = searchBtn.val().trim();
		//console.log("search key: " + searchKey);
		if(searchKey === "" || searchKey === null) {
				//$('#' +current_statistic_table.attr('id')).DataTable();
			
		}
	    $("document").ready(function() {
			//$('.statistic-table > tbody  > tr').each(function(trIndex, trElement) {
			current_statistic_table.find("tbody > tr").each(function(trIndex, trElement) {
				$(trElement).find('td').each(function(index, element) {   
					var colVal = $(element).text();
					//console.log("colval: " + colVal);
					searchString = searchString.concat("/", colVal.trim());
				});
						if(! searchString.toLowerCase().match(searchKey.toLowerCase(), 'g')) {
							$(trElement).hide();
							console.log("not match: searchKey / searchString: " + searchKey + " / " + searchString);
						}
						else {
									console.log("match: searchKey / searchString: " + searchKey + " / " + searchString);
									/*if(matchRow++ >= 9) {
										//$('#' +current_statistic_table.attr('id')).DataTable();
									}*/
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
  	var actions = $("#"+current_statistic_table.attr("id")+" td:last-child").html();
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

        var brickKiln1Rows = $('#brickKiln1 tbody');
		var oilTableRows = $('#brickKiln1_oil tbody');
		var landSideTableRows = $('#brickKiln1_landSide tbody');
        // console.log(productList)
        for (i = 0; i < productList.length; i++) {
			var statistic = new Object();
			  var columns = Object.values(productList[i])
			  var date = columns[1];
			  var subject = columns[2];
			  var cost = columns[3];
			  var note = columns[4];
			  statistic.date = date;
			  statistic.subject =subject;
			  statistic.cost = cost;
			  statistic.note = note;
			  statistic.status = 'active';
			  var tr = `
								<tr>
									
									<td>${columns[0]}</td>
									<td>${columns[1]}</td>
									<td>${columns[2]}</td>
									<td>${columns[3]}</td>
									<td>${columns[4]}</td>
									<td class="dntinclude">
                            <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                            <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                            <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                        </td>
									
								</tr>
							`
			  console.log("for: " + columns[5]);
			  var chooseTable = columns[5];
			  if(chooseTable === 'brick') {
				  //brickKiln1Rows.append(tr);
				  save("statistic/brickKiln1", statistic);
			  }
			  if(chooseTable === 'oil') {
				  //oilTableRows.append(tr);
				  save("statistic/brickKiln1_oil", statistic);
			  }
			  if(chooseTable === 'land') {
				  //landSideTableRows.append(tr);
				  save("statistic/brickKiln1_landSide", statistic);
			  }
        }
      })
	  loadStatisticList(current_statistic_table.attr("id"));
	 // console.log("row length: " + getRowLength("brickKiln1_StatisticTableId"));
		
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
	/*table = $(table).DataTable( {
				paging: false
			});
 
	table.destroy();*/
	if ( $.fn.dataTable.isDataTable( table) ) {
		data_table = $(table).DataTable();
		$(data_table).DataTable( {
			paging: false
		});
		data_table.destroy();
	}	
}

function selectDate(date) {
	$("." + date).datepicker({
		dateFormat: 'yy-mm-dd'
	});
}

function moveNextTable() {
	current_statistic_container = $('.current');
	var next = current_statistic_container.next();
	if(current_statistic_container.hasClass("last")) {
		next = $('[data-table-index="first"]')
	} else {
		current_statistic_container = $('.current');
	}
	current_statistic_container.hide();
	next.show();
	current_statistic_container.removeClass("current");
	next.addClass("current");
	current_statistic_table = next.find("table");
	console.log("current id: " + current_statistic_table.attr("id"));
	paginationDestory(current_statistic_table);
	console.log("next table length: " + $("#"+current_statistic_table.attr("id") + " tr").length);
	loadStatisticList(current_statistic_table.attr("id"));
	//location.reload(true);
}

function getRowLength(tableIdString) {
	return $('#'+tableIdString +' tr').length;
}


var statistic_table = $(".statistic-table");
var current_statistic_container = $('.current');
var current_statistic_table = current_statistic_container.find("table");