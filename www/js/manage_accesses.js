import * as common from "./common.js";
import accessEnum from "./accessType.js";

const popup = document.querySelector("#popup");

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.backAndRefreshButton();
}

function init() {
    loadStoreAccesses();
}

function loadStoreAccesses() {
    emptyAccessList();
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
            var json = JSON.parse(hr.responseText);
            mappingAccessData(json);
            accessItemUnit();
        } else {
            common.giveToastNoti("알 수 없는 이유로 불러올 수 없습니다");
        }
        showEmpty();
    };

    const storeId = sessionStorage.getItem("currStoreId");
    hr.open("GET", "http://localhost:8060/api/accesses?storeId=" + storeId);
    hr.send();
}

function emptyAccessList() {
    document
        .querySelectorAll(".access_list")
        .forEach((list) => (list.innerText = ""));
}

function loadStoreAccesses_mock() {
    const accessesJson = {
        accesses: [
            {
                id: 1,
                accessType: {
                    code: "AT02",
                    desc: "waiting",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름1",
            },
            {
                id: 2,
                accessType: {
                    code: "AT03",
                    desc: "accessible",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름2",
            },
            {
                id: 3,
                accessType: {
                    code: "AT01",
                    desc: "inaccessible",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름3",
            },
            {
                id: 4,
                accessType: {
                    code: "AT02",
                    desc: "waiting",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름4",
            },
        ],
        total: 4,
    };
    mappingAccessData(accessesJson);
}

function mappingAccessData(accessesJson) {
    var staffSection = document.querySelector(".staffs .access_list");
    var applicatorSection = document.querySelector(".applicators .access_list");

    var accessItemTemplate = common.getTemplate("#accessItemTemplate");

    var accesses = accessesJson.accesses;
    for (var key in accesses) {
        var { id, accessTypeCode, userNickname } = accesses[key];
        var data = {
            id: id,
            nickname: userNickname,
            access_type: common.getEnumValueByCode(accessEnum, accessTypeCode)
                .desc,
        };
        if (accessTypeCode == accessEnum.ACCESSIBLE.code) {
            staffSection.innerHTML += accessItemTemplate(data);
        } else if (accessTypeCode == accessEnum.WAITING.code) {
            applicatorSection.innerHTML += accessItemTemplate(data);
        }
    }
}

function accessItemUnit() {
    // 관리자 아이콘 (관리자 권한 양도)
    common.addEventListenerToDOMbySelector(
        ".access_item.accessible .admin_icon",
        "click",
        (e) => {
            iconHandler(e, popupEnum.HAND_OVER_ADMIN);
        }
    );

    // 더하기 아이콘 (요청 승인)
    common.addEventListenerToDOMbySelector(
        ".access_item.waiting .add_icon",
        "click",
        (e) => iconHandler(e, popupEnum.APPROVE_APPLICATION)
    );

    // 삭제 아이콘 (권한 삭제)
    common.addEventListenerToDOMbySelector(
        ".access_item.accessible .delete_icon",
        "click",
        (e) => iconHandler(e, popupEnum.DELETE_ACCESS)
    );

    // 삭제 아이콘 (요청 거절)
    common.addEventListenerToDOMbySelector(
        ".access_item.waiting .delete_icon",
        "click",
        (e) => iconHandler(e, popupEnum.DENY_APPLICATION)
    );
}

function iconHandler(e, popupEnumKey) {
    const accessId = getAccessIdFromBtn(e);
    common.givePopup(popupEnumKey, accessId);
}

function getAccessIdFromBtn(e) {
    const accessItem = e.target.closest(".access_item");
    const accessId = accessItem.getAttribute("id");
    return accessId;
}

const popupEnum = {
    HAND_OVER_ADMIN: {
        title: "닉네임 님에게 <br />관리자 권한을 넘겨주시겠어요?",
        desc:
            "해당 담배 목록에 대한 관리자 권한을 <br />해당 유저에게 넘겨주고 <br />일반 접근 권한을 갖게됩니다.",
        action_btn_label: "확인",
        action_btn_color: "green",
        popup_class: "hand_over_admin",
        action_btn_event: function (accessId) {
            handOverAdmin(accessId);
            // 메인화면으로 리다이렉트
            setTimeout(
                () => (location.href = "http://127.0.0.1:5500/www"),
                3000
            );
        },
    },
    DELETE_ACCESS: {
        title: "닉네임 님의 접근 권한을<br />삭제하시겠어요?",
        desc: "해당 담배 목록에 대한<br />열람/편집 권한을 잃게됩니다.",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_access",
        action_btn_event: function (accessId) {
            deleteAccess(accessId);
        },
    },
    APPROVE_APPLICATION: {
        title: "닉네임 님의 접근 신청을<br />승인하시겠어요?",
        desc: "해당 담배 목록에 대한<br />열람/편집 권한을 얻게됩니다.",
        action_btn_label: "승인",
        action_btn_color: "green",
        popup_class: "delete_access",
        action_btn_event: function (accessId) {
            approveApplication(accessId);
        },
    },
    DENY_APPLICATION: {
        title: "닉네임 님의 접근 신청을<br />거절하시겠어요?",
        desc:
            "접근 신청 거절이 통보되고, <br />권한 신청자 목록에서 제거됩니다.",
        action_btn_label: "거절",
        action_btn_color: "red",
        popup_class: "deny_application",
        action_btn_event: function (accessId) {
            deleteAccess(accessId);
        },
    },
};

function handOverAdmin(accessId) {
    modifyAccessRequest(
        accessId,
        accessEnum.ADMIN,
        "권리자 권한이 양도되어 메인화면으로 이동합니다."
    );
}

function approveApplication(accessId) {
    modifyAccessRequest(
        accessId,
        accessEnum.ACCESSIBLE,
        "접근 신청을 승인했습니다."
    );
}

function deleteAccess(accessId) {
    modifyAccessRequest(
        accessId,
        accessEnum.INACCESSIBLE,
        "접근 권한을 철회했습니다"
    );
}

function modifyAccessRequest(accessId, accessType, successMsg) {
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                init();
                common.giveToastNoti(successMsg);

                // 관리자 권한 양도라면, 메인으로 리다이렉션 되기 전까지
                // 모든 버튼 비활성화
                if (accessType == accessEnum.ADMIN) {
                    disableInteraction();
                }
            } else {
                init();
                common.giveToastNoti("알 수 없는 이유로 불러올 수 없습니다");
            }
            showEmpty();
        }
    };

    hr.open(
        "PUT",
        `http://localhost:8060/api/accesses/${accessId}/byadmin?accessTypeCode=${accessType.code}`
    );
    hr.send();
}

function disableInteraction() {
    const surface = document.createElement("div");
    document.querySelector("body").appendChild(surface);
    surface.classList.add("surface");
}

function showEmpty() {
    const staffSection = document.querySelector(".access_list_section.staffs");
    const applicatorSection = document.querySelector(
        ".access_list_section.applicators"
    );

    if (staffSection.querySelector(ul).innerText == "") {
        common.showDOMbySelector(".empty_staff");
    } else {
        common.hideDOMbySelector(".empty_staff");
    }
    if (applicatorSection.querySelector(ul).innerText == "") {
        common.showDOMbySelector(".empty_applicators");
    } else {
        common.hideDOMbySelector(".empty_applicators");
    }
}
