import * as common from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    headerEventListner();
});

function basicInteraction() {
    common.backButton();
}

function headerEventListner() {
    var top = document.querySelector(".top");
    window.addEventListener("scroll", () => {
        //맨 위에서만 헤더부분이 투명하다.
        if (window.scrollY > 290) {
            top.classList.add("scrolled");
        } else {
            top.classList.remove("scrolled");
        }
    });
}

function init() {}
