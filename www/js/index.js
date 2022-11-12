import * as common from "./common.js";
import accessEnum from "./accessType.js";
import storeInfoEnum from "./storeBrand.js";
// import StatusBar from "cordova-plugin-statusbar";

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

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.querySelector("body").innerHTML("hi!!!!!!!");
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName("red");
}

const storeManageDialog = document.querySelector("#store_manage_modal");
const popup = document.querySelector("#popup");
const addStoreBtn = document.querySelector(".add_store_container");
const reloadBtn = document.querySelector(".realod_btn_container");

document.addEventListener("DOMContentLoaded", function () {
    // updateUserData(sessionStorage.getItem("userId"));

    basicInteraction();
    // notificationDot();
    headerEventListner();
    initStoreUnit();
    initAddStoreBtn();
});

function initStoreUnit() {
    // loadMyStores_mock();
    loadMyStores();
}

function StoreUnitEventListeners() {
    initStoreManageUnit();
}

function basicInteraction() {
    common.initDialogInteraction();
}

const USER_ID = {
    USER_1: 1,
    USER_2: 7,
};

function updateUserData(userId) {
    sessionStorage.setItem("userId", userId);
    // sessionStorage.setItem("userNickname", user.nickname);
    // sessionStorage.setItem("userEmail", user.email);
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

    // 알림 아이콘
    document
        .querySelector(".header .noti_icon")
        .addEventListener("click", (e) => {
            location.href = "pages/notifications.html";
        });

    // 설정 아이콘
    document
        .querySelector(".header .setting_icon")
        .addEventListener("click", (e) => {
            location.href = "pages/settings.html";
        });
}

// STORE CARDS -- LOADING

function loadMyStores() {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 401) {
                redirectToLogin();
            } else if (hr.status == 200) {
                const response = JSON.parse(hr.responseText);

                // 매장 리스트
                mappingStoreData(response.myStores);
                StoreUnitEventListeners();

                // 리로드 버튼 제거
                common.hideDOM(reloadBtn);
                common.showDOM(addStoreBtn);
                if (response.myStores.total == 0)
                    addStoreBtn.classList.add("large");
                else addStoreBtn.classList.remove("large");

                // 알림 빨간 점
                const notiDot = document.querySelector("#noti_dot");
                if (response.newNotification) common.showDOM(notiDot);
                else common.hideDOM(notiDot);
            } else {
                loadFail();
            }
        }
    };
    const requestBody = common.createRequestBodyWithToken(null);
    console.log(requestBody);
    hr.open(
        "GET",
        `http://localhost:8060/api/users/${common.getUserId()}/home`
    );
    hr.setRequestHeader("Content-Type", "application/json");
    hr.setRequestHeader("Authorization", common.getAccessToken());

    hr.send();
}

function loadFail() {
    common.hideDOM(addStoreBtn);
    common.showDOM(reloadBtn);
    reloadBtn.addEventListener("click", loadMyStores);

    common.giveToastNoti(
        "알 수 없는 이유로 데이터를 불러올 수 없습니다. 인터넷 연결을 확인해주세요."
    );
}

function initStoreManageUnit() {
    // // 매장관리 DIALOG

    // SEE_MORE_BUTTON
    common.addEventListenerToDOMbySelector(
        ".store_cards .more_icon",
        "click",
        seeMoreButtonHandler
    );

    initStoreCloseButton();
}

function seeMoreButtonHandler(e) {
    const storeDOM = e.target.closest(".store_card");
    initStoreManageDialog(storeDOM);
    common.openDialog(storeManageDialog);
}

function initStoreManageDialog(storeDOM) {
    // -- CLOSE
    const closeBtn = storeManageDialog.querySelector(".close_icon");
    closeBtn.addEventListener("click", () => {
        common.closeDialog(storeManageDialog);
    });

    // -- 접근권한 관리하기

    // ---- 권한 요청 빨간 점 표출
    const no_applicator = storeDOM
        .querySelector(".store_noti_dot")
        .classList.contains("invisible");
    const redDot = storeManageDialog.querySelector("#store_noti_dot_modal");
    if (no_applicator) common.hideDOM(redDot);
    else common.showDOM(redDot);

    // ---- 접근권한 관리하기 버튼
    storeManageDialog
        .querySelector(".manage_access")
        .addEventListener("click", () => {
            setCurrStoreData(storeDOM);
            location.href = `pages/manage_accesses.html`;
        });

    // -- 매장 정보 수정하기
    storeManageDialog
        .querySelector(".modify_info")
        .addEventListener("click", () => {
            setCurrStoreData(storeDOM);
            location.href = `pages/modify_store_info.html`;
        });

    // -- 삭제하기
    storeManageDialog
        .querySelector(".delete_store")
        .addEventListener("click", (e) => {
            common.givePopup(popupEnum.DELETE_STORE, [storeDOM]);
        });
}

function setCurrStoreData(storeDOM) {
    const storeId = storeDOM.getAttribute("store_id");
    const storeName = storeDOM.querySelector(".store_name").innerText;
    const brandCode = storeDOM.getAttribute("brand_code");
    sessionStorage.setItem("currStoreId", storeId);
    sessionStorage.setItem("currStoreName", storeName);
    sessionStorage.setItem("currStoreBrandCode", brandCode);
}

function initStoreCloseButton() {
    common.addEventListenerToDOMbySelector(
        ".store_card.accessible .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.LOSE_ACCESS)
    );
    common.addEventListenerToDOMbySelector(
        ".store_card.waiting .close_icon",
        "click",
        (e) => giveStorePopup(e, popupEnum.WITHDRAW_ACCESS)
    );
    common.addEventListenerToDOMbySelector(
        ".store_card.inaccessible .close_icon",
        "click",
        removeDeniedStore
    );
}

function loadMyStores_mock() {
    const storesJson = {
        accesses: [
            {
                id: 1,
                storeName: "서울사랑점1",
                brandCode: "SB01",
                accessTypeCode: "AT04",
            },
            {
                id: 2,
                storeName: "한국사랑점2",
                brandCode: "SB02",
                accessTypeCode: "AT03",
            },
            {
                id: 3,
                storeName: "한국사랑점3",
                brandCode: "SB03",
                accessTypeCode: "AT03",
            },

            {
                id: 4,
                storeName: "한국사랑점4",
                brandCode: "SB04",
                accessTypeCode: "AT03",
            },
            {
                id: 5,
                storeName: "한국사랑점5",
                brandCode: "SB05",
                accessTypeCode: "AT03",
            },
            {
                id: 6,
                storeName: "한국사랑점6",
                brandCode: "SB06",
                accessTypeCode: "AT02",
            },
            {
                id: 7,
                storeName: "한국사랑점7",
                brandCode: "SB07",
                accessTypeCode: "AT01",
            },
        ],
        total: 7,
    };
    mappingStoreData(storesJson.stores);
}

function mappingStoreData(accessesJson) {
    const storeCardSection = document.querySelector(".store_cards");

    const storeCardTemplate = common.getTemplate("#storeCardTemplate");

    // TODO
    // if (storesJson.total == 0){
    //     data = {

    //     }
    // }
    const accesses = accessesJson.accesses;
    for (var key in accesses) {
        const {
            id,
            storeName,
            brandCode,
            accessTypeCode,
            storeId,
            applicatorExists,
        } = accesses[key];
        const storeInfo = common.getEnumValueByCode(storeInfoEnum, brandCode);
        const accessInfo = common.getEnumValueByCode(
            accessEnum,
            accessTypeCode
        );
        const { background, logo_path } = storeInfo;

        const data = {
            id: id,
            store_name: storeName,
            brand_code: brandCode,
            bg_color: background,
            store_icon_url: logo_path,
            access_type: accessInfo.desc,
            store_tag: accessInfo.store_tag,
            store_id: storeId,
            applicator_exists: applicatorExists || "invisible",
        };

        storeCardSection.innerHTML += storeCardTemplate(data);
    }
}

function giveStorePopup(e, popupInfo) {
    var storeDOM = e.target.closest(".store_card");
    common.givePopup(popupInfo, [storeDOM]);
}

function deleteStoreRequest(storeDOM) {
    const id = storeDOM.getAttribute("store_id");
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 401) {
                redirectToLogin();
            } else if (hr.status == 200) {
                common.hideAndUp(storeDOM);
                common.closeDialog(storeManageDialog);
                common.giveToastNoti("매장 1개를 삭제했습니다");
            } else {
                common.closeDialog(storeManageDialog);
                common.giveToastNoti(
                    "현재 알 수 없는 이유로 삭제할 수 없습니다"
                );
            }
        }
    };

    hr.open("DELETE", `http://localhost:8060/api/stores/${id}`);
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

function deleteAccessRequest(storeDOM, successMsg) {
    const id = storeDOM.getAttribute("id");
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 401) {
                redirectToLogin();
            } else if (hr.status == 200) {
                common.hideAndUp(storeDOM);
                common.closeDialog(storeManageDialog);
                common.giveToastNoti("매장 1개를 삭제했습니다");
            } else {
                common.closeDialog(storeManageDialog);
                common.giveToastNoti(successMsg);
            }
        }
    };

    hr.open("DELETE", `http://localhost:8060/api/accesses/${id}`);
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

function removeDeniedStore(e) {
    var storeDOM = e.target.closest(".store_card");
    deleteAccessRequest(storeDOM, "1개의 매장을 목록에서 제거했습니다");
}

function withdrawApplication(DOM) {
    deleteAccessRequest(DOM, "접근신청을 철회했습니다");
}

function loseAccess(DOM) {
    deleteAccessRequest(DOM, "1개의 매장을 목록에서 제거했습니다");
}

function redirectToLogin() {
    location.href = "./pages/login.html";
}

// 매장 추가 SECTION
function initAddStoreBtn() {
    addEventListenerAddStoreButton();
    addEventListerStoreDialog();
}

function addEventListenerAddStoreButton() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");

    common.addEventListenerToDOMbySelector(
        ".add_store_container",
        "click",
        (e) => {
            common.openDialog(dialogScreen);
        }
    );
}

function addEventListerStoreDialog() {
    var dialogScreen = document.querySelector(".add_store_dialog_screen");
    var closeBtn = dialogScreen.querySelector(".close_icon");
    var createStoreBtn = dialogScreen.querySelector(".create_btn");
    var applyBtn = dialogScreen.querySelector(".apply_btn");

    closeBtn.addEventListener("click", () => common.closeDialog(dialogScreen));

    createStoreBtn.addEventListener("click", () => {
        location.href = "pages/create_a_store.html";
    });
    applyBtn.addEventListener(
        "click",
        () => (location.href = "pages/apply_for_store.html")
    );
}

const popupEnum = {
    DELETE_STORE: {
        title: "담배 목록을 영구적으로\n삭제하시겠습니까?",
        desc:
            "해당 담배 목록을 영원히 삭제하고, 기존 접근 권한자들 또한 접근이 불가합니다. 정렬정보와 기존 권한자들의 권한을 유지하려면, 관리자 권한 인계가 선행되어야합니다. 그래도 삭제하시겠습니까?",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_store",
        action_btn_event: function (params) {
            const [storeDOM] = params;
            deleteStoreRequest(storeDOM);
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
            loseAccess(storeDOM);
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
            withdrawApplication(storeDOM);
        },
    },
};
