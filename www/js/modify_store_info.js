import * as common from "./common.js";
import storeInfoEnum from "./storeBrand.js";

const storeNameInput = document.querySelector("input[type='text']");
const bottomBtn = document.querySelector(".full_floating_btn");
const btnManager = new common.ButtonManager(bottomBtn, tryModify);
document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    inputInteraction();
    common.enableBackBtnTo("../index.html");
    customBackInteraction();

    // common.radioButtonInteraction();
}

function init() {
    loadStores();

    radioButtonInteraction();
    mapMyStoreInfo();
}

function mapMyStoreInfo() {
    const storeInfo = getStoreInfo();

    const brandRadioInput = document.querySelector(
        `input[type='radio'][value=${storeInfo.brand_code}]`
    );
    storeNameInput.setAttribute("value", storeInfo.name);
    brandRadioInput.checked = true;
}

function getStoreInfo() {
    return {
        id: window.sessionStorage.getItem("currStoreId"),
        name: window.sessionStorage.getItem("currStoreName"),
        brand_code: window.sessionStorage.getItem("currStoreBrandCode"),
    };
}

const mockStoreInfo = {
    id: 1,
    name: "한국사랑점",
    brand_code: "SB04",
};

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

function inputInteraction() {
    common.addEventListenerToDOMbySelector(
        "input[type='text']",
        "keyup",
        (e) => {
            common.updateInputValue(e);
            if (checkEmpty()) btnManager.disableBtn();
            else btnManager.enableBtn();
        }
    );
}

function tryModify() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            const responseBody = JSON.parse(hr.responseText).data;
            if (hr.status == 200) {
                modifySuccess();
            } else if (hr.status == 400) {
                if (
                    responseBody.errorResponse.errorCode ==
                    errorCode.STORE.DUPLICATE_STORE
                )
                    duplicateStore();
                else {
                    common.giveToastNoti(
                        "알 수 없는 이유로 수정할 수 없습니다."
                    );
                }
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else {
                common.giveToastNoti("알 수 없는 이유로 수정할 수 없습니다.");
            }
        }
    };

    const data = getFormData();
    const storeId = getStoreId();
    hr.open(
        "PUT",
        `http://${common.env.SERVER_HOST_PORT}/api/stores/${storeId}`
    );
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
        userId: common.getUserId(),
    };
}

function getStoreId() {
    return window.sessionStorage.getItem("currStoreId");
}

function modifySuccess() {
    common.giveToastNoti("목록 정보가 변경되었습니다");
    btnManager.disableBtn();
}

function duplicateStore() {
    common.giveToastNoti("이미 있는 이름입니다");
    btnManager.disableBtn();
    storeNameInput.focus();
}

function removeCurrStoreData() {
    window.sessionStorage.removeItem("currStoreId");
    window.sessionStorage.removeItem("currStoreName");
    window.sessionStorage.removeItem("currStoreBrandCode");
}

function customBackInteraction() {
    document
        .querySelector(".header .left_icon")
        .addEventListener("click", removeCurrStoreData);
}
