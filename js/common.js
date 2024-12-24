
$(function () {       
    
	zoom('.zoom-drop .drop-menu button') //화면크기조정
	//listOpen('.toggle-head .btn', '.toggle-wrap') //공식 누리집 배너
	listOpen('.drop-btn', '.drop-wrap') //drop메뉴
	layerPopup('.header .btn-navi.sch') 	//통합검색

    gnb()	//gnb메뉴 
	mGnb()	//모바일 gnb메뉴

	layerPopup('.foot-quick .link')		//푸터 관련사이트

	
})



