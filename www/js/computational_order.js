import * as common from "./common.js";

//진열순서버튼
const displayOrderBtn = document.querySelector(".display");

//전산순서버튼
const computerizedOrderBtn = document.querySelector(".computerized");

//진열순서페이지
const displayOrderPage = document.querySelector("#display_order_page");

//전산순서페이지
const computerizedOrderPage = document.querySelector(
    "#computerized_order_page"
);

//편집 버튼
const editBtn = document.querySelector(".edit_icon");
//검색버튼
const searchBtn = document.querySelector(".main_header .search_icon");

//진열순서 top(일반)
const mainTop = document.querySelector(".main_header");
//진열순서 top(검색시)
const searchTop = document.querySelector(".search_header");

//검색 인풋
const searchInput = searchTop.querySelector(".main_search_input");

// 전산순서 편집 버튼
const computerizedSortButton = document.querySelector(".computerized_sort_btn");

//진열순서이동 인풋
const movementNameInput = document.querySelector(".movement_search_input");
//해당담배뒤로이동 버튼
const movementBtn = document.querySelector(".movement_btn_container");
//담배추가 dialog에서 공식이름
const officialNameInput = document.querySelector(".official_name_input");

document.addEventListener("DOMContentLoaded", function () {
    updateCigaretteListData(CIGARETTELIST_ID.CIGARETTELIST_1);
    basicInteraction();
    headerEventListner();
    displayOrderPageInteraction();
});

function basicInteraction() {
    common.backButton();
}

const CIGARETTELIST_ID = {
    CIGARETTELIST_1: 1,
};

function updateCigaretteListData(ciagretteListId) {
    sessionStorage.setItem("cigaretteListId", ciagretteListId);
}

function displayOrderPageInteraction() {
    loadCigarette();
}

function headerEventListner() {
    //진열순서 버튼 -> 진열순 모드
    displayOrderBtn.addEventListener("click", (e) => {
        activeDisplayOrderPage();
    });

    //편집버튼 -> 편집 모드
    editBtn.addEventListener("click", () => {
        editButtonHandler();
    });
}
