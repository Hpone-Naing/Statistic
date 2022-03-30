$(document).ready(function(){
	//$('[data-toggle="tooltip"]').tooltip();
	var actions = $(".statistic-table td:last-child").html();
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		console.log("here add new button ..")
		//$(this).attr("disabled", "disabled");
		var index = $(".statistic-table tbody tr:last-child").index();
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



searchStatistics = function(search) {
	console.log("here search statistic: ");
	//var searchBtn = $('input[name="search-statistic"]');
	//console.log("display or not : " + searchBtn.css('display') == 'none');
	var searchBtn = $(search);
	searchBtn.keyup(function(){
		console.log("tr length: " + $(".statistic-table tbody tr ").length);
		$(".statistic-table tbody tr ").show();		
		let searchString = "";
		var searchKey = searchBtn.val().trim();
	    $("document").ready(function() {

			$('.statistic-table > tbody  > tr').each(function(trIndex, trElement) {
				$(trElement).find('td').each(function(index, element) {   
					var colVal = $(element).text();
					searchString = searchString.concat("/", colVal.trim());
				});
						if(! searchString.toLowerCase().match(searchKey.toLowerCase(), 'g')) {
							$(trElement).hide();
						}
						else {
						}
						searchString = "";

			});
		});
    });
}

translate = function(translateButton){
	window.alert("here translate.........................")
	var translateBtn = $(translateButton);
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
var statistic_table = $(".statistic-table");