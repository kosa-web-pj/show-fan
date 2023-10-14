import { handleXhttps, backURL, frontURL } from "../util/util.js";

$(() => {
  const queryStr = location.search.substring(1); // q=value&p=1
  let cPage = 1;
  let showCnt;
  let showList = [];

  handleXhttps("GET", "../header/index.html", $("header"));
  handleXhttps("GET", "../navigation/index.html", $("nav"));
  handleXhttps("GET", "../footer/index.html", $("footer"));

  // 회원가입 클릭 시
  $("body").on("click", '.header-menu-link[href="signup"]', function (e) {
    e.preventDefault();
    handleXhttps("GET", "../signup/index.html", $("main"));
  });

  // 로그인 클릭 시
  $("body").on("click", '.header-menu-link[href="login"]', function (e) {
    e.preventDefault();
    handleXhttps("GET", "../login/index.html", $("main"));
  });

  // if 마이페이지 link clicked
  $("body").on("click", '.header-menu-link[href="mypage"]', function (e) {
    e.preventDefault();
    location.href = "mypage";
  });

  // 내 정보 수정 클릭 시
  $("body").on("click", '.mypage-main-text[href="modify.html"]', function (e) {
    e.preventDefault();
    handleXhttps("GET", "../html/modify.html", $("main"));
  });

  // console.log(value);
  // $("#header-search-input").attr("value", value);
  // $("header").on($("#header-search-input").attr("value", value));
  // console.log($("#header-search-input").val());
  // console.dir($("#header-search-input").attr("value"));

  // if ($("#header-search-input").length) {
  //   console.log("#header-search-input 요소가 존재합니다.");
  // } else {
  //   console.log("#header-search-input 요소가 존재하지 않습니다.");
  // }

  // if ($("header").length) {
  //   console.log("#header 요소가 존재합니다.");
  // } else {
  //   console.log("#header 요소가 존재하지 않습니다.");
  // }

  // 검색 버튼 클릭 시
  $("body").on("click", "#header-search-button", function (e) {
    // e.preventDefault();
    const value = $("#header-search-input").val();
    location.href = `index.html?q=${value}`;
  });

  // 검색 입력 후 엔터
  $("body").on("keydown", "#header-search-input", function (e) {
    if (e.key == "Enter" || e.keyCode == "13") {
      const value = $("#header-search-input").val();
      location.href = `index.html?q=${value}`;
    }
  });

  // 캘린더 조회 시
  $("body").on("click", "#navigation-calendar-button", function (e) {
    location.href = "../calendar/index.html";
  });

  // 체크박스 클릭
  $(".form-check-input").click((e) => {
    showListFilterHandler(showList);
  });

  // 체크박스 필터링
  $("#genreAll").click((e) => {
    allChkHandler($("#genreAll"), "genre");
  });

  $("#statusAll").click((e) => {
    allChkHandler($("#statusAll"), "status");
  });

  $("#localAll").click((e) => {
    allChkHandler($("#localAll"), "local");
  });

  // 공연 데이터 호출
  ajaxHandler(cPage);

  // 공연 데이터 호출
  function ajaxHandler(page) {
    const data = `p=${page}`;

    $.ajax({
      url: `${backURL}/search?${queryStr}`,
      method: "GET",
      data: data,
      success: (responseJSONObj) => {
        showCnt = responseJSONObj.showCnt;

        if (showList.length == 0) {
          showList = responseJSONObj.show;
        } else {
          $(responseJSONObj.show).each((index, e) => {
            showList.push(e);
          });
        }

        if (showList.length <= 20) {
          showListHandler(showCnt, showList);
        } else {
          showListFilterHandler(showList);
        }
      },
      error: (xhr, textStatus) => {
        alert("err: " + xhr.status);
      },
    });
  }

  // 필터 전체 체크
  function allChkHandler($allChk, name) {
    if ($allChk.is(":checked")) {
      $(`input[name=${name}]`).prop("checked", true);
    } else {
      $(`input[name=${name}]`).prop("checked", false);
    }
    showListFilterHandler(showList);
  }

  // show list 체크 필터
  function showListFilterHandler(showList) {
    var showFilterList = showList;

    // show list 장르체크 필터
    $("input:checkbox[name=genre]").each((index, e) => {
      if (!$(e).is(":checked")) {
        showFilterList = showFilterList.filter(function (s) {
          return s.genreId != $(e).val();
        });
      }
    });

    // show list 상태체크 필터
    $("input:checkbox[name=status]").each((index, e) => {
      if (!$(e).is(":checked")) {
        showFilterList = showFilterList.filter(function (s) {
          return s.showStatus != $(e).val();
        });
      }
    });

    // show list 지역체크 필터
    $("input:checkbox[name=local]").each((index, e) => {
      if (!$(e).is(":checked")) {
        showFilterList = showFilterList.filter(function (s) {
          return s.showAddress.indexOf($(e).val()) == -1;
        });
      }
    });

    // 필터된 show list 렌더링
    $("#search-result-container").html(
      // showListHandler(showCnt, showFilterList)
      addList(showFilterList)
    );
  }

  // show list handler
  function showListHandler(showCnt, showList) {
    if (showCnt == 0) {
      $("#search-result-count > b").html(`검색 결과 (${showCnt})`);
      $("#showCardList").html(
        '<div class="col"><a><div class="card h-100"><img class="card-img-top" src="https://showfan.s3.ap-northeast-2.amazonaws.com/PF154190.jpg" alt="..."/><div class="status"><b>공연중</b></div><div class="card-body"><h5 class="card-title">Card title</h5><p class="card-text"><div id="period">2023.01.01 ~ 2023.01.01</div><div id="venues">예술의 전당</div><br><div id="grade">평점 3.5 (리뷰갯수)</div></p></div></div></a></div><div id="search-result-count" class="container text-right"><b>검색된 공연이 없습니다.</b></div>'
      );
      $("div.col").first().hide();
    } else {
      $("#search-result-count > b").html(`검색 결과 (${showCnt})`);

      const $originShow = $("div.col").first();
      $originShow.siblings().remove();
      $originShow.show();

      $(showList).each((index, s) => {
        const $copyShow = $originShow.clone();

        const showId = s.showId;
        const showImage = s.showPoster;
        const genreId = s.genreId;
        const showName = s.showName;
        const showVenues = s.showVenues;
        const showStartDay = s.showStartDay;
        const showEndDay = s.showEndDay;
        const showAddress = s.showAddress;
        const showStatus = s.showStatus;
        const reviewCnt = s.reviewCnt;
        const gradeAvg = s.gradeAvg;

        $("input:checkbox[name=genre]").each((index, e) => {
          if (genreId == $(e).val()) {
            $(e).prop("checked", true);
          }
        });

        $("input:checkbox[name=status]").each((index, e) => {
          if (showStatus == $(e).val()) {
            $(e).prop("checked", true);
          }
        });

        $("input:checkbox[name=local]").each((index, e) => {
          if (showAddress.indexOf($(e).val()) != -1) {
            $(e).prop("checked", true);
          }
        });

        $copyShow
          .find("a")
          .attr("href", `${frontURL}/show_detail.html?showId=${showId}`);
        $copyShow.find("img").attr("src", showImage).attr("title", showName);

        if (showStatus == "공연완료") {
          $copyShow.find(".status > b").html("공연종료");
        } else {
          $copyShow.find(".status > b").html(showStatus);
        }

        $copyShow.find(".card-title").html(showName);
        $copyShow.find("#period").html(showStartDay + " ~ " + showEndDay);
        $copyShow.find("#venues").html(showVenues);
        $copyShow
          .find("#grade")
          .html("별 " + gradeAvg + " (" + reviewCnt + ")");

        $("#showCardList").append($copyShow);
      });

      $originShow.hide();
    }
  }

  // 무한 스크롤
  window.onscroll = function (e) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      ajaxHandler(++cPage);
    }
  };

  // show list 추가
  function addList(addList) {
    const $originShow = $("div.col").first();
    $originShow.siblings().remove();
    $originShow.show();

    $(addList).each((index, s) => {
      const $copyShow = $originShow.clone();

      const showId = s.showId;
      const showImage = s.showPoster;
      const showName = s.showName;
      const showVenues = s.showVenues;
      const showStartDay = s.showStartDay;
      const showEndDay = s.showEndDay;
      const showStatus = s.showStatus;
      const reviewCnt = s.reviewCnt;
      const gradeAvg = s.gradeAvg;

      $copyShow
        .find("a")
        .attr("href", `${frontURL}/show_detail.html?showId=${showId}`);
      $copyShow.find("img").attr("src", showImage).attr("title", showName);

      if (showStatus == "공연완료") {
        $copyShow.find(".status > b").html("공연종료");
      } else {
        $copyShow.find(".status > b").html(showStatus);
      }

      $copyShow.find(".card-title").html(showName);
      $copyShow.find("#period").html(showStartDay + " ~ " + showEndDay);
      $copyShow.find("#venues").html(showVenues);
      $copyShow.find("#grade").html("별 " + gradeAvg + " (" + reviewCnt + ")");

      $("#showCardList").append($copyShow);
    });

    $originShow.hide();
  }
});
