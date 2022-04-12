function isMasterMenu(menus) {
	console.log("menu name: " + menus)
	var masterMenuList = ["dashboard", "charts", "tools"];
	console.log("mastere menu: " + masterMenuList);
	for(var i=0; i < masterMenuList.length;i++) {
		if(menus === masterMenuList[i]) {
			console.log("hrer same:")
			return true;
		}
	}
				console.log("hrer not same:")

	return false;
}

showHideMenus = function(menu) {
	menus = $(menu);
	menu_name = menus.attr("name");
	if(isMasterMenu(menu_name)) {
		if(menu_name === "dashboard") {
			console.log("here dashboard");
			if(menus.prop("checked") == true) {
				$('.dashboard-menu').show();
				$('.dashboardChild').show();
			} else {
				$('.dashboard-menu').hide();
				$('.dashboardChild').hide();
			}
		} else if(menu_name === "charts") {
			console.log("hre chart")
			if(menus.prop("checked") == true) {
				$('.charts-menu').show();
				$('.chartsChild').show();
			} else {
				$('.charts-menu').hide();
				$('.chartsChild').hide();
			}
		} else if(menu_name === "tools") {
			console.log("hre tools")
			if(menus.prop("checked") == true) {
				$('.tools-menu').show();
				$('.toolsChild').show();
			} else {
				$('.tools-menu').hide();
				$('.toolsChild').hide();
			}
		}
	}
	  
}