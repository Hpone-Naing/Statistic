$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
	var actions = $("table td:last-child").html();
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		$(this).attr("disabled", "disabled");
		var index = $("table tbody tr:last-child").index();
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><input type="text" class="form-control" name="department" id="department"></td>' +
            '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
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
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });
});




$(document).ready(function(){
	let searchString = "";
	var table = $('.statistic-table');
	var tableClone = table.clone();
	var searchBtn = $('input[name="search-statistic"]');
	var tableTitleDiv = $('.table-title');
	var cardBodyDiv = $('.card-body');
	searchBtn.keyup(function(){	
		$('h1[name="errorSatus"]').remove()
		var searchKey = searchBtn.val();
		console.log("search key val:" + searchKey);
		var table = $('.statistic-table');
		var div = $('.table-responsive');
		table.remove();
		if(searchKey.length === 0) {
			 tableTitleDiv.appendTo(div);
			 tableClone.appendTo(div);
		}
	    $("document").ready(function() {
		/* var tb = $('.statistic-table:eq(0) tbody');
		 var size = tb.find("tr").length;
		 console.log("Number of rows : " + size);*/
		  tableClone.find("tr").each(function(index, element) {
			var colSize = $(element).find('td').length;
			console.log("  Number of cols in row " + (index + 1) + " : " + colSize);
			$(element).find('td').each(function(index, element) {   
				var colVal = $(element).text();
				searchString = searchString.concat("/", colVal.trim());
			  console.log("    Value in col " + (index + 1) + " : " + colVal.trim());
			});
			
			if(searchResult(searchString, searchKey)) {
				console.log("match");
			}
			else {
				tableTitleDiv.remove();
				console.log("not match");
				var errorStatus = '<h1 name = "errorSatus" >Search key: (' + searchKey + ') is not exit in the statistic table </h1>';
				cardBodyDiv.append(errorStatus);
			}
		  });
		});
    });
});

searchResult = function(searchString, searchKey) {
	//searchString.split("/").forEach(function(value) {
	var splitedString = searchString.split("/");
	//console.log("splited value: / length: " + splitedString  + " / " + splitedString.length);
    for (var i = 0; i < splitedString.length; i++) {
		//console.log("value / searchKey / match?" + searchString[i] + " / " + searchKey + " / " +searchString[i].match(searchKey, 'ig'));
		if( splitedString[i].toLowerCase().match(searchKey.toLowerCase(), 'ig')) {
			return true;
		}
	}
	return false;
	/*$.each( searchString.split("/"), function(index, value) {
		console.log("value / searchKey / match?" + value + " / " + searchKey + " / " +value.match(searchKey, 'ig'));
		var searchResult = value.match(searchKey, 'ig');
		//return searchResult != null;
		if(searchResult != null) {
			console.log("here search res not null.............................")
			return false;
		}
		return true;
		/*if(value.match(searchKey, 'ig') !== null) {
			return true;
		} else {
			return false;
		}*/
		//return value.match(searchKey, 'ig');
		/*$.each( [...value], function(index, value) {
			console.log("value: " + value);
			//return (value === searchKey);
		});
	});*/
}