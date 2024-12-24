$(function () { 

	/* swiper slides */	
	const btnNext = ".swiper-button-next",
		  btnPrev = ".swiper-button-prev",
		  paging = ".swiper-pagination"

	var slides = { 

		visual: new Swiper(".main-vban-wrap .swiper", {	
			//lazy: true,	
			//spaceBetween: 20,	
			slidesPerView: "auto",
			centeredSlides: true,
			autoplay: {
				delay: 5000,
				pauseOnMouseEnter: true,
			},
			loop: true,
			//loopAdditionalSlides: 1,
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,
				clickable: true,
				renderBullet: function (index, className) {
					return `<span class="${className}" role="button"> 상단 메인배너 ${index + 1}번 슬라이드로 이동</span>`;
				}
			}
		}),

		popupzone: new Swiper(".popupzone .swiper", {
			//lazy: true,
			autoplay: {
				delay: 4000
			},
			loop: this.SwiperLength > 1,
			watchOverflow: true,
			//effect: "fade",
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,				
				type: "fraction"
			}
		}),
	
		banner: new Swiper(".site-banner .swiper", { 
			//lazy: true,
			slidesPerView: 1,
			centeredSlides: true,			
			autoplay: true,
			loop: true,
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,
				clickable: true,
				renderBullet: function (index, className) {
                    return `<span class="${className}" role="button"> 하단 사이트 롤링배너 ${index + 1}번 슬라이드로 이동</span>`;
                }
			},
			breakpoints: {
				1024: {
					slidesPerView: 3,
					//spaceBetween: 20
				},
				1280: {
					slidesPerView: 5,
					//spaceBetween: 20
				}
			}
		})
	};

	$(".swiper-autoplay button").on("click", function(){
		let slideType = $(this).data("swiper");
		var swiperSlide = slides[slideType];
		$(this).removeClass(AC).siblings().addClass(AC);
		$(this).hasClass("swiper-button-pause") ? swiperSlide.autoplay.stop() : swiperSlide.autoplay.start();
	})

	$('.swiper-pagination-current').before('<span class="sr-only">현재 슬라이드</span>')
	$('.swiper-pagination-total').before('<span class="sr-only">전체 슬라이드 개수</span>')
	$(btnPrev).add(btnNext).removeAttr('aria-label');

	tabs(".news-wrap .tab-nav", ".news-wrap .tab-cont")

	
	


})

