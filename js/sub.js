$(function () {  	
	snb();
	tabs(".depth4");
	tabs(".depth5");
	accordion(".accordion");
	dialogPop() //alert
	fileLoad(".file-input");
	layerPopup('#deptSearch')		//부서명 찾기

	//의료진소개
	listOpen('.medical-team .btn', '.medical-team .item', true)

	//통합검색-고급검색
	tabs(".total-search-cont .tabs");
	listOpen('.ico-sch1', '.sch-etc', true)

	//썸네일 포커스
	$('.thumb .swiper-slide').each(function (index) {
		$(this).attr('tabindex', 0);
		$(this).on('keydown', function (e) {
			if (e.key === 'Enter' || e.key === '') {
				e.preventDefault();
				swiperThumb.slideTo(index);
				swiperGallery.slideTo(index);
			}
		})
	})

	//카테고리를 depth4로 사용한 경우의 접근성 타이틀 재설정
	const depth4Text = $('.depth4:not(#depth4_menu_div) li.active a').text();
	if(depth4Text) {
		const docTitle = $('title').text().replace('목록 <', '목록 < ' + depth4Text + ' <');
		$('title').text(docTitle);
	}



	/* //이메일 도메인 선택
	$('.domain-select').on('change', function(){
		var selDomain = $(this).val()
		$(this).prev('.domain-input').val(selDomain);
	})
	//평점신청시 선택활성화
	$('input[name="grade_yn"]').on('change', function(){
		$('[value="Y"]').is(':checked') ? $(this).parent().siblings('select').prop('disabled', false) : $(this).parent().siblings('select').prop('disabled', true);
	}) */
})


//교육신청 iframe 타이틀
window.addEventListener('message', function(e) {
	if (e.data.booleanData == 'T'){
		document.title = e.data.titleData;
	}
})
//교육신청 iframe 높이
function eduIframeHeight(){
	window.addEventListener('message', function(e) {
		document.getElementById('edu_iframe').height = e.data.scrollHeight;
	})
}
$(function(){
	eduIframeHeight();
	$('#edu_iframe').contents().find('body').addClass('gongju');
})

