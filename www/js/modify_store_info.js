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
    common.backButton();

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
    return mockStoreInfo;
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

function getFormData() {
    const checkedBrandCode = document.querySelector(".store_list input:checked")
        .value;
    return {
        name: storeNameInput.value,
        brand_code: checkedBrandCode,
    };
}

function tryModify() {
    if (!validateForm()) {
        common.giveToastNoti("생성 불가능한 이름입니다");
        btnManager.disableBtn();
        storeNameInput.focus();
    } else {
        modifyRequest();
    }
}

function modifyRequest() {
    common.giveToastNoti("수정되었습니다.");
    btnManager.disableBtn();
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}

function validateForm() {
    const data = getFormData();
    // console.log(data);
    // console.log(`validation 되었습니다.`);

    return true;

    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}
