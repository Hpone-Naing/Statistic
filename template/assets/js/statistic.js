function loadStatisticList() {
	//console.log("select brick kiln: " + selectedBrickKiln);
	paginationDestory(current_statistic_table);
	var currentTableRow = $('#'+current_statistic_table_id+' tbody');
	currentTableRow.find("tr").remove();
	var number = 1;

	getCollection(getPath()).orderByChild('status').equalTo('active').once('value', (snapshot) => {
		snapshot.forEach((child) => {
			const statistic = {};
			var id = child.key;
			var date = child.val().date;
			var subject = child.val().subject;
			var cost = child.val().cost;
			var note = child.val().note;
			//console.log("id / date / subject / cost / note " + id + " / " + date + " / " + subject + " / " + cost + " / " + note)
			var tr = `
								<tr>
									<td>${number++}</td>
									<td data-statistic-attr="date">${date}</td>
									<td data-statistic-attr="subject">${subject}</td>
									<td data-statistic-attr="cost">${cost}</td>
									<td data-statistic-attr="note">${note}</td>
									<td data-statistic-attr="id" style="display:none">${id}</td>
									<td class="dntinclude">
										<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
										<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
										<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
									</td>
								</tr>
							`
			currentTableRow.append(tr);
		});
		 $(document).ready(function() {
                    $('#'+current_statistic_table_id).DataTable();
         });
	})
}


$(document).ready(function(){
	//$('[data-toggle="tooltip"]').tooltip();
		// Append table with add row form on add new button click
    $(".add-new").click(function(){
		paginationDestory(current_statistic_table);
		console.log("here add new button ..")
		$(this).attr("disabled", "disabled");
		var index = $("#"+current_statistic_table.attr("id") +" tbody tr:last-child").index();
        var row = '<tr>' +
            '<td data-statistic-attr="id" style="display:none"><input type="text" class="form-control" data-statistic-attr="id" value="newData"></td>' +
            '<td data-statistic-attr="number"><input type="text" class="form-control" data-statistic-attr="number"></td>' +
            '<td data-statistic-attr="date"><input type="text" id="date" class="form-control" data-statistic-attr="date"  placeholder="yy-mm-dd"></td>' +
            '<td data-statistic-attr="subject"><input type="text" class="form-control" data-statistic-attr="subject"></td>' +
			'<td data-statistic-attr="cost"><input type="text" class="form-control" data-statistic-attr="cost" onclick="calculateCost(this)"></td>' +
			'<td data-statistic-attr="note"><input type="text" class="form-control" data-statistic-attr="note"></td>' +
			'<td class="dntinclude">' +
                            '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
                            '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
                            '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>' +
                        '</td>' +
        '</tr>';
    	current_statistic_table.append(row);
		$("#"+current_statistic_table.attr("id") +" tbody tr").eq(index + 1).find(".add, .edit").toggle();
		$("#date").datepicker();
		//$("#" + current_statistic_table.attr("id") +"tbody tr").eq(index + 1).find(".add, .edit").toggle();
        //$('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		console.log("here add button click:..........................");
		var updatedStatistic = new Object();
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
		var id, date, subject, cost, note;
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
			if(id === 'newData') {
				save(getPath(), updatedStatistic);
			} else {
				update(updatedStatistic,getPath(),updatedStatistic.elementId);
			}
			
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}	
		loadStatisticList();
		//$('#'+current_statistic_table_id).DataTable();
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			if($(this).attr("data-statistic-attr") === 'cost') {
					$(this).html('<input type="text" class="form-control" value="' + $(this).text() +'" data-statistic-attr="'+$(this).attr("data-statistic-attr")+'" onclick="calculateCost(this)">');
			}else {
				$(this).html('<input type="text" class="form-control" value="' + $(this).text() +'" data-statistic-attr="'+$(this).attr("data-statistic-attr")+'">');
			}
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
		$('[data-statistic-attr="date"]').datepicker();
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
		//$('#statisticTableId').DataTable();
		paginationDestory(current_statistic_table);
		var deletedStatistic = new Object();
        $(this).parents("tr").remove();
		deletedStatistic.date = $(this).parents("tr").find('[data-statistic-attr="date"]').html();
		deletedStatistic.subject = $(this).parents("tr").find('[data-statistic-attr="subject"]').html();
		deletedStatistic.cost = $(this).parents("tr").find('[data-statistic-attr="cost"]').html();
		deletedStatistic.note = $(this).parents("tr").find('[data-statistic-attr="note"]').html();
		deletedStatistic.elementId = $(this).parents("tr").find('[data-statistic-attr="id"]').html();
		deletedStatistic.status = 'inactive';
		console.log(deletedStatistic);
		//var path = 'statistic/'+current_statistic_table_id;
		update(deletedStatistic, getPath(), deletedStatistic.elementId);		
		$(".add-new").removeAttr("disabled");
		$('#'+current_statistic_table_id).DataTable();
    });
});

searchStatistics = function(search) {
	console.log("here search statistic:...................");
	var matchRow = 0;
	paginationDestory(current_statistic_table);
	var searchBtn = $(search);	
		current_statistic_table.find("tbody, tr").show();	
		let searchString = "";
		var searchKey = searchBtn.val().trim();
		//console.log("search key: " + searchKey);
		if(searchKey === "" || searchKey === null) {
				$('#' +current_statistic_table.attr('id')).DataTable();
			
		}
	    $("document").ready(function() {
			//$('.statistic-table > tbody  > tr').each(function(trIndex, trElement) {
			current_statistic_table.find("tbody > tr").each(function(trIndex, trElement) {
				$(trElement).find('td').each(function(index, element) {   
					var colVal = $(element).text();
					//console.log("colval: " + colVal);
					console.log("index / colval: " + index + " / " + colVal);
					if(index !=5 ) {
						searchString = searchString.concat("/", colVal.trim());
					}
				});
						if(! searchString.toLowerCase().match(searchKey.toLowerCase(), 'g')) {
							$(trElement).hide();
							console.log("not match: searchKey / searchString: " + searchKey + " / " + searchString);
						}
						else {
									console.log("match: searchKey / searchString: " + searchKey + " / " + searchString);
									if(matchRow++ >= 9) {
										$('#' +current_statistic_table.attr('id')).DataTable();
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

function ExcelDateToDate(excelDate, format) {
  var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
  return (date.getMonth()+1) + format + (date.getDate()-1) + format + date.getFullYear();
}

function convertDateToSpecificFormat(Date) {
	
}
var ExcelToJSON = function(path) {
	console.log("save excel file path: " + path)
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
		console.log(productList);
        // console.log(productList)
        for (i = 0; i < productList.length; i++) {
			var statistic = new Object();
			  var columns = Object.values(productList[i])
			  var date = ExcelDateToDate(columns[1], "/");
			  var subject = columns[2];
			  var cost = columns[3];
			  var note = columns[4];
			  var id = columns[5];
			  statistic.date = date;
			  statistic.subject =subject;
			  statistic.cost = cost;
			  statistic.note = note;
			  if(id === undefined) {
				  statistic.id = 'newData';
			  }else {
				  statistic.id = id;
			  }
			  statistic.status = 'active';
			  console.log(statistic);
			  choosePathToSaveExcelFile(path, statistic);
			  
        }
      })
	  loadStatisticList(current_statistic_table.attr("id"));		
    };
    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
	paginationDestory(current_statistic_table);
  var errMsg = $('span[name="errormsg"]');
  var files = evt.target.files; // FileList object
  console.log("files..................." + files[0].name)
  var fileExtension = files[0].name.split('.')[1];
  console.log("file extensions:  " + fileExtension)
  var path = files[0].name.split('_').slice(0,3).join("/");
  if(fileExtension === "xlsx" || fileExtension === "xls") {
			errMsg.hide();
			console.log("this is excel file");
			var xl2json = new ExcelToJSON(path);
			xl2json.parseExcel(files[0]);
	} else {
			errMsg.show();
			console.log("this is not excel file")
			errMsg.html("Please select excel file.");
	}
	 $('#'+current_statistic_table_id).DataTable();
}

document.getElementById('excel-file-upload').addEventListener('change', handleFileSelect, false);

function choosePathToSaveExcelFile(path, statistic) {
		if(statistic.id === 'newData') {
			console.log("new Data.")
			save(path, statistic);
		} else {
			console.log("existing Data.")
			update(statistic, path, statistic.id);
		}
}

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


function moveRightNextTable() {
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
	current_statistic_table_id = current_statistic_table.attr("id");
	loadStatisticList();
	
}

function changeBrickKiln(selectElement) {
	console.log("here select click;");
	$(".selected").removeClass("selected");
	$(selectElement).children('div').find('p').addClass("selected");
	selectedBrickKiln = $(".selected").attr("data-selected-value");
	$(".show-selected-content").html($(selectElement).children('div').find('p').html());
	var currentContainer = current_statistic_container.next();
	var topTable = $('[data-table-index="first"]');
	currentContainer.removeClass("current");
	currentContainer.hide();
	topTable.addClass("current");
	topTable.show();
	current_statistic_container = $('.current');
	current_statistic_table = current_statistic_container.find("table");
	current_statistic_table_id = current_statistic_table.attr("id");
	loadStatisticList();
}

function getPath() {
	return 'statistic/'+selectedBrickKiln+'/'+current_statistic_table_id;
}
/*
convert table to excel original code

function HtmlTOExcel(type, fun, dl) {
    var table = document.getElementById(current_statistic_table_id);
	var actionButtons = $(table).find('tbody td:last-child');
	$(actionButtons).remove();
    var wb = XLSX.utils.table_to_book(table, { sheet: "sheet1" });
    return dl ?
        XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        XLSX.writeFile(wb, fun || (getPath() + "_"+ getDate() + "." + (type || 'xlsx')));
	
}
*/

function HtmlTOExcel(type, fun) {
	paginationDestory(current_statistic_table);
    var table = document.getElementById(current_statistic_table_id);
	console.log("current table id: " + $(table).attr("id"));
	
	var thlastChild = $(table).find('thead th:last-child');
	var actionButtons = thlastChild.html();
	$(thlastChild).remove();
	
	var lastChild = $(table).find('tbody td:last-child');
	var actionButtons = lastChild.html();
	$(lastChild).remove();
    var wb = XLSX.utils.table_to_book(table, { sheet: "sheet1" });
    XLSX.writeFile(wb, fun || (getPath() + "_"+ getDate() + "." + (type || 'xlsx')));
	var trLength = $("#"+current_statistic_table_id +" tbody tr").length;
	console.log("trLength: "+ trLength);
	
	var th = `<th lang="my" class="dntinclude">လုပ်ဆောင်ချက်များ</th>`
	
	var td =`<td class="dntinclude">
				<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
				<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
				<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
			</td>`
									
	$(table).find('thead th:last-child').parent().append(th);
	$(table).find('tbody td:last-child').parent().append(td);
	 $('#'+current_statistic_table_id).DataTable();
}

function tableToCSV() {
            // Variable to store the final csv data
			paginationDestory(current_statistic_table);
            var csv_data = [];
			csv_data.push(
				[
					"number",
					"date",
					"subject",
					"cost",
					"note"
				]
			)
            // Get each row data
			current_statistic_table.find("tr").each(function(trIndex, trElement) {
				var csvrow = [];
				$(trElement).find('td').each(function(index, element) { 
					let classAttributeValue = $(element).attr("class");
					let styleAttributeValue = $(element).attr("style");
					if(classAttributeValue !== "dntinclude") {
						if( styleAttributeValue !== "display:none") {
							console.log("cols: " + element.innerHTML)
							csvrow.push(element.innerHTML);
						}
					}
				})
				csv_data.push(csvrow.join(","));
			}); 
            // Combine each row data with new line character
            csv_data = csv_data.join('\n');
 
            // Call this function to download csv file 
			 $('#'+current_statistic_table_id).DataTable();
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
            temp_link.download =  getPath() + getDate() + ".csv";
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
function blinker() {
    $('.blink-me').fadeOut(200);
    $('.blink-me').fadeIn(200);
}
setInterval(blinker, 500);

function calculateCost(calculateBtn) {
		console.log("here calculate cost......................................");
		$(".calculator").show();
		$(".card").hide();
}



function c(val) {  
   // document.getElementById("d").value=val;  
   $("#d").html(val);
}  
function v(val) {
	//document.getElementById("d").value+=val;  
	//var value = $("#d").val() += val;
	$("#d").html($("#d").html() + val);
}  
function e() {  
    try  
        {
			console.log("final res: " + $("#d").html())
			c(eval($("#d").html()))
			$('td [data-statistic-attr="cost"]').val(eval($("#d").html()));
			$('.calculator').hide();
			$('.card').show();
        }  
        catch(e)  
        {  
         c('Error') }  
} 

function backspace() {
    var temp = $('#d').html();
    $('#d').html(temp.substring(0, temp.length - 1));
}


/* for mobile 
*/ 
document.getElementById('touchmobileara').addEventListener('touchstart', handleTouchStart, false);        
document.getElementById('touchmobileara').addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 20 ) {
            /* right swipe */ 
			moveRightNextTable();
        } else {
            /* left swipe */
			
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
        } else { 
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

var statistic_table = $(".statistic-table");
var current_statistic_container = $('.current');
var current_statistic_table = current_statistic_container.find("table");
var current_statistic_table_id = current_statistic_table.attr("id");
var selectedBrickKiln = $(".selected").attr("data-selected-value");