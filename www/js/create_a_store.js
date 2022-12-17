import * as common from "./common.js";
import storeInfoEnum from "./storeBrand.js";
import errorCode from "./errorCode.js";

const storeNameInput = document.querySelector("input[type='text']");
const bottomBtn = document.querySelector(".full_floating_btn");
const btnManager = new common.ButtonManager(bottomBtn, tryCreate);
document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.enableBackBtnTo("../index.html");
}

function init() {
    loadStores();
    inputInteraction();
    radioButtonInteraction();
    completePageInteraction();
}

function loadStores() {
    const storesSection = document.querySelector(".store_list");

    const template = common.getTemplate("#storeRadioButtonTemplate");

    Object.values(storeInfoEnum).forEach((store) => {
        const data = {
            brand_code: store.code,
            logo_path: store.logo_path,
            brand_name: store.name,
        };
        storesSection.innerHTML += template(data);
    });

    storesSection.querySelector("input").checked = true;
}

function radioButtonInteraction() {
    common.addEventListenerToDOMbySelector(".form_radio_btn", "click", (e) => {
        if (!checkEmpty()) btnManager.enableBtn();
    });
}

function checkEmpty() {
    return storeNameInput.value == "";
}

function completePageInteraction() {
    // 완료 버튼
    const completeBtn = document.querySelector("#complete .full_floating_btn");
    completeBtn.addEventListener("click", (e) => {
        location.href = "../index.html";
    });
}

function inputInteraction() {
    storeNameInput.addEventListener("keyup", (e) => {
        common.updateInputValue(e);
        if (checkEmpty()) btnManager.disableBtn();
        else btnManager.enableBtn();
    });
}

function tryCreate() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const responseBody = JSON.parse(hr.responseText);
            if (hr.status == 200) {
                postSuccess();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorResponse.errorCode ==
                    errorCode.STORE.DUPLICATE_STORE
                )
                    duplicateStore();
                else
                    common.giveToastNoti(
                        "알 수 없는 이유로 생성할 수 없습니다."
                    );
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else
                common.giveToastNoti("알 수 없는 이유로 생성할 수 없습니다.");
        }
    };

    const data = getFormData();
    hr.open("POST", `http://${common.env.SERVER_HOST_PORT}/api/stores`);
    hr.setRequestHeader("Content-Type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send(JSON.stringify(data));
}

function getFormData() {
    const checkedBrandCode = document.querySelector(".store_list input:checked")
        .value;
    return {
        name: storeNameInput.value,
        storeBrandCode: checkedBrandCode,
        adminId: common.getUserId(),
    };
}

function postSuccess() {
    showCompletePage();
}

function duplicateStore() {
    common.giveToastNoti("이미 있는 이름입니다");
    btnManager.disableBtn();
    storeNameInput.focus();
}

function showCompletePage() {
    const completePage = document.querySelector("#complete");
    completePage.classList.add("active");
}
