$(document).ready(function() {
	
	var detailList = $('.detail>li');
	detailList.first().show();
	var navList = $('.nav li');
	navList.click(function(event) {
		var i = $(this).index();
		navList.eq(i).addClass('current').siblings().removeClass('current');
		detailList.eq(i).show().siblings().hide();


	});
});