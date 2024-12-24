const AC = "active",
    FX = "fixed",
    ALL = "all_nav",
    $html = $("html"),
    $wrap = $("#wrap"),
    $header = $(".header"),    
    $schLayer = $(".sch_layer"),
    $goTop = $(".go_top"),
    $footer = $(".footer"),
	$layerOpen = $(".layer_open") 

/* Mobile detection ----------------------------------------------------------------- */
function isMobile() {
    return window.innerWidth < 1024; //ipad pro(1024)는 web화면
}
/*  initial setup of accessibility -------------------------------------------------- */
function accessInit(el) {
    $(el).attr('aria-expanded', 'false')
    //$(el).append('<span class="sr-only">' + OpenTxt + '</span>').attr('aria-expanded', 'false')
}

/* -------------------------------------------------------------------------------------
*   화면크기
------------------------------------------------------------------------------------- */
function zoom(el) {
    const   zoomLevels = [0.9, 1, 1.1, 1.2, 1.3],
            classNames = ['xsm', 'sm', 'md', 'lg', 'xlg'],
            $item = $(el);
    let zoom = 1;        
    
    $html.on('click', el, function(){
        const $na = $(this);

        $na.attr('aria-selected', true).parent().addClass(AC).siblings().removeClass(AC).children().removeAttr('aria-selected')/*.attr('aria-selected', false)*/
        $.each(classNames, function(index, className) {
            if ($na.hasClass(className)) zoom = zoomLevels[index];
        });
        //초기화
        if($na.hasClass('ico-reset')) {
            $html.css('zoom', 1);
            $item.eq(1).attr('aria-selected', true).parent().addClass(AC).siblings().removeClass(AC).children().removeAttr('aria-selected')/*.attr('aria-selected', false)*/
        }
        localStorage.setItem('zoomDefault', zoom);
        $html.css('zoom', zoom);
    })

    //로컬 저장
    zoom = localStorage.getItem('zoomDefault') || 1;
    $html.css('zoom', zoom);
    $.each(zoomLevels, function (index, zoomLevel){
        if(zoom == zoomLevel) $item.eq(index).attr('aria-selected', true).parent().addClass(AC)
    })
}

/*  ------------------------------------------------------------------------------------
*    gnb & 전체메뉴 
------------------------------------------------------------------------------------- */
function gnb(el) {
    const   FLM = "fullmenu",
            $gnb1 = $(".gnb1"),
            $gnb2 = $(".gnb2"),
            $gnb1Depth1 = $(".gnb1").find(".depth1"),
            $gnb2Depth1 = $(".gnb2").find(".depth1")

    if (el=="full") { //전체메뉴 
        $gnb1.addClass(FLM)
        $gnb1.on("mouseenter focusin", function () {
            $gnb1Depth1.add($header).addClass(AC)
        }).on("mouseleave", function () {
            $gnb1Depth1.add($header).removeClass(AC)
        })
        $gnb1Depth1.on("mouseenter focusin", function () {
            $(this).addClass("on")
        }).on("mouseleave focusout", function () {
            $(this).removeClass("on")
        })
    } else { //기본gnb
        $gnb1Depth1.on("mouseenter focusin", function() {
            $(this).add($header).addClass(AC).siblings().removeClass(AC)
        }).on("mouseleave focusout", function() {
            $(this).add($header).removeClass(AC)
        })
    }

    //3차뎁스를 갖고있는 상위요소에 클래스부여
    $(".depth3").each(function() {
        $(this).parent().addClass("is-depth3")
    })
    //접근성 탭포커스로 메뉴영역을 벗어났을때
    $(".topmenu").find(">li>a").on("click keydown", function(e) {       
        if (e.keyCode == 9 && e.shiftKey) $header.add($gnb1Depth1).removeClass(AC)
    }).next().find("a:last").on("keydown", function(e) {
        if (e.keyCode == 9) $header.add($gnb1Depth1).removeClass(AC)
    })  
    //모바일
    $header.on("click", ".is-depth3>a", function(e) {
        if (mobile()) active(this, "toggle")
    })

    //전체메뉴
    $(".gnb_util .btn_allmenu").on("click", function(){
		$gnb2.add($html).addClass(AC)
        if (mobile()) { 
            $header.addClass(ALL)
            $gnb2Depth1.eq(0).addClass(AC)
        }
	})
    $gnb2Depth1.on("click", function(e){
        e.preventDefault()
        $(this).addClass(AC).siblings().removeClass(AC)
    });    
    $gnb2.find(".allmenu_close").on("click", function(e){
		$(this).parent().removeClass(AC)
        $html.removeClass(AC)
        if (mobile()) { 
            $header.removeClass(ALL) 
            $gnb2Depth1.removeClass(AC)
        }
        e.preventDefault()
	})    
}

/*  ------------------------------------------------------------------------------------
*   snb
------------------------------------------------------------------------------------- */
function snb(){
	const   $snb = $('#snb');

    // snb 접근성 세팅
    $snb.find('#left_menu_top li>a').each(function(){
        const   $na = $(this),
                $parent = $na.parent(),
                isActive = $parent.hasClass(AC);

        if (isActive) $na.attr('aria-current', 'page')
        if ($na.next('ul').length > 0) { //3차뎁스
            $na.attr('aria-expanded', isActive ? 'true' : 'false').removeAttr('aria-current')
            $parent.addClass('is-depth3')
        }
    });

    // 하위 3차뎁스를 갖고 있는 메뉴를 클릭했을때
    $snb.on('click', '.is-depth3>a', function(e) {
        const   $na = $(this),
                $parent = $na.parent(),
                isActive = $parent.hasClass(AC);
        
        e.preventDefault()
        if (!isActive){
            $parent.addClass(AC).siblings().removeClass(AC)
            $('.is-depth3').find('>a').attr('aria-expanded', 'false')
            $na.attr('aria-expanded', 'true')
        }
    }); 
}

/*  -------------------------------------------------------------------------------------
*   리스트 열고 닫기			listOpen('.sns .sns_btn', 'target클래스명') 
----------------------------------------------------------------------------------------- */
function listOpen(el, target, noAnyClick){
    accessInit(el);

    const $el = $(el);

    $html.on('click', el, function(e) { 
        const   $na = $(this),
                $elTarget = $na.closest(target),
                isActive = $elTarget.hasClass(AC)

        e.preventDefault()     
        if(!isActive) $html.trigger('click')
        $elTarget.toggleClass(AC)     
        $na.attr('aria-expanded', isActive ? 'false' : 'true') 
        .find(srOnly).text(isActive ? OpenTxt : CloseTxt)
    })
    if(!noAnyClick){
        $html.on('click', function(e) {
            if(!$(e.target).closest(target).length){
                $(target).removeClass(AC)
                .find(el).attr('aria-expanded', 'false')
                .find(srOnly).text(OpenTxt)
            }
        })
    }
    $(target).on('click', '.btn-close', function(e){
        $el.trigger('click');
    })
}

/*  ------------------------------------------------------------------------------------
*   data값으로 열고 닫기			dataOpen('클릭할 클래스명') 
------------------------------------------------------------------------------------- */
function dataOpen(el){
    accessInit(el);

    $(el).on('click', function() {			
        const   $na = $(this),
                isActive = $na.hasClass(AC)
        $('#' + $na.data('id')).toggle();
        $na.toggleClass(AC).attr('aria-expanded', isActive ? 'false' : 'true').find(srOnly).text(isActive ? OpenTxt : CloseTxt);
    }) 
}

/*  ------------------------------------------------------------------------------------
*   팝업 또는 레이어 열고 닫기
------------------------------------------------------------------------------------- */
let $clickSpot;

function layerPopup(el){
    accessInit(el);
    const OL = 'opened-layer';

	$(el).on('click', function(e) {	
        e.preventDefault();

        $clickSpot = $(this);
        const isActive = $clickSpot.hasClass(AC);

        $clickSpot.toggleClass(AC).attr('aria-expanded', isActive ? 'false' : 'true')
		$('#' + $(this).data('id')).attr('tabindex', 0).fadeIn(300).focus().addClass(OL);
		$html.addClass(ScrollNo);
    })	

	$html.on('click', '.opened-layer .popup-close', function(e) {	
        e.preventDefault();
        $(this).closest('.opened-layer').removeAttr('tabindex').fadeOut(100).removeClass(OL);
		$html.removeClass(ScrollNo);
		$clickSpot.focus().removeClass(AC).attr('aria-expanded', 'false');
    })
}

/*  ------------------------------------------------------------------------------------
*    tab메뉴 - 페이지가 전환되는 탭메뉴(ex. depth4, depth5)             tabs(this)
*    tab메뉴와 콘텐츠가 포함된 경우                                     tabs(this, "탭콘텐츠")
------------------------------------------------------------------------------------- */
function tabs(el, cont) {
    const tabLi = $(el).find('>li').length
	$(el).addClass("num" + tabLi + "")

	
	//탭콘텐츠 내에서 전환되는 경우
	if(cont) {
        //탭메뉴 접근성
        $(el).find('li.active')
            .children('a, button').attr('aria-selected', true)
            .parent().siblings('li').find('>a, >button').attr('aria-selected', false)

        $(el).on("click", ">li>a, >li>button", function(e){
            $(this).attr('aria-selected', true).parent().addClass(AC)
            .siblings().removeClass(AC).find(">button, >a").attr('aria-selected', false)
            $("#"+$(this).data('id')).addClass(AC).siblings().removeClass(AC)
            e.preventDefault()
        })
	}else{
        //탭메뉴 접근성
        $(el).find('li.active')
            .children('a, button').attr('aria-current', 'page')

        //탭메뉴(모바일)
        $(el).find('li>a, li>button').on("click", function(e) {
            if (isMobile() && $(this).parent().hasClass(AC)) {
                e.preventDefault()
                $(this).parents(el).toggleClass(AC)
            }
        })
        //탭메뉴(모바일) : 벗어난 곳 클릭시 탭메뉴 닫히게
        $html.on('click', function(e) {
            if(!$(e.target).closest(el).length) $(el).removeClass(AC)
        })
    }
}

/*  ------------------------------------------------------------------------------------
*   스크롤에 따라 콘텐츠 활성화                            scrollAC(".main .section")
------------------------------------------------------------------------------------- */
function scrollAC(cont) {
    const $cont = $(cont)	
	$(window).on("load scroll", function() {    
		$cont.each(function (i) {
			contTop = $(this)[0].getBoundingClientRect().top
			//콘텐츠 Active
			contTop < $(window).height()*0.75 ? $(this).addClass(AC) : $(this).removeClass(AC)
		})        
		
	})
}

/* -------------------------------------------------------------------------------------
*   아코디언 - details로 수정( ※name속성을 W3C Validation에서 오류로 인식하기 때문에 data-name으로 그룹설정)
------------------------------------------------------------------------------------- */
function accordion(el){
    const $el = $(el)
    
    //전체 details 스캔해서 open 되어 있는거에 active지정
    $el.children('details').each(function(){
        $(this).attr('open') ? $(this).addClass(AC).find('summary i').append('<span class="sr-only">' + CloseTxt + '</span>') : $(this).removeClass(AC).find('summary i').append('<span class="sr-only">' + OpenTxt + '</span>')
    }) 
    
    //summary클릭했을때
	$el.on('click', 'summary', function(){           
        const   $details = $(this).parent('details'),
                isOpen = $details.attr('open'),
                $accordion = $(this).parents(el),
                $btnAll = $accordion.find('.btn-all');

        $details.toggleClass(AC, !isOpen).find("summary i .sr-only").text(!isOpen ? CloseTxt : OpenTxt)

        //details가 열리면? 전체버튼 닫기 : 열기
        $accordion.children('details').hasClass(AC) ? $btnAll.addClass(AC).find("span").text(CloseTxt) : $btnAll.removeClass(AC).find("span").text(OpenTxt)        
    })

    //전체 버튼 클릭했을때
    $el.on('click', '.btn-all', function () {
        $(this).hasClass(AC) ? $(this).parents(el).find('details.active summary').trigger('click') : $(this).parents(el).find('summary').trigger('click');
    })
}

/*  ------------------------------------------------------------------------------------
* dialog
------------------------------------------------------------------------------------- */

function dialogPop(){
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('open-dialog')) {
            const dialogId = target.dataset.target;
            const dialog = document.getElementById(dialogId);
            if (dialog) {
                dialog.showModal();
            }
        } else if (target.classList.contains('btn-close') || target.closest('.btn-close') || target.classList.contains('btn-cancel')){
            const dialog = target.closest('.dialog');
            if (dialog) {
                dialog.close();
            }
        }
    });     
}

/*  ------------------------------------------------------------------------------------
* 첨부파일
------------------------------------------------------------------------------------- */
function fileLoad(fileBox) {
    let $fileBox = $(fileBox);
    $.each($fileBox, function(idx){
        var $this = $fileBox.eq(idx),
            $btnUpload = $this.find('[type="file"]'),
            $label = $this.find('.file-label');
        
        $btnUpload.on('change', function() {
            var $target = $(this),
                fileName = $target.val(),
                $fileText = $target.siblings('.file-name');
            $fileText.val(fileName);
        })        
        $btnUpload.on('focusin focusout', function(e) {
            e.type == 'focusin' ?
            $label.addClass('file-focus') : $label.removeClass('file-focus');
        })    
    })
}	

/* -------------------------------------------------------------------------------------
*   공통 - header 고정, top버튼, 접근성(아이콘, target처리)
------------------------------------------------------------------------------------- */
$(function(){
	//header 고정
	let lastScroll
	$(window).on('load scroll', function() {
		let scrollT = $(this).scrollTop()
		scrollT > lastScroll ? $('#header').addClass(FX) : $('#header').removeClass(FX)
		lastScroll = scrollT
	})
	//top버튼
	$(window).on('load scroll', function() {
		$(window).scrollTop() > 0 ? $('.go-top').addClass(FX) : $('.go-top').removeClass(FX)        
	})

	// web accessibility
	$('a[target="_blank"]').attr('title', '새창으로 열림')
    $('.page-info .current strong').prepend('<span class="sr-only">현재 페이지</span>');
    $('.page-info .current b').prepend('<span class="sr-only">전체 페이지 수</span>');

	//모바일에서 원본이미지보기
    if(isMobile()){
        $('.img-zoom, .zoom_posi, .img').each(function(){
            const imgSrc = $(this).find('img').attr('src')
            $(this).append('<a href="' + imgSrc + '" target="_blank" title="이미지 새창열기" class="btn-zoom"></a>')
        })
    }

	/*
	//내용 많은 테이블
	$(".responsive").each(function(){
		$(this).before("<p class='horizontal_scroll mobile'><i class='xi-angle-left'></i><i class='xi-touch'></i><i class='xi-angle-right'></i><span class='txt'>좌, 우로 이동하여 더 많은 내용을 볼수 있습니다.</span></p>");
	})  

	// web accessibility
	$("[class*='xi-']").attr("aria-hidden", "true")
	$("a[target='_blank']").attr("title", "새창으로 열림")

	$('table').each(function(){
		//var tableTitle = $(this).prev().text();
		var thArrayStr = "";
		$(this).find('th').each(function(i){
			thArrayStr += ", " + $(this).text();
		});
		$(this).find("caption").html( thArrayStr.substring(2) + '에 관한 정보를 나타낸 표입니다.' );
		//$(this).find("table caption").html('<strong>' + tableTitle + '</strong>' + '<span>' + thArrayStr.substring(2) + '에 관한 정보' + '</span>' );
	});

    //모바일 원본이미지 스크롤    
    $('img.view').each(function(){
       $(this).wrap("<div class='scroll_wrap'></div>");
    })

	//임시 인클루드
	$("#snb a").on("click", function(){
		var url = $(this).data("include");
		$(".article").load(""+ url +".html");
		console.log(url);
	})
	*/

    /*모바일에서 원본이미지를 레이어로 띄우는 방식    
    $("img.view").each(function(){
		$(this).before("<p class='view_txt mobile'><i class='xi-image-o'></i><span class='txt'>이미지를 클릭하면 원본이미지를 보실 수 있습니다.</span></p>");
	}) 
    $('img.view').on("click", function(){  
        if( mobile() && !$(this).hasClass(AC)){
            $(this).addClass(AC).wrap("<div class='view_dimm'></div>");
            $('.view_dimm').append("<button type='button' class='view_close'><i class='xi-close'></i><span class='sr-only'>이미지 크게보기 레이어 닫기</span></button>");
        }       
    })
    $("body").on("click", ".view_close", function(){
        $(this).siblings(".view").removeClass(AC).unwrap()
        $(this).remove()
    })
    */
})


/*  ------------------------------------------------------------------------------------
*   스크롤에 따라 콘텐츠 활성화                            scrollAC(".main .section")
*   스크롤에 따라 콘텐츠 활성화, 콘텐츠 메뉴 활성화    		scrollAC(".tab_cont", ".depth4.scroll")
------------------------------------------------------------------------------------- 
function scrollAC(cont, contNav) {
    const $cont = $(cont), 
		$contNav = $(contNav)
    let contNavTop, contTop, headH, contNavH, scrollT

    if($cont.length){    
        if (contNav) contNavTop = $contNav.offset().top //탭메뉴 top 
        $(window).on("load scroll", function() {
            headH = $header.height()
            contNavH = $contNav.outerHeight(true)
            //scrollTop
            $header.hasClass(FX) ? scrollT = $(window).scrollTop() + headH : scrollT = $(window).scrollTop()
            //탭메뉴 fixed
			if(!mobile()){
           		contNavTop < scrollT ? $contNav.addClass(FX) : $contNav.removeClass(FX)
			}

            //콘텐츠 및 탭메뉴 Active
            $cont.each(function (i) {
                contTop = $(this)[0].getBoundingClientRect().top
                //콘텐츠 Active
                if (contTop < $(window).height()) $(this).addClass(AC)
				
                //탭메뉴 Active
                $header.hasClass(FX) ? docT = headH + contNavH : docT = contNavH
                if (contTop <= docT + 10) {
                    $contNav.find("li").eq(i).children().attr('title', '선택된 탭메뉴').parent().addClass(AC)
                    .siblings().children().attr('title', '비활성 탭메뉴').parent().removeClass(AC)
                }
            })         
			
        })
    }
}
*/


/*  ------------------------------------------------------------------------------------
*   팝업 또는 레이어 열고 닫기				 layerPopup("버튼")
------------------------------------------------------------------------------------- 
function layerPopup(){
	let $clickSpot, $openLayer		
		
	$layerOpen.on("click", function (e) {	
		$clickSpot = $(this)
        $openLayer = $("#" + $(this).data('id'))
        $modalPop = $openLayer.find(".modal_popup")
		$openLayer.attr("tabindex", 0).fadeIn().focus().addClass("opened_layer")
		e.preventDefault()
        if(Math.floor($modalPop.height()) % 2 != 0){
            $modalPop.css("height",""+ (Math.floor($modalPop.height()-1)) +"px");
        } 
		//$("html").addClass("noscroll");
    })	
	$wrap.on("click",".opened_layer .layer_close", function (e) {		
        $(this).closest(".opened_layer").removeAttr("tabindex").fadeOut().removeClass("opened_layer")
		$clickSpot.focus()
		e.preventDefault()
		//$("html").removeClass("noscroll");
    })
}
*/


/*  ------------------------------------------------------------------------------------
* 팝업 - 하루동안 열지 않기
------------------------------------------------------------------------------------- 

//get 쿠키
function getCookie(name)
{
    var nameOfCookie = name + "=";
    var x = 0;
    while ( x <= document.cookie.length )
    {
        var y = ( x + nameOfCookie.length );
        if ( document.cookie.substring(x,y) == nameOfCookie )
        {
            if( (endOfCookie = document.cookie.indexOf(";", y)) == -1 )
                endOfCookie = document.cookie.length;
            return unescape(document.cookie.substring(y, endOfCookie)); 
        }
        x = document.cookie.indexOf( " ", x ) + 1;
        if ( x == 0 )
            break;
    }
    return "";		
}

// 레이어 팝업 열기
function openLayer(arg)
{
    var pop = document.getElementById(arg);
    pop.style.display = "block";
}
// 레이어 팝업 닫기
function closeLayer(arg)
{
    var pop = document.getElementById(arg);
    pop.style.display = "none";
}
// set 쿠키
function setCookie( name, value, expiredays ){	
    var todayDate = new Date() ;  
    todayDate.setDate(todayDate.getDate() + expiredays) ;
    document.cookie = name + "=" + escape( value ) + "; path=/" + "; expires=" + todayDate.toGMTString() + ";";		
}
function check_close(id, arg){	
    if (document.getElementById(id).checked) {
        setCookie(arg, "done", 7);
    }else{
        setCookie(arg, "f", 7);
    }
}
*/

/* -------------------------------------------------------------------------------------
*   top 고정               goTop()
*   header 고정            fix(".header", 1) pos값이 있으면 스크롤하자마자 fix
------------------------------------------------------------------------------------- 
function goTop() {
    $(window).on("load scroll", function() {
        let scrollT = $(window).scrollTop()
        scrollT > $header.height() ? $goTop.addClass(FX) : $goTop.removeClass(FX)
        scrollT > $footer.offset().top - $(window).height() ? $goTop.addClass("stick") : $goTop.removeClass("stick")
    })
    $goTop.on("click", function() {
        $("html,body").stop().animate({scrollTop: 0}, 800)
    })
}
function fix(el, pos) {	    
    const $el = $(el)
    const originTop = parseInt($el.offset().top) 
    $(window).on("load scroll", function() {        
        let scrollT = $(window).scrollTop() 
        if(pos){
            scrollT > 0 ? $el.addClass(FX) : $el.removeClass(FX)
        }else{
            $header.hasClass(FX) ? scrollT = $(window).scrollTop() + $header.height() : scrollT = $(window).scrollTop()
            if(!$el.hasClass(FX) && scrollT > originTop){
                $el.addClass(FX)
            }else if ( scrollT <= originTop) {
                $el.removeClass(FX)
            }
        }         
    })         
}
*/
/* snb
function snb(mob){
	const $subNav = $(".snb");
	$(window).on("load scroll", function() {
		let scrollT = Math.floor($(this).scrollTop()),
			gnbHeight = $(".header").height(), //header fixed되면서 전체콘텐츠높이에서 gnb높이값을 빼줘야 함.
			contStart = $("#contentWrap").offset().top - gnbHeight,
			contEnd =  $("#wrap").outerHeight(true)-($(".footer").outerHeight(true) + $subNav.height() + gnbHeight)
		if (contEnd > scrollT ) {
			if(scrollT > contStart){
				$subNav.addClass("stick").css({"top": gnbHeight + 50}); //50은 #contentWrap의 padding-top값
				if (mobile()) $subNav.addClass("stick").css({"top":gnbHeight})
			}else{
				$subNav.removeClass("stick").removeAttr("style")
			}
		}else{
			$subNav.css({"top" : contEnd - scrollT})
		}
	})
	// 왼쪽서브메뉴가 모바일로 변경되는 형태    
	if(mob){
		$subNav.find(".depth2>li.active>a").on("click", function(){
			if (mobile()) active(this, "toggle", 1, ".depth2")
		}) 
		$subNav.find(".depth3>li.active>a").on("click", function(){
			if (mobile()) active(this, "toggle", 1, ".depth3")
		})	
	}
}
*/
/* 페이지 인클루드
function includeLayout(){
	var includeArea = $("[data-include]");
	var self, url;
	$.each(includeArea, function(){
		self = $(this);
		url = self.data("include");
		self.load(url, function(){
			self.removeAttr("data-include");
		});
	});
} */
/*  --------------------------------------------------------------------------
*   addClass와 close버튼으로 닫기                  active(this, "active")
*   toggle  
    - toggle시킬 객체가 바로 위 부모인 경우           active(this, "toggle")
    - toggle시킬 객체가 바로 위 부모가 아닌 경우       active(this, "toggle", 1, ".toggle시킬 클래스명")
    - 링크영역외 클릭을 사용하지 않으려면              active(this, "toggle", 0)  
*   accordion                                       active(this, "accordion")
------------------------------------------------------------------------------------- 

function clickAC(elem){
    $(elem).on("click", function(){
		$(this).addClass(AC).siblings().removeClass(AC)
	});
    
}
function active(el, toggle, anyClick, target) {
    const $el = $(el)  
    const $elTarget = target ? $el.parents(target) : $el.parent()
    if (toggle == "toggle") { //토글형태
        $elTarget.toggleClass(AC)
        let txt = $elTarget.hasClass(AC) ? " 닫기" : " 열기"
        $el.attr("title", "" + $el.text() + txt + "")   
    } else if (toggle == "accordion") {       
        anyClick = 0 
        $elTarget.toggleClass(AC).siblings().removeClass(AC)   
        let txt = $elTarget.hasClass(AC) ? "확장됨" : "축소됨"
        $el.attr("title", "" + txt + "").parent().siblings().children("a").attr("title", "축소됨")
    } else { //addClass
        $elTarget.addClass(AC).siblings().removeClass(AC)
        $elTarget.find(".close").on("click", function(e) {
            $elTarget.removeClass(AC)
            $el.attr("title", "" + $el.text() + " 열기")
        })
    }
    //링크영역외 클릭
    if (anyClick) { 
        $("body").on("click", function(e) {   
            if(!$(e.target).hasClass(AC)){  
            $elTarget.removeClass(AC)
            $el.attr("title", "" + $el.text() + " 열기")
            }
        })
    }
    event.stopPropagation()
    event.preventDefault()    
}  
*/
/*  페이지내 이동 -------------------------------------------------------------------- */
/* function anchor(el, headFixed, tabFixed) {
	$(el).on("click", function(e) {    		  
		const headH = headFixed ? $header.height() : 0//달라붙는 header가 있을경우
		const tabH = tabFixed ? $anchorTab.height() : 0//달라붙는 tab메뉴가 있을경우		
		$("html,body").stop().animate({scrollTop: ($(this.hash).offset().top - headH - tabH)}, 500)
		e.preventDefault()
    })
} */
/* 
// 탭갯수를 구해 클래스 부여(반응형)
function tabNum(el){
	$(el).each(function () {
		$(this).parent().addClass("num" + tabLi.length + "")
	})
}*/

/* 
function clickAC(el){
    $(el).on("click", function() {
		$(this).addClass(AC).siblings().removeClass(AC)
	});
    
} */

/* function emptyWidth(){
	$("strong.title").each(function(){
	  var titleWidth = $(this).width();
	  $(this).siblings(".empty").css("width", titleWidth);
	});
  }
$(window).load(function(){
	   var snbActive = $(".snb>li.active");
	   snbActive.prev().addClass("prev");
	   snbActive.next().addClass("next");
	   if($(".snb .depth3 li.active").offset() != undefined){
		   var snbDepthActive = $(".snb .depth3 li.active").offset().left;
		   $(".snb .depth3").scrollLeft(snbDepthActive);
	   }
  
	emptyWidth(); 
}); */



