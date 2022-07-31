// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const common = require("./js");
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener("deviceready", onDeviceReady, false);

// function onDeviceReady() {
//     // Cordova is now initialized. Have fun!

//     console.log(
//         "Running cordova-" + cordova.platformId + "@" + cordova.version
//     );
//     document.getElementById("deviceready").classList.add("ready");
// }

// const escapeScreen = document.querySelector(".escape_screen");
const storeManageDialog = document.querySelector("#store_manage_modal");
const popup = document.querySelector("#popup");
const BTN_PRESSED_Z = 10;
const MODAL_Z = 9400;
const DIALOG_Z = 9500;
const MENU_Z = 9000;
const HEADER_Z = 100;
const ESC_UP_Z = 8000;
const ESC_DOWN_Z = -8000;
const POPUP_Z = 9900;

document.addEventListener("DOMContentLoaded", function () {
    headerEventListner();
    initStoreUnit();
    initialAddStoreUnit();
});

function initStoreUnit() {
    basicInteraction();
    loadMyStores_mock();
    storeEventListener();
    initStoreManageUnit();
}

function basicInteraction() {
    document.querySelectorAll(".dialog").forEach((dialog) => {
        dialog
            .querySelector(".escape")
            .addEventListener("click", () => closeDialog(dialog));
    });
}

// HEADER
function headerEventListner() {
    var top = document.querySelector(".top");
    window.addEventListener("scroll", () => {
        //스크롤을 할 때마다 로그로 현재 스크롤의 위치가 찍혀나온다.
        if (window.scrollY > 290) {
            top.classList.add("scrolled");
        } else {
            top.classList.remove("scrolled");
        }
    });
    var storeCardsSection = document.querySelector(".store_cards");
    storeCardsSection.addEventListener("scroll", (e) =>
        console.log(e.target.scrollTop)
    );

    addEventListenerToDOMbySelector(".store_cards", "scroll", (e) => {
        console.log(e.target.scrollTop);
        console.log(20);
    });
    addEventListenerToDOMbySelector(".header .noti_icon", "click", (e) => {
        location.href = "http://127.0.0.1:5500/www/pages/notifications.html";
    });
    addEventListenerToDOMbySelector(".header .setting_icon", "click", (e) => {
        location.href = "http://127.0.0.1:5500/www/pages/settings.html";
    });
}

// STORE CARDS -- LOADING

function loadMyStores() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
            storesJson = JSON.parse(hr.responseText);
            mappingStoreData(store);
            // initStoreManageUnit();
        }
    };
    hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    hr.send();
}

function storeEventListener() {
    addEventListenerToDOMbySelector(".store_cards", "click", (e) => {
        // var btnDOM = e.target.closest(".btn_i");
        // btnDOM.classList.add("pressed");
        // console.log(e.target);
        // console.log(10);
    });
    // addEventListenerToDOMbySelector(".btn_pressed", "mouseup", (e) => {
    //     var btnDOM = e.target.closest(".btn_i");
    //     btnDOM.classList.remove("pressed");
    // });
    document
        .querySelector(".top")
        .addEventListener("mouseup", (e) => console.log(10));
    document
        .querySelector(".top")
        .addEventListener("mousedown", (e) => console.log(10));
}

function initStoreManageUnit() {
    // // 매장관리 DIALOG
    // initStoreManageDialog();

    // SEE_MORE_BUTTON
    addEventListenerToDOMbySelector(".store_cards .more_icon", "click", (e) => {
        const storeDOM = e.target.closest(".store_card");
        initStoreManageDialog(storeDOM);
        openDialog(storeManageDialog);
        storeManageDialog
            .querySelector(".delete_store")
            .addEventListener("click", () => {
                givePopup(popupEnum.DELETE_STORE, [storeDOM]);
            });
    });

    initStoreCloseButton();
}

function initStoreManageDialog(storeDOM) {
    // -- CLOSE
    const closeBtn = storeManageDialog.querySelector(".close_icon");
    console.log(closeBtn);
    closeBtn.addEventListener("click", () => {
        closeDialog(storeManageDialog);
        console.log(10);
    });

    // -- 접근권한 관리하기
    storeManageDialog
        .querySelector(".manage_access")
        .addEventListener(
            "click",
            () =>
                (location.href =
                    "http://127.0.0.1:5500/www/pages/manage_accesses.html")
        );

    // -- 매장 정보 수정하기
    storeManageDialog
        .querySelector(".modify_info")
        .addEventListener(
            "click",
            () =>
                (location.href =
                    "http://127.0.0.1:5500/www/pages/create_a_store.html")
        );

    // -- 삭제하기
    storeManageDialog
        .querySelector(".delete_store")
        .addEventListener("click", (e) => {
            givePopup(popupEnum.DELETE_STORE, [storeDOM]);
        });
}

function loadMyStores_mock() {
    storesJson = {
        stores: [
            {
                id: 1,
                name: "서울사랑점1",
                brand: {
                    code: "SB01",
                    desc: "씨유",
                },
                access: "AT04",
            },
            {
                id: 2,
                name: "한국사랑점2",
                brand: {
                    code: "SB02",
                    desc: "지에스25",
                },
                access: "AT03",
            },
            {
                id: 3,
                name: "한국사랑점3",
                brand: {
                    code: "SB03",
                    desc: "이마트24",
                },
                access: "AT03",
            },

            {
                id: 4,
                name: "한국사랑점4",
                brand: {
                    code: "SB04",
                    desc: "세븐일레븐",
                },
                access: "AT03",
            },
            {
                id: 5,
                name: "한국사랑점5",
                brand: {
                    code: "SB05",
                    desc: "미니스톱",
                },
                access: "AT03",
            },
            {
                id: 6,
                name: "한국사랑점6",
                brand: {
                    code: "SB06",
                    desc: "스토리웨이",
                },
                access: "AT02",
            },
            {
                id: 7,
                name: "한국사랑점7",
                brand: {
                    code: "SB99",
                    desc: "무명 브랜드",
                },
                access: "AT01",
            },
        ],
        total: 6,
    };
    mappingStoreData(storesJson);
}

function mappingStoreData(storesJson) {
    var storeCardSection = document.querySelector(".store_cards");
    var storeCardTemplateText = document.querySelector("#storeCardTemplate")
        .innerText;

    var storeCardTemplate = Handlebars.compile(storeCardTemplateText);

    // TODO
    // if (storesJson.total == 0){
    //     data = {

    //     }
    // }
    stores = storesJson.stores;
    for (var key in stores) {
        var { id, name, brand, access } = stores[key];
        var storeInfo = getEnumValueByCode(storeInfoEnum, brand.code);
        var { code, background, logoPath } = storeInfo;
        var accessInfo = getEnumValueByCode(accessEnum, access);
        var data = {
            id: id,
            storeName: name,
            storeBrand: code,
            bgColor: background,
            storeIconUrl: logoPath,
            accessType: accessInfo.desc,
            store_tag: accessInfo.storeTag,
        };
        storeCardSection.innerHTML += storeCardTemplate(data);
    }
}

function initStoreCloseButton() {
    addEventListenerToDOMbySelector(
        ".store_card.accessible .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.LOSE_ACCESS)
    );
    addEventListenerToDOMbySelector(
        ".store_card.waiting .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.WITHDRAW_ACCESS)
    );
    addEventListenerToDOMbySelector(
        ".store_card.inaccessible .close_icon",
        "click",
        removeDeniedStore
    );
}

// function addBasicEventListenerToStoreMenu() {
//     addEventListenerToDOMbySelector(".store_card .menu_item", "click", (e) => {
//         hideDOM(e.target.closest(".menu"));
//         setZ(escapeScreen, ESC_DOWN_Z);
//     });
// }

function giveStorePopup(e, popupInfo) {
    var storeDOM = e.target.closest(".store_card");
    givePopup(popupInfo, [storeDOM]);
}

function givePopup(popupInfo, params) {
    // popup 생성 by handlebar
    // var popupTemplateText = document.querySelector("#popupTemplate").innerText;
    // var popupTemplate = Handlebars.compile(popupTemplateText);
    // popupTemplate(popupInfo);
    // document.querySelector(".body_container").innerHTML += popupTemplate(
    // popupInfo
    // );

    // popup 생성
    var popup = document.querySelector("#popup");
    popup.querySelector(".title").innerText = popupInfo.title;
    popup.querySelector(".desc").innerText = popupInfo.desc;
    popup.querySelector(".action_btn").innerText = popupInfo.action_btn_label;
    popup
        .querySelector(".action_btn")
        .classList.add(popupInfo.action_btn_color);

    // popup 이벤트리스너 추가
    addBasicEventListenerToPopup();
    popup
        .querySelector(".action_btn")
        .addEventListener("click", () => popupInfo.action_btn_event(params));

    // SHOW
    openDialog(popup);
}

function deleteStoreByAccessId(id) {
    console.log(`access id ${id} 에 해당하는 store has been deleted`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         json = JSON.parse(hr.responseText);
    //         console.log(json);
    //     }
    // };
    // hr.open("DELETE", `http://localhost:8060/api/stores?accessId=${id}`);
    // hr.send();
}

function removeDeniedStore(e) {
    var storeDOM = e.target.closest(".store_card");
    var accessId = storeDOM.getAttribute("id");

    deleteAccessById(accessId);
    hideDOM(storeDOM);
    giveToastNoti("1개의 매장을 목록에서 제거했습니다");
}

function deleteAccessById(id) {
    console.log(`access id ${id} has been deleted`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         json = JSON.parse(hr.responseText);
    //         console.log(json);
    //     }
    // };
    // hr.open("DELETE", `http://localhost:8060/api/accesses/${id}`);
    // hr.send();
}

// 모든 팝업에 대해, popup 외부 클릭 or 취소버튼 클릭시 popup 사라지게 함
function addBasicEventListenerToPopup() {
    var popup = document.querySelector("#popup");
    popup
        .querySelectorAll(".cancel_btn, .action_btn")
        .forEach((btn) =>
            btn.addEventListener("click", () => closeDialog(popup))
        );
}

function initialAddStoreUnit() {
    addEventListenerAddStoreButton();
    addEventListerStoreDialog();
}

function addEventListenerAddStoreButton() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");

    addEventListenerToDOMbySelector(".add_store_container", "click", (e) => {
        openDialog(dialogScreen);
    });
}

function addEventListerStoreDialog() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");
    var closeBtn = dialogScreen.querySelector(".close_icon");
    var createStoreBtn = dialogScreen.querySelector(".create_btn");
    var applyBtn = dialogScreen.querySelector(".apply_btn");

    closeBtn.addEventListener("click", () => closeDialog(dialogScreen));

    createStoreBtn.addEventListener(
        "click",
        () =>
            (location.href =
                "http://127.0.0.1:5500/www/pages/create_a_store.html")
    );
    applyBtn.addEventListener(
        "click",
        () =>
            (location.href =
                "http://127.0.0.1:5500/www/pages/apply_for_store.html")
    );
}

function openDialog(dialogDOM) {
    showDOM(dialogDOM);
}

function closeDialog(dialogDOM) {
    // escapeScreenDown();
    hideDOM(dialogDOM);
}

function escapeScreenDown() {
    hideDOM(escapeScreen);
    setZ(escapeScreen, ESC_DOWN_Z);
}

function escapeScreenUp() {
    showDOM(escapeScreen);
    setZ(escapeScreen, ESC_UP_Z);
}

const accessEnum = {
    INACCESIBLE: {
        code: "AT01",
        desc: "inaccessible",
        storeTag: "거절됨",
    },
    WAITING: {
        code: "AT02",
        desc: "waiting",
        storeTag: "신청 대기중",
    },
    ACCESSIBLE: {
        code: "AT03",
        desc: "accessible",
        storeTag: "근무자",
    },
    ADMIN: {
        code: "AT04",
        desc: "admin_access",
        storeTag: "관리자",
    },
};

const storeInfoEnum = {
    CU: {
        code: "SB01",
        name: "씨유",
        logoPath: "store_logos/cu.png",
        background: "#F2F8E0",
    },
    GS25: {
        code: "SB02",
        name: "지에스25",
        logoPath: "store_logos/gs25.png",
        background: "#DDF9FF",
    },
    EMART: {
        code: "SB03",
        name: "이마트24",
        logoPath: "store_logos/emart24.png",
        background: "#FFF3D8",
    },
    SEVEN_ELEVEN: {
        code: "SB04",
        name: "세븐일레븐",
        logoPath: "store_logos/seven_eleven.png",
        background: "#DEF3EE",
    },
    MINISTOP: {
        code: "SB05",
        name: "미니스톱",
        logoPath: "store_logos/ministop.png",
        background: "#E0F0FF",
    },
    STORYWAY: {
        code: "SB06",
        name: "스토리웨이",
        logoPath: "store_logos/storyway.png",
        background: "#FFEAE0",
    },
    ETC: {
        code: "SB99",
        name: "기타",
        logoPath: "store_logos/etc.png",
        background: "#F4F8FC",
    },
};

const popupEnum = {
    DELETE_STORE: {
        title: "담배 목록을 영구적으로<br />삭제하시겠습니까?",
        desc:
            "해당 담배 목록을 영원히 삭제하고, 기존 접근 권한자들 또한 접근이 불가합니다. 정렬정보와 기존 권한자들의 권한을 유지하려면, 관리자 권한 인계가 선행되어야합니다. 그래도 삭제하시겠습니까?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_store",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteStoreByAccessId(accessId);
            console.log(storeDOM);
            hideDOM(storeDOM);
            giveToastNoti("매장 1개를 삭제했습니다");
            closeDialog(storeManageDialog);
        },
    },
    LOSE_ACCESS: {
        title: "담배 목록을 지우시겠어요?",
        desc:
            "해당 담배 목록에 대한 열람/편집 권한을 잃게 됩니다. 그래도 삭제하시겠어요?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "lose_access",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteAccessById(accessId);
            hideDOM(storeDOM);
            giveToastNoti("1개의 매장을 목록에서 제거했습니다");
        },
    },
    WITHDRAW_ACCESS: {
        title: "접근 신청을 철회하시겠어요?",
        desc:
            "해당 담배 목록에 대한 열람/편집 권한을 포기하고 목록에서 지우게 됩니다.",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "withdraw",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            const accessId = storeDOM.getAttribute("id");
            deleteAccessById(accessId);
            hideDOM(storeDOM);
            giveToastNoti("1개의 매장을 목록에서 제거했습니다");
        },
    },
};

function addEventListenerToDOMbySelector(selector, event, handler) {
    var DOM = document
        .querySelectorAll(selector)
        .forEach((item) => item.addEventListener(event, handler));
}

function getEnumValueByCode(enumObject, code) {
    foundKey = Object.keys(enumObject)
        .filter((key) => enumObject[key].code == code)
        .pop();
    return enumObject[foundKey];
}

function setZ(DOM, zIndex) {
    DOM.setAttribute("style", `z-index:${zIndex}`);
}

function giveToastNoti(message) {
    const toastDOM = document.querySelector("#toast");
    toastDOM.innerText = message;
    toastDOM.classList.add("toast_up");
    // toastDOM.setAttribute("style", "bottom: 70px");
    setTimeout(() => {
        toastDOM.classList.remove("toast_up");
        console.log("down");
    }, 3000);
}

function showDOM(DOM) {
    DOM.classList.remove("invisible");
}

function showDOMbySelector(selector) {
    var DOM = document.querySelector(selector);
    showDOM(DOM);
    return DOM;
}

function hideDOM(DOM) {
    DOM.classList.add("invisible");
}

function hideDOMbySelector(selector) {
    var DOM = document.querySelector(selector);
    hideDOM(DOM);
}
