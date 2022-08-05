import * as common from "./common.js";
import errorCode from "./errorCode.js";

const bottomBtn = document.querySelector("#sendBtn");
const nicknameInput = document.querySelector("input");
const btnManager = new common.ButtonManager(bottomBtn, trySend);

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function init() {
    mapMyData();
    inputInteraction();
    common.backButton();
}

function mapMyData() {
    const nickname = sessionStorage.getItem("userNickname");
    const email = sessionStorage.getItem("userEmail");
    nicknameInput.value = nickname;
    document.querySelector(".email").innerText = email;
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

// function trySend() {
//     const nickname = nicknameInput.value;
//     if (!validateForm()) {
//         common.giveToastNoti("이미 있는 이름입니다");
//         nicknameInput.focus();
//     } else {
//         const userId = getUserId();
//         postRequest(userId, nickname);
//         common.giveToastNoti("닉네임이 변경되었습니다.");
//     }
//     btnManager.disableBtn();
// }

function trySend() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const responseBody = JSON.parse(hr.responseText);
            if (hr.status == 200) {
                modifySuccess();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorCode ==
                    errorCode.USER.NICKNAME_DUPLICATION
                )
                    duplicateNickname();
                else
                    common.giveToastNoti(
                        "알 수 없는 이유로 수정할 수 없습니다"
                    );
            } else common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다");
        }
    };

    const data = getData();
    hr.open("PUT", `http://localhost:8060/api/users/${common.getUserId()}`);
    hr.setRequestHeader("Content-Type", "application/json");
    hr.send(JSON.stringify(data));
}

function getData() {
    return { nickname: nicknameInput.value };
}

function duplicateNickname() {
    common.giveToastNoti("이미 있는 이름입니다");
    btnManager.disableBtn();
    nicknameInput.focus();
}

function modifySuccess() {
    common.giveToastNoti("닉네임이 변경되었습니다.");
    btnManager.disableBtn();
}
