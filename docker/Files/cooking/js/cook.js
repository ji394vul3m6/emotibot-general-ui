$(document).ready(function() {

	// js 初始化CSS, 让第一个li显示
	var showList = $('.show>li.son');
	showList.first().show();
	// 点击导航样式切换
	
	var navList = $('.head li');
	navList.click(function(event) {

		var i =$(this).index();
		navList.eq(i).addClass('current').siblings('li').removeClass('current');
		showList.eq(i).show().siblings('li.son').hide();

	});
});