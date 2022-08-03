import * as common from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.backButton();
}

function init() {
    var currPage = 0;
    loadMoreNotifications();
}

function loadMoreNotifications() {
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var accessesJson = JSON.parse(hr.responseText).accesses;
    //         mappingStoreData(accesses);
    //         // initStoreManageUnit();
    //     }
    // };
    // TO DO
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
    mappingNotifications(mockNotifications);
}

function mappingNotifications(json) {
    if (json.total == 0) {
        showEmptyImage();
    } else {
        const section = document.querySelector(".noti_list");
        const template = common.getTemplate("#notification_template");
        const notifications = json.notifications;
        for (var key in notifications) {
            const { title, desc, createdAt, isRead } = notifications[key];
            const data = {
                title,
                desc,
                date: createdAt,
                new: isRead || "visible",
            };
            section.innerHTML += template(data);
        }
    }
}
function showEmptyImage() {}

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
