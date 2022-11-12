import { ButtonManager } from "./common.js";

const content_containers = document.querySelector(".content_containers");

const nextBtn = document.querySelector(".onboarding_btn");
const prevBtn = document.querySelector(".prev");

var page = 0;
var page_offset = 0;
const last_page = 5;

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    const nextBtnManager = new ButtonManager(nextBtn, goNext);
    const prevBtnManager = new ButtonManager(prevBtn, goPrev);

    nextBtnManager.enableBtn();
    prevBtnManager.enableBtn();
}

function goPrev() {
    if (page == 1) {
        prevBtn.classList.remove("show");
    }
    if (page > 0) {
        var indicatorDOM = document.querySelector(`#idc_${page}`);
        indicatorDOM.classList.remove("active");
        page -= 1;
        indicatorDOM = document.querySelector(`#idc_${page}`);
        indicatorDOM.classList.add("active");
        moveToNewPage();
    }
}

function goNext() {
    if (page == last_page) {
        location.href = "login.html";
    }

    if (page == 0) {
        prevBtn.classList.add("show");
    }

    if (page < last_page) {
        var indicatorDOM = document.querySelector(`#idc_${page}`);
        indicatorDOM.classList.remove("active");
        page += 1;
        indicatorDOM = document.querySelector(`#idc_${page}`);
        indicatorDOM.classList.add("active");
        moveToNewPage();
    }
}

function moveToNewPage() {
    page_offset = -1 * screen.width * page;
    content_containers.setAttribute(
        "style",
        `transform:translateX(${page_offset}px);`
    );
}

function moveIndicator() {
    const indicatorDOM = document.querySelector(`#idc_${page}`);
    indicatorDOM.classList.add("active");
}
