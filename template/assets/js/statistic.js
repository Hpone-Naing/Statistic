function loadBrickKilns() {
	getCollection(getPath(null,"selectBoxData")).orderByChild('status').equalTo('active').once('value', (snapshot) => {
		snapshot.forEach((child) => {
			var id = child.key;
			var brickKilnNumber = child.val().selectBoxIndex;
			var brickKilnName = child.val().selectBoxValue;
			var item = `<a class="dropdown-item preview-item" onclick="chooseItem(this)">
                    <div class="preview-thumbnail">
                      <div class="preview-icon bg-dark rounded-circle">
                        <i class="mdi mdi-close-circle-outline text-danger"></i>
                      </div>
                    </div>
                    <div class="preview-item-content">
                      <p class="text-muted ellipsis mb-0 select-item"  data-select-id = ${id} data-select-number = ${brickKilnNumber}>${brickKilnName}</p>
                    </div>
                  </a>
                  <div class="dropdown-divider"></div>`
			$(item).insertBefore('.addNewItem');
		});
	});
}

/*function loadStatisticList() {
	//console.log("select brick kiln: " + selectedBrickKiln);
	//paginationDestory(getTable());
	//var currentTableRow = $('#'+getTableById()+' tbody');
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
                    $('#'+getTableById()).DataTable();
         });
	})
}*/


$(document).ready(function(){
	//$('[data-toggle="tooltip"]').tooltip();
		// Append table with add row form on add new button click
    $(".add-new").click(function(){
		
		$(this).attr("disabled", "disabled");
		var index = $(".table tbody tr:last-child").index();
		var theadLength = $(".table thead tr th").length;
		var tr = '<tr>'
		for(var i=0;i<theadLength-2;i++) {
			tr += `<td data-column-index=${i}><input type="text" class="form-control" data-column-index=${i}></td>`
		}
		tr +='<td data-column-index="id" style="display:none"><input type="text" class="form-control" data-column-index="id" value="newData"></td>'
		tr +='<td class="dntinclude">' +
                            '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
                            '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
                            '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>' +
                        '</td></tr>'
		$(".table tbody").append(tr);
		$(".table tbody tr").eq(index + 1).find(".add, .edit").toggle();
		
		$(".table thead th").each(function(index, thead) {
			console.log("thead value: " + $(thead).html());
			if($(thead).html().replace("\u200B", "") === new String("နေ့စွဲ").replace("\u200B", "") || $(thead).html()==='ရက်စွဲ' || $(thead).html()==='ဒိတ်' || $(thead).html()==='date') {
				$('.table td:nth-child('+(index+1)+')').children().addClass("datepicker");

			}
			if($(thead).html().replace("\u200B", "") === new String("ကုန်ကျစရိတ်").replace("\u200B", "") || $(thead).html()==='သုံးစွဲငွေ' || $(thead).html()==='သုံးငွေ' || $(thead).html()==='cost') {
				$('.table td:nth-child('+(index+1)+')').children().attr("data-statistic-attr", "cost");
				$('.table td:nth-child('+(index+1)+')').children().click(calculateCost);

			}
		});
			$(".datepicker").datepicker();

    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		path = selectItemPath + "/" +chosenTablePath;
		var tbodyValueIndex = 0;
		console.log("here add button click:..........................");
		var updatedStatistic = new Object();
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
				updatedStatistic[$(this).attr('data-column-index')] = $(this).val();
				$(this).parent("td").html($(this).val());
			});		
			
			$('.table tbody tr').each(function(){
				$(this).find("td:not(:last-child)").each(function(){
					//updatedStatistic[$(this).attr('data-column-index')] = $(this).html();
				});	
			});	
			updatedStatistic.status = 'active';
			console.log(updatedStatistic);
			if(updatedStatistic.id === 'newData') {
				save(getPath(path,"tableBody"), updatedStatistic);
			} else {
				update(updatedStatistic, getPath(path,"tableBody"), updatedStatistic.id);
			}
			
			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}	
		//loadStatisticList();
		$('#'+getTableById()).DataTable();
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			/*if($(this).attr("data-statistic-attr") === 'cost') {
					$(this).html('<input type="text" class="form-control" value="' + $(this).text() +'" data-statistic-attr="'+$(this).attr("data-statistic-attr")+'" onclick="calculateCost(this)">');
			}else {*/
				$(this).html('<input type="text" class="form-control" value="' + $(this).text() +'" data-column-index="'+$(this).attr("data-column-index")+'">');
			//}
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
		$(".table thead th").each(function(index, thead) {
			console.log("thead value: " + $(thead).html());
			if($(thead).html().replace("\u200B", "") === new String("နေ့စွဲ").replace("\u200B", "") || $(thead).html()==='ရက်စွဲ' || $(thead).html()==='ဒိတ်' || $(thead).html()==='date') {
				$('.table td:nth-child('+(index+1)+')').children().addClass("datepicker");

			}
			if($(thead).html().replace("\u200B", "") === new String("ကုန်ကျစရိတ်").replace("\u200B", "") || $(thead).html()==='သုံးစွဲငွေ' || $(thead).html()==='သုံးငွေ' || $(thead).html()==='cost') {
				$('.table td:nth-child('+(index+1)+')').children().attr("data-statistic-attr", "cost");
				$('.table td:nth-child('+(index+1)+')').children().click(calculateCost);

			}
		});
			$(".datepicker").datepicker();
			
		//$('[data-statistic-attr="date"]').datepicker();
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
		paginationDestory(getTable());
		path = selectItemPath + "/" +chosenTablePath;
		var deletedStatistic = new Object();
		$(this).parents('tr').find('td[data-column-index="id"]').css('background','red');
		var id = $(this).parents('tr').find('td[data-column-index="id"]').html();
		deletedStatistic.elementId = id;
        $(this).parents("tr").remove();
		deletedStatistic.status = 'inactive';
		console.log(deletedStatistic);
		//var path = 'statistic/'+getTableById();
		deleteObj(getPath(path,"tableBody"), deletedStatistic.elementId, 'status');		
		$(".add-new").removeAttr("disabled");
		$('#'+getTableById()).DataTable();
    });
});

searchStatistics = function(search) {
	console.log("here search statistic:...................");
	var matchRow = 0;
	//paginationDestory(getTable());
	var searchBtn = $(search);	
		getTable().find("tbody, tr").show();	
		let searchString = "";
		var searchKey = searchBtn.val().trim();
		//console.log("search key: " + searchKey);
		if(searchKey === "" || searchKey === null) {
				$('#' +getTable().attr('id')).DataTable();
			
		}
	    $("document").ready(function() {
			//$('.statistic-table > tbody  > tr').each(function(trIndex, trElement) {
			getTable().find("tbody > tr").each(function(trIndex, trElement) {
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
										$('#' +getTable().attr('id')).DataTable();
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
						  $(currentElement).hide('slow');
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
	var actions = $("#"+getTable().attr("id")+" td:last-child").html();
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
		var tableHeading = [];
		var tableBodyData = [];
        // console.log(productList)
        for (i = 0; i < productList.length; i++) {
			var statistic = new Object();
			//statistic[$(this).attr('data-column-index')] = $(this).val();
			tableHeading = Object.keys(productList[i]).slice(0, Object.values(productList[i]).length);
			//var rows = Object.keys(productList[i]);
			var columns = Object.values(productList[i]);
			jQuery.each(columns, function(index, tbodyData) {
				if(index === columns.length-1) {
					statistic['id'] = tbodyData;
				} else {
				statistic[index] = tbodyData;
				}
			});
			tableBodyData.push(statistic);			  
        }
		console.log(tableHeading);
		console.log(tableBodyData);
		choosePathToSaveExcelFile(path, tableHeading, tableBodyData);
      })
	 // loadStatisticList(getTable().attr("id"));		
    };
    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
	//paginationDestory(getTable());
  var errMsg = $('span[name="errormsg"]');
  var files = evt.target.files; // FileList object
  console.log("files..................." + files[0].name)
  var fileExtension = files[0].name.split('.')[1];
  console.log("file extensions:  " + fileExtension)
  var path = selectItemPath + "/" +chosenTablePath;//files[0].name.split('_').slice(0,3).join("/");
  if(fileExtension === "xlsx" || fileExtension === "xls") {
			errMsg.hide('slow');
			console.log("this is excel file");
			var xl2json = new ExcelToJSON(path);
			xl2json.parseExcel(files[0]);
	} else {
			errMsg.show();
			console.log("this is not excel file")
			errMsg.html("Please select excel file.");
	}
	 $('#'+getTableById()).DataTable();
}

document.getElementById('excel-file-upload').addEventListener('change', handleFileSelect, false);

function choosePathToSaveExcelFile(path, theadList, tbodyList) {
		var newTheadIndex = 0;
		getCollection(getPath(path,"tableHeading")).once('value', (snapshot) => { 
			var existingTheadData="";
			snapshot.forEach((child) => {
				newTheadIndex++;
				existingTheadData = existingTheadData.concat("/",child.val().value.trim());
			});	
			console.log("exitingTheaddata: " + existingTheadData);
			jQuery.each(theadList, function(index, tHeadData) {
					if(! existingTheadData.toLowerCase().match(tHeadData.toLowerCase(), 'g')) {
						console.log("not match thead data..............");
						var statistic = {};
						var index  = newTheadIndex ++;
						var value = tHeadData;
						var id = 'newData';
						statistic.index = index;
						statistic.value = value;
						statistic.id = id;
						statistic.status = 'active';
						console.log(statistic);
						save(getPath(path,"tableHeading"), statistic);
					}					
			});
				$(document).ready(function(){
					jQuery.each(tbodyList, function(index, tBodyData) {
							console.log("tbodyId: " + tBodyData.id);
							if(tBodyData.id === 'new' || tBodyData.id === "newData") {
								console.log(tBodyData);
								tBodyData.status = 'active';
								save(getPath(path,"tableBody"), tBodyData);
							} else {
								tBodyData.status = 'active';
								update(tBodyData, getPath(path,"tableBody"), tBodyData.id);
							}							
					});
				});
		});
		
		/*if(statistic.id === 'newData') {
			console.log("new Data.")
			save(path, statistic);
		} else {
			console.log("existing Data.")
			update(statistic, path, statistic.id);
		}*/
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
	headingIndex = 0;
	chosenTablePath +=1;
	path = selectItemPath + "/" +chosenTablePath;
	defaultStatisticPageUi();
	loadTableData(path);
	$('.displaytablebtn-plus').show();
}

function moveLeftNextTable() {
	headingIndex = 0;
	if(chosenTablePath > 0 ) {
		chosenTablePath -=1;
	}
	path = selectItemPath + "/" +chosenTablePath;
	defaultStatisticPageUi();
	loadTableData(path);
	$('.displaytablebtn-plus').show();

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
	currentContainer.hide('slow');
	topTable.addClass("current");
	topTable.show();
	current_statistic_container = $('.current');
	getTable() = current_statistic_container.find("table");
	getTableById() = getTable().attr("id");
	//loadStatisticList();
}

function getPath(path, options) {
	console.log("here getpath............");
	console.log("path / option: " + path + " / " + options)
	if(path === undefined || path === null) {
		return 'statistic'+"/"+options;
	}
	return 'statistic/'+path + "/" + options; 
}
/*
convert table to excel original code

function HtmlTOExcel(type, fun, dl) {
    var table = document.getElementById(getTableById());
	var actionButtons = $(table).find('tbody td:last-child');
	$(actionButtons).remove();
    var wb = XLSX.utils.table_to_book(table, { sheet: "sheet1" });
    return dl ?
        XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        XLSX.writeFile(wb, fun || (getPath() + "_"+ getDate() + "." + (type || 'xlsx')));
	
}
*/

function HtmlTOExcel(type, fun) {
	
	var statisticList = [];
	getTable().find("tbody > tr").each(function(trIndex, trElement) {
				var statistic = {};
				$(trElement).find('td:not(:last-child)').each(function(index, element) {
					
					if($(element).is(":visible")){
						var key = $('[data-thead-index="'+$(element).attr("data-column-index")+'"]').text();
						var value = $(element).text();
						statistic[key] = value;
					}					
				});
				statisticList.push(statistic);
			});
	console.log(statisticList)
	
	var wb = XLSX.utils.book_new();
    var wsStatistic = XLSX.utils.json_to_sheet(statisticList);
    XLSX.utils.book_append_sheet(wb, wsStatistic, "statistics");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data1 = new Blob([excelBuffer], { type: fileType });
    saveAs(data1, getPath() + "_"+ getDate() + ".xlsx"); 

	
	/*paginationDestory(getTable());
    var table = document.getElementById("statistic");
	//console.log("current table id: " + $(table).attr("id"));
	
	var thlastChild = $(table).find('thead th:last-child');
	var actionButtons = thlastChild.html();
	$(thlastChild).remove();
	
	var lastChild = $(table).find('tbody td:last-child');
	var actionButtons = lastChild.html();
	$(lastChild).remove();
    var wb = XLSX.utils.table_to_book(table, { sheet: "sheet1", display:true });
	console.log(wb);
    XLSX.writeFile(wb, fun || (getPath() + "_"+ getDate() + "." + (type || 'xlsx')));
	var trLength = $("#"+getTableById() +" tbody tr").length;
	
	var th = `<th lang="my" class="dntinclude">လုပ်ဆောင်ချက်များ</th>`
	
	var td =`<td class="dntinclude">
				<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
				<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
				<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
			</td>`
									
	$(table).find('thead th:last-child').parent().append(th);
	$(table).find('tbody td:last-child').parent().append(td);
	 $('#'+getTableById()).DataTable();*/
}

function tableToCSV() {
            // Variable to store the final csv data
			paginationDestory(getTable());
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
			getTable().find("tr").each(function(trIndex, trElement) {
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
			 $('#'+getTableById()).DataTable();
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

function downloadExcelFile(excel_data) {
            // Create CSV file object and feed
            // our csv_data into it
           excelFile = new Blob([excel_data], {
                type: "text/csv"
            });
 
            // Create to temporary link to initiate
            // download process
            var temp_link = document.createElement('a');
 
            // Download csv file
            temp_link.download =  getPath() + getDate() + ".xlsx";
            var url = window.URL.createObjectURL(excelFile);
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

showResult;
function calculateCost() {
		console.log("here calculate cost......................................");
		$(".calculator").show();
		$(".card").hide('slow');
		showResult = $(this);
		console.log("val: " + showResult.val())
		return showResult;
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
			//$('td [data-statistic-attr="cost"]').val(eval($("#d").html()));
			//showRes = calculateCost();
			console.log(showResult.val());
			showResult.val(eval($("#d").html()));
			$('.calculator').hide('slow');
			$('.card').show();
        }  
        catch(e)  
        {  
			c('Error') 
			console.log(e);
		}  
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

var tableTotal = 0;
function displayTableArea() { 
	$('.table-area').show();
	$('.table').attr("data-table-number",tableTotal++);
	$('div[name="displayTableBtn"]').hide('slow');
}

function addTitle(title) {	
	path = selectItemPath + "/" +chosenTablePath;
	console.log("path: " + path);
	newTitle = $(title);
	id = newTitle.parent().attr("data-title-id");;
	value = newTitle.val();
	newTitle.parent().html(newTitle.val());
	var tableTitle = {};
	tableTitle.id = id;
	tableTitle.value = value;
	if(tableTitle.id === 'newData') {
		save(getPath(path,"tableTitle"), tableTitle);
	} else {
		update(tableTitle, getPath(path,"tableTitle"), tableTitle.id);
	}
	$('.show-more').show();
	$('.add-row').show();
}

function changeTitle(title) {
	console.log("here change=title click........");
		$(title).parent().find(".title-table").html("<input type='text' class='form-control' style='width:auto; display:inline' onblur='addTitle(this)'>");
		
}
$(document).ready(function(){
	$(".change-title").click(function(){
		console.log("here change=title click........");
		$(this).parent().find(".title-table").html("<input type='text' class='form-control' style='width:auto; display:inline' onblur='addTitle(this)'>");
		
	});
});



var headingIndex = 0;
function prepareTableHeading() {
	var tableHeadCreateBtn =  `<th>
									<a class="showColumn" title="activate" data-toggle="tooltip" onclick="showColumn(this)"  style="display:none"><i class="material-icons">done</i></a>
									<a class="hideColumn" title="Inactivate" data-toggle="tooltip" onclick="hideColumn(this)"><i class="material-icons">&#xE872;</i></a>
									<input class="form-control theadValue" type="text" data-thead-id = "newData" data-heading-index=${headingIndex++} placeholder="ခေါင်းစဥ်ထည့်ရန်" required>
								</th>`
	$(".theadCreationRow").append(tableHeadCreateBtn);
	$("theadCreationRow th").find(".edit, .delete").toggle();
	//$("#tableHeadCreation").html(tr);	
}

function hideColumn(hideColumn) {
	path = selectItemPath + "/" +chosenTablePath;
	console.log("heelo hide");
	var hideColumnIndex = $(hideColumn).parent().children("input").attr("data-heading-index");
	console.log("id: " +hideColumnIndex );
	$(hideColumn).parent().children("input").prop("disabled",true);
	//$('.table td:nth-child('+(hideColumnIndex)+'),.table th:nth-child('+(hideColumnIndex)+')').hide();
	$('table').find(`[data-column-index='${hideColumnIndex}']`).hide('slow');
	$('table').find(`[data-thead-index='${hideColumnIndex}']`).hide('slow');
	//var id = $('[data-thead-index="'+(hideColumnIndex)+'"]').attr('data-thead-id');
	var id = $(hideColumn).parent().children("input").attr('data-thead-id');
	deleteObj(getPath(path,"tableHeading"),id,"status");
	$(hideColumn).hide('slow');
	$(hideColumn).parent().find(".showColumn").show();
}

function showColumn(showColumn) {
	console.log("heelo show");
	var showColumnId = $(showColumn).parent().children("input").attr("data-heading-index");
	console.log("id: " +showColumnId );
	$(showColumn).parent().children("input").prop("disabled",false);
	//$('.table td:nth-child('+(showColumnId)+'),.table th:nth-child('+(showColumnId)+')').show();
	$('table').find(`[data-column-index='${showColumnId}']`).show();
	$('table').find(`[data-thead-index='${showColumnId}']`).show();
	var id = $(showColumn).parent().children("input").attr('data-thead-id');
	activeObject(getPath(path,"tableHeading"),id,"status");
	$(showColumn).hide('slow');
	$(showColumn).parent().find(".hideColumn").show();
}

function createTableHeading() {
	path = selectItemPath + "/" +chosenTablePath;
	var tableHeadDataList = [];
	var tableHeadData = {};
	$(".show-more").show();
	$(".thead-creation-area").hide('slow');
	var oldTheadLength = $(".table thead tr th").length; 
	$(".table thead").find("tr").remove();
	let theadRow ="<tr>";
	var inactiveTheadIndexList = [];
	$(".theadValue").each(function(index, thead) {			
			const theadValue = $(thead).val();
			var index = $(thead).attr("data-heading-index");
			var value = theadValue;
			var id = $(thead).attr('data-thead-id');
			tableHeadData.id = id;
			tableHeadData.index = index;
			tableHeadData.value = value;
			if($(thead).prop('disabled')) {
				inactiveTheadIndexList.push(index);
				tableHeadData.status = 'inactive';
				theadRow += `<th data-thead-index=${index} id=${id} style="display:none">${theadValue}</th>`
			} else {
				tableHeadData.status = 'active';
				theadRow += `<th data-thead-index=${index} id=${id}>${theadValue}</th>`
			}
				if(tableHeadData.id === 'newData') {
					save(getPath(path,"tableHeading"), tableHeadData);
				} else {
					update(tableHeadData, getPath(path,"tableHeading"), tableHeadData.id);
				}
			//theadRow += `<th data-thead-index=${index} id=${id}>${theadValue}</th>`
	});
	theadRow += '<th style="display:none"></th><th lang="my" class="dntinclude">လုပ်ဆောင်ချက်များ</th></tr>';
	$('.table thead').append(theadRow);
	
	console.log(inactiveTheadIndexList);

	if($('.table tbody tr').length > 0) {
		console.log("tbody tr length: " + $('.table tbody tr').length);
		var newTheadLength = $(".table thead tr th").length;
		var existingTdValue = "";
		console.log("old thead length: " + oldTheadLength);
				console.log("new thead length: " + newTheadLength);
		$('.table tbody tr').each(function(){	
			var tr = '<tr>';
			for(var j=0;j<newTheadLength-2;j++) {
				if(j<oldTheadLength-2) {
					if($(this).children("td").find("input").length ===0) {
						existingTdValue = $(this).find("td").eq(j).html();
					} else {
						existingTdValue = $(this).find("td").eq(j).children("input").val();
					}
					tr += `<td data-column-index=${j}><input type="text" class="form-control" data-column-index=${j} value=${existingTdValue}></td>`

				} else {
					existingTdValue = "";
					tr += `<td data-column-index=${j}><input type="text" class="form-control" data-column-index=${j} value=${existingTdValue}></td>`

				}
				//console.log("existing value: " + existingTdValue)
			}
			if($(this).children("td").find("input").length ===0) {
				id = $(this).find("td").eq(oldTheadLength-2).html();
			} else {
				id = $(this).find("td").eq(oldTheadLength-2).children("input").val();
			}
			tr += `<td data-column-index="id" style="display:none"><input type="text" class="form-control" data-column-index="id" value=${id}></td>`
			tr +='<td class="dntinclude">' +
								'<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
								'<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
								'<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>' +
							'</td></tr>'
			
			$(this).remove();
			$(".table tbody").append(tr);
		});			
		for(var hideIndex =0; hideIndex<inactiveTheadIndexList.length; hideIndex++) {
								console.log("here loop..........................")
								console.log("hideIndex: " + hideIndex);
								$('table').find(`[data-column-index='${inactiveTheadIndexList[hideIndex]}']`).hide('slow');
								$('table').find(`[data-thead-index='${inactiveTheadIndexList[hideIndex]}']`).hide('slow');
		}
		var index = $(".table tbody tr:last-child").index();
		$(".table tbody tr").children().find(".add, .edit").toggle();
		
		$(".table thead th").each(function(index, thead) {
			console.log("thead value: " + $(thead).html());
			if($(thead).html().replace("\u200B", "") === new String("နေ့စွဲ").replace("\u200B", "") || $(thead).html()==='ရက်စွဲ' || $(thead).html()==='ဒိတ်' || $(thead).html()==='date') {
				$('.table td:nth-child('+(index+1)+')').children().addClass("datepicker");

			}
			if($(thead).html().replace("\u200B", "") === new String("ကုန်ကျစရိတ်").replace("\u200B", "") || $(thead).html()==='သုံးစွဲငွေ' || $(thead).html()==='သုံးငွေ' || $(thead).html()==='cost') {
				$('.table td:nth-child('+(index+1)+')').children().attr("data-statistic-attr", "cost");
				$('.table td:nth-child('+(index+1)+')').children().click(calculateCost);

			}
		});
			$(".datepicker").datepicker();
	}	
}

function addNewSelect() {
	var item = `<a class="dropdown-item preview-item" onclick="chooseItem(this)">
                    <div class="preview-thumbnail" >
                      <div class="preview-icon bg-dark rounded-circle">
                        <i class="mdi mdi-close-circle-outline text-danger"></i>
                      </div>
                    </div>
                    <div class="preview-item-content" >
                      <p class="text-muted ellipsis mb-0 select-item" data-select-id = "newData">
									<input class="form-control selected-item" type="text" placeholder="ဖိုနာမည်" required onblur="addItem(this)">
								</th>
					  </p>
                    </div>
                  </a>
                  <div class="dropdown-divider"></div>`
	//$('.dropdown-menu').append(item);
	$(item).insertBefore('.addNewItem');
}

function deleteItem() {
  console.log("here delete Item..........");	
}

var selectBoxtotal = 0;
function addItem(item) {
	newItem = $(item);
	parentNode = newItem.parent();
	newItem.parent().attr("data-select-number", selectBoxtotal++);
	newItem.parent().html(newItem.val());
	var formData = {};
	formData.id = parentNode.attr("data-select-id");
	formData.selectBoxIndex = parentNode.attr("data-select-number");
	formData.selectBoxValue = parentNode.html();
	formData.status = 'active';
	console.log(formData);
	save(getPath(null,"selectBoxData"), formData)
}

function showStatisticCreationArea() {
	$(".show-more").hide('slow');
	$(".thead-creation-area").show();
}

function defaultStatisticPageUi() {
	$('.displaytablebtn-plus').hide();
	$('.table-area').hide();
	$('.add-row').hide();
	$('.show-more').hide();
	$('.thead-creation-area').hide();
	//paginationDestory(getTable());
	$('.table thead tr').remove();
	$('.table tbody tr').remove();
	$('.theadCreationRow').children('th').remove();
	$('.title-table').html('ခေါင်းစဥ်ထည့်ရန်');
}

function dataExitStatisticPageUi() {
	$('.displaytablebtn-plus').hide('slow');
	$('.table-area').show();
	$('.add-row').show();
	$('.show-more').show();
	$('.thead-creation-area').hide('slow');


}

function chooseItem(i) {
	defaultStatisticPageUi();
	$('.change-right-next-btn').show();
	$('.change-left-next-btn').show();
	headingIndex = 0;
	chosenTablePath = 0;
	console.log("here choose item.......................");
	$('.selected').removeClass("selected");
	$(i).children(".preview-item-content").find("p").addClass("selected");
	selectItemPath = $('.selected').attr('data-select-number');
	$('.displaytablebtn-plus').show();
	$(".show-selected-content").html($(i).children(".preview-item-content").find("p").text());
	console.log("selectItemPath: " + selectItemPath);
	path = selectItemPath + "/" +chosenTablePath;
	loadTableData(path);
}

function loadTableData(path) {
	getCollection(getPath(path,"tableTitle")).once('value', (snapshot) => {  
		snapshot.forEach((child) => {
			var id = child.key;
			var value = child.val().value;
			$('.title-table').attr('data-title-id',id);
			$('.title-table').html(value);
		});	
	});
	getCollection(getPath(path,"tableHeading")).once('value', (snapshot) => {
	//paginationDestory(getTable());
	console.log("There are "+snapshot.numChildren()+" datas");
	$('.theadCreationRow th').remove();
	$(".table thead").find("tr").remove();
	var tr = '<tr></tr>'
	var inactiveTheadIndexList = [];
	$('.table thead').append(tr);
	if(snapshot.numChildren() > 0) {
		dataExitStatisticPageUi();
		snapshot.forEach((child) => {
				var id = child.key;
				var index = child.val().index;
				var value = child.val().value;
				var status = child.val().status;
				headingIndex = parseInt(index)+1;
				var theadRow = "";
				var tableHeadCreateBtn = "";
			if(status === 'active') {		
				theadRow += `<th data-thead-id=${id} data-thead-index=${index}>${value}</th>`
				tableHeadCreateBtn =  `<th>
											<a class="showColumn" title="activate" data-toggle="tooltip" onclick="showColumn(this)"  style="display:none"><i class="material-icons">done</i></a>
											<a class="hideColumn" title="Inactivate" data-toggle="tooltip" onclick="hideColumn(this)"><i class="material-icons">&#xE872;</i></a>
											<input class="form-control theadValue" type="text" data-thead-id = ${id} data-heading-index=${index}  placeholder="ခေါင်းစဥ်ထည့်ရန်" value=${value} required>
										</th>`
			$(".theadCreationRow").append(tableHeadCreateBtn);
			} else {
				theadRow += `<th data-thead-id=${id} data-thead-index=${index} style="display:none">${value}</th>`
				tableHeadCreateBtn =  `<th>
											<a class="showColumn" title="activate" data-toggle="tooltip"onclick="showColumn(this)" ><i class="material-icons">done</i></a>
											<a class="hideColumn" title="Inactivate" data-toggle="tooltip" onclick="hideColumn(this)"  style="display:none"><i class="material-icons">&#xE872;</i></a>
											<input class="form-control theadValue" type="text" data-thead-id = ${id} data-heading-index=${index}  placeholder="ခေါင်းစဥ်ထည့်ရန်" value=${value}  disabled>
										</th>`
			$(".theadCreationRow").append(tableHeadCreateBtn);
				inactiveTheadIndexList.push(index);
			}
			
			$('.table thead tr').append(theadRow);
		});
			$(document).ready(function() {
				console.log(inactiveTheadIndexList);		
				var defaultTheead ='<th style="display:none"></th><th lang="my" class="dntinclude">လုပ်ဆောင်ချက်များ</th>';
				$('.table thead tr').append(defaultTheead);
				getCollection(getPath(path,"tableBody")).orderByChild('status').equalTo('active').once('value', (snapshot) => {
					var tbodyDatas = snapshot.val();
					var i = 0;
					for(let index in tbodyDatas){
						keys = Object.keys(tbodyDatas[index])
						var tr = "<tr>"
						for(var i =0;i<keys.length-2;i++) {
						//$.each(keys, function( i, key ) {
						//for(let key in keys) {
							console.log("tbody datas: " + tbodyDatas[index][keys[i]]);
							 tr += `<td data-column-index=${i}>${tbodyDatas[index][keys[i]]}</td>`
						///});
						}
						tr += `<td data-column-index='id' style="display:none">${index}</td><td class="dntinclude">'
											<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
											<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
											<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
										</td></tr>`
						$('.table tbody').append(tr);
						console.log("after append tr....................")
					}
					for(var hideIndex =0; hideIndex<inactiveTheadIndexList.length; hideIndex++) {
								console.log("here loop..........................")
								console.log("hideIndex: " + hideIndex);
								$('table').find(`[data-column-index='${inactiveTheadIndexList[hideIndex]}']`).hide('slow');
					}
					//$(document).ready(function() {
						//$('#'+getTableById()).DataTable();
					//});
					
				});
			});
		} else {
			console.log("no data to load!");
		}
	});
}

function hideTheadCreationAarea() {
	//$(".thead-creation-area").hide();
	$(".thead-creation-area").hide('slow'); 
	$('.show-more').show();
}

function excelDateToJSDate(serial) {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;                                        
    const date_info = new Date(utc_value * 1000);
 
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    let total_seconds = Math.floor(86400 * fractional_day);
 
    const seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, 
         minutes, seconds);
}
  
var statistic_table = $(".statistic-table");
var selectItemPath = $('.selected').attr('data-select-number');
var chosenTablePath = 0;
table = $(".table");
function getTable() {
	return $('table');
}

function getTableById() {
	return 'statistic';
}
/*var current_statistic_container = $('.current');
var getTable() = current_statistic_container.find("table");
var getTableById() = getTable().attr("id");
var selectedBrickKiln = $(".selected").attr("data-selected-value");*/