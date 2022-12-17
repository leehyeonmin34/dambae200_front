import * as common from "./common.js";
import * as displayOrder from "./display_order.js";

export function enableDragAndDrop() {
    // 진열 순서 드래그앤 드랍
    $(".cigarette_list").sortable({
        axis: "y",
        appendTo: ".cigarette_list",
        handle: ".drag_icon",
        opacity: 0.9,
        classes: {
            "ui-sortable-helper": "dragging",
        },
        forceHelperSize: true,
        forcePlaceholderSize: true,
        revert: 150,
        scrollSensitivity: 150,
        scrollSpeed: 5,
        containment: ".page_contents_with_header1",
        placeholder: "sortable_placeholder",

        start: sortableStart,
        update: (event, ui) => sortableUpdate(event, ui, "display"),
    });

    // 전산 순서 드래그앤 드랍
    $(".computerized_cigarette_lists_section").sortable({
        axis: "y",
        appendTo: ".computerized_cigarette_lists_section",
        handle: ".drag_icon",
        opacity: 0.9,
        classes: {
            "ui-sortable-helper": "dragging",
        },
        forceHelperSize: true,
        forcePlaceholderSize: true,
        revert: 150,
        scrollSensitivity: 150,
        scrollSpeed: 10,
        containment: ".computerized_cigarette_lists_section",
        placeholder: "sortable_placeholder",

        start: sortableStart,
        update: (event, ui) => sortableUpdate(event, ui, "computational"),
    });
}

function sortableStart(event, ui) {
    var start_pos = ui.item.index();
    ui.item.data("start_pos", start_pos);
}

function sortableUpdate(event, ui, type) {
    const item = ui.item;
    const fromIdx = item.data("start_pos");
    const toIdx = item.index();
    // console.log(item.next());
    // console.log(item.next()[0]);
    const insertBeforeCigar = item.next()[0];
    const movedCigarId = item[0].getAttribute("id");
    var insertBeforeCigarId = null;
    if (insertBeforeCigar) {
        // 놓여진 자리 다음 담배가 있을 때
        insertBeforeCigarId = insertBeforeCigar.getAttribute("id");
    }
    console.log("UPDATE");
    console.log(insertBeforeCigarId, movedCigarId);
    console.log("from ", ui.item.data("start_pos"), " to ", ui.item.index());

    trySendReorderInfo(type, fromIdx, toIdx, insertBeforeCigarId, movedCigarId);

    // console.log($(".cigarette_list").sortable("toArray"));
}

export function trySendReorderInfo(
    type,
    fromIdx,
    toIdx,
    insertBeforeCigarId,
    movedCigarId
) {
    const data = getReorderInfoData(
        type,
        fromIdx,
        toIdx,
        insertBeforeCigarId,
        movedCigarId
    );

    displayOrder.stomp.send(
        "/pub/store/reorder",
        displayOrder.getStompHeader(),
        JSON.stringify(data)
    );
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE) {
    //         const json = JSON.parse(hr.responseText);
    //         if (hr.status == 200) {
    //             sendReorderInfoSuccess();
    //         } else {
    //             // 에러 처리
    //             // if (json.errorCode == errorCode.)

    //             common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    //         }
    //     }
    // };

    // const data = getReorderInfoData();

    // hr.open("PUT", "http://localhost:8060/api/cigarette_on_lists/reorder");
    // hr.setRequestHeader("Content-Type", "application/json");
    // hr.setRequestHeader("Authorization", common.getAccessToken());
    // hr.send(JSON.stringify(data));
}

export function reorderMessageHandler(message) {
    console.log("received!!!");
    console.log(message);
    const body = JSON.parse(message.body);
    console.log(body);

    if (body.status == 200) {
        sendReorderInfoSuccess(body.data);
    } else if (hr.status == 401) {
        common.redirectToLogin();
    } else {
        common.giveToastNoti("알 수 없는 이유로 수행할 수 없습니다.");
    }
}

function sendReorderInfoSuccess(data) {
    // 일단은 DOM의 순서정보 attribute는 수정하지 않음 (굳이 안해도 될 것 같기도 해서)

    const { requestUserId, content } = data;
    // 다른 사용자의 화면에서도 새 순서 적용
    if (requestUserId != common.getUserId()) {
        if (content.orderTypeCode == "display") {
            applyNewOrder(
                displayOrder.cigaretteListSection,
                ".cigarette_on_list",
                content
            );
        } else {
            applyNewOrder(
                displayOrder.computerizedCigaretteListSection,
                ".cigarette_on_list_computerized",
                content
            );
        }
    }

    // 전산순 리스트의 디바이더 전부 삭제 후 다시 달아줌
    if (content.orderTypeCode == "computational") {
        displayOrder.computerizedCigaretteListSection
            .querySelectorAll(".divider")
            .forEach((item) => item.remove());

        const compItems = document.querySelectorAll(
            ".cigarette_on_list_computerized"
        );

        for (const i in compItems) {
            const curr = compItems[i];

            if (parseInt(i) % 5 == 0 && i != 0) {
                const dividerDOM = document.createElement("div");
                dividerDOM.classList.add("divider");
                displayOrder.computerizedCigaretteListSection.insertBefore(
                    dividerDOM,
                    curr
                );
            }
        }
    }

    // displayOrder.toggleEditMode();
}

function applyNewOrder(section, selector, data) {
    const {
        storeId,
        requestUserId,
        orderInfos,
        orderTypeCode,
        fromIdx,
        toIdx,
        insertBeforeCigarId,
        movedCigarId,
    } = data;
    console.log(movedCigarId);
    console.log(insertBeforeCigarId);

    const movedItem = displayOrder.findCurrCigarDOM(selector, movedCigarId);

    if (insertBeforeCigarId == null) {
        // 이동된 자리 다음에 아무것도 없을 때 (맨 마지막 자리로 배정받을 때)
        section.appendChild(movedItem);
        movedItem.remove();
    } else {
        const insertBeforeCigarItem = displayOrder.findCurrCigarDOM(
            selector,
            insertBeforeCigarId
        );
        section.insertBefore(movedItem, insertBeforeCigarItem);
    }
}

function getReorderInfoData(
    orderTypeCode,
    fromIdx,
    toIdx,
    insertBeforeCigarId,
    movedCigarId
) {
    return {
        requestUserId: common.getUserId(),
        responseChannel: displayOrder.channel.REORDER(),
        content: {
            storeId: displayOrder.getStoreId(),
            orderInfos: mergeOrderData(
                getDisplayOrderData(),
                getComputerizedOrderData()
            ),
            orderTypeCode,
            fromIdx,
            toIdx,
            insertBeforeCigarId,
            movedCigarId,
        },
    };
}

function mergeOrderData(l1, l2) {
    const result = [];
    for (const key in l1) {
        const data = {
            id: l1[key].id,
            display_order: l1[key].display_order,
            computerized_order: l2[key].computerized_order,
        };
        result.push(data);
    }
    return result;
}

function getDisplayOrderData() {
    const displayOrderItems = document.querySelectorAll("li.cigarette_on_list");
    const result = [];
    var i = 1;
    for (const item of displayOrderItems) {
        const data = {
            id: item.id,
            display_order: i,
        };
        result.push(data);
        i++;
    }
    result.sort((a, b) => a.id - b.id);
    return result;
}

function getComputerizedOrderData() {
    const computerizedOrderItems = document.querySelectorAll(
        "li.cigarette_on_list_computerized"
    );

    const result = [];
    var i = 1;
    for (const item of computerizedOrderItems) {
        const data = {
            id: item.id,
            computerized_order: i,
        };
        result.push(data);
        i++;
    }
    result.sort((a, b) => a.id - b.id);
    return result;
}
