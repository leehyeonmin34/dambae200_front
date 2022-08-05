import * as common from "./common.js";
var pageNum = -1;
const loadMoreBtn = document.querySelector(".load_more_btn");

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.backButton();
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
                var response = JSON.parse(hr.responseText);
                console.log(response);

                if (response.last) hideLoadMoreBtn();

                mappingNotifications(response);
                enableDeleteBtn();
            } else {
                common.giveToastNoti("알림을 불러올 수 없습니다.");
            }
        }
    };
    hr.open(
        "GET",
        `http://localhost:8060/api/notifications?userId=${common.getUserId()}&page=${pageNum}`
    );
    hr.send();
}

function mappingNotifications(response) {
    if (response.totalElements == 0) {
        showEmptyImage();
    } else {
        const section = document.querySelector(".noti_list");
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
            section.innerHTML += template(data);
            if (!isRead) unread.push(id);
        }
        // console.log(unread);
        markAsRead(unread);
    }
}
function showEmptyImage() {}

function enableDeleteBtn() {
    common.addEventListenerToDOMbySelector(".delete_icon", "click", deleteNoti);
}

function deleteNoti(e) {
    const notiDOM = e.target.closest(".noti_item");
    const id = notiDOM.id;
    console.log(id);
    var hr = new XMLHttpRequest();
    hr.onreadystatechange = () => {
        if (hr.readyState == XMLHttpRequest.DONE) {
            if (hr.status == 200) {
                hideNoti(notiDOM);
            } else {
                common.giveToastNoti(
                    "알 수 없는 이유로 알림을 삭제할 수 없습니다."
                );
            }
        }
    };
    hr.open("DELETE", `http://localhost:8060/api/notifications/${id}`);
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
}

function loadMoreBtnInteraction() {
    loadMoreBtn.addEventListener("click", loadMoreNotifications);
}

function hideLoadMoreBtn() {
    loadMoreBtn.removeEventListener("click", loadMoreNotifications);
    loadMoreBtn.classList.add("dialog_off");
}

function markAsRead(unread) {
    if (unread.length != 0) {
        const data = {
            idList: unread,
        };

        var hr = new XMLHttpRequest();
        hr.open("PUT", `http://localhost:8060/api/notifications/read`);
        hr.setRequestHeader("Content-Type", "application/json");
        hr.send(JSON.stringify(data));
    }
}
