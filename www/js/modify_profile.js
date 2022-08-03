import * as common from "./common.js";

const bottomBtn = document.querySelector("#sendBtn");
const nicknameInput = document.querySelector("input");
const btnManager = new common.ButtonManager(bottomBtn, trySend);

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    inputInteraction();
    common.backButton();
}

function inputInteraction() {
    nicknameInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (checkEmpty()) btnManager.disableBtn();
        else btnManager.enableBtn();
    });
}

function checkEmpty(e) {
    return nicknameInput.value == "";
}

function trySend() {
    const nickname = nicknameInput.value;
    if (!validateForm()) {
        common.giveToastNoti("이미 있는 이름입니다");
        nicknameInput.focus();
    } else {
        const userId = getUserId();
        postRequest(userId, nickname);
        common.giveToastNoti("닉네임이 변경되었습니다.");
    }
    btnManager.disableBtn();
}

function postRequest(userId, nickname) {
    // nicknameInput.value
}

function validateForm() {
    return true;
}

function getUserId() {
    return 1;
}
