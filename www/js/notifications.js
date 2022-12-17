import * as common from "./common.js";
var pageNum = -1;
const loadMoreBtn = document.querySelector(".load_more_btn");
const notiList = document.querySelector(".noti_list");

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName("red");
}

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.enableBackBtnTo("../index.html");
}

function init() {
    loadMoreBtnInteraction();
    loadMoreNotifications();
}

function loadMoreNotifications() {
    pageNum += 1;
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                var response = JSON.parse(hr.responseText).data;
                console.log(response);

                mappingNotifications(response);
                enableDeleteBtn();
            } else {
                hideEmptyImage();
                hideLoadMoreBtn();
                common.giveToastNoti(
                    "알수 없는 이유로 불러올 수 없습니다. 인터넷 연결을 확인해주세요."
                );
            }
        }
    };
    hr.open(
        "GET",
        `http://${
            common.env.SERVER_HOST_PORT
        }/api/notifications?userId=${common.getUserId()}&page=${pageNum}`
    );
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

function mappingNotifications(response) {
    if (response.last) hideLoadMoreBtn();
    else showLoadMoreBtn();

    if (response.content.length == 0) {
        showEmptyImage();
    } else {
        hideEmptyImage();
        const template = common.getTemplate("#notification_template");
        const notifications = response.content;
        const unread = [];
        for (var key in notifications) {
            const { title, content, createdAt, isRead, id } = notifications[
                key
            ];
            const data = {
                title,
                desc: content,
                date: createdAt,
                new: isRead || "visible",
                id: id,
            };
            notiList.innerHTML += template(data);
            if (!isRead) unread.push(id);
        }
        markAsRead(unread);
    }
}
function showEmptyImage() {
    console.log(10);
    common.showDOMbySelector(".empty_noti");
}

function hideEmptyImage() {
    common.hideDOMbySelector(".empty_noti");
}

function showEmptyImageIfEmpty() {
    console.log(notiList.children.length);
    if (
        notiList.children.length == 1 &&
        loadMoreBtn.classList.contains("dialog_off")
    ) {
        showEmptyImage();
    } else hideEmptyImage();
}

function enableDeleteBtn() {
    common.addEventListenerToDOMbySelector(".delete_icon", "click", deleteNoti);
}

function deleteNoti(e) {
    const notiDOM = e.target.closest(".noti_item");
    console.log(e.target, notiDOM);
    const id = notiDOM.id;
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                hideNoti(notiDOM);
                showEmptyImageIfEmpty();
            } else if (hr.status == 401) {
                common.redirectToLogin();
            } else {
                common.giveToastNoti(
                    "알 수 없는 이유로 알림을 삭제할 수 없습니다."
                );
            }
        }
    };
    hr.open(
        "DELETE",
        `http://${common.env.SERVER_HOST_PORT}/api/notifications/${id}`
    );
    hr.setRequestHeader("Authorization", common.getAccessToken());
    hr.send();
}

const mockNotifications = {
    notifications: [
        {
            title: "알림 제목",
            desc:
                "알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. ",
            createdAt: "2020.7.31",
            isRead: false,
            id: 1,
        },
        {
            title: "알림 제목",
            desc:
                "알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. ",
            createdAt: "2020.7.31",
            isRead: false,
            id: 2,
        },
        {
            title: "알림 제목",
            desc:
                "알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. ",
            createdAt: "2020.7.31",
            isRead: true,
            id: 3,
        },
        {
            title: "알림 제목",
            desc:
                "알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. ",
            createdAt: "2020.7.31",
            isRead: true,
            id: 4,
        },
        {
            title: "알림 제목",
            desc:
                "알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. 알림 내용이 들어갈 자리입니다. ",
            createdAt: "2020.7.31",
            isRead: true,
            id: 5,
        },
    ],
    total: 5,
};

function hideNoti(notiDOM) {
    notiDOM.classList.add("hide_and_up");
    setTimeout(() => {
        notiList.removeChild(notiDOM);
    }, 1100);
}

function loadMoreBtnInteraction() {
    loadMoreBtn.addEventListener("click", loadMoreNotifications);
}

function showLoadMoreBtn() {
    loadMoreBtn.addEventListener("click", loadMoreNotifications);
    common.showDOM(loadMoreBtn);
}

function hideLoadMoreBtn() {
    loadMoreBtn.removeEventListener("click", loadMoreNotifications);
    common.hideDOM(loadMoreBtn);
}

function markAsRead(unread) {
    if (unread.length != 0) {
        const data = {
            idList: unread,
        };

        var hr = new XMLHttpRequest();
        hr.open(
            "PUT",
            `http://${common.env.SERVER_HOST_PORT}/api/notifications/read`
        );
        hr.setRequestHeader("Content-Type", "application/json");
        hr.setRequestHeader("Authorization", common.getAccessToken());
        hr.send(JSON.stringify(data));
    }
}
