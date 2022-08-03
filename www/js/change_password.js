import * as common from "./common.js";

const bottomBtn = document.querySelector("#sendBtn");
const prevInput = document.querySelector("input[name='prev_pw']");
const newInput = document.querySelector("input[name='new_pw']");
const confirmInput = document.querySelector("input[name='new_pw_confirm']");
// const ButtonManager = common.ButtonManager;
const btnManager = new common.ButtonManager(bottomBtn, trySend);

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    inputInteraction();
    common.backButton();
}

function inputInteraction() {
    common.addEventListenerToDOMbySelector("input", "keyup", (e) => {
        common.updateInputValue(e);
        if (checkEmpty()) btnManager.disableBtn();
        else btnManager.enableBtn();
    });
}

function checkEmpty() {
    return (
        prevInput.value == "" ||
        newInput.value == "" ||
        confirmInput.value == ""
    );
}

function trySend() {
    if (!validateForm()) {
        common.giveToastNoti("입력된 값을 다시 한 번 확인해주세요");
    } else {
        postRequest();
        common.giveToastNoti("비밀번호가 변경되었습니다.");
        clearInputs();
    }
    btnManager.disableBtn();
}

function clearInputs() {
    prevInput.value = "";
    newInput.value = "";
    confirmInput.value = "";
}

function validateForm() {
    // 조건 비밀번호 조건 충족하는지 필요
    if (
        newInput.value != prevInput.value &&
        newInput.value == confirmInput.value
    )
        return true;
    else return false;
}

function postRequest() {}
