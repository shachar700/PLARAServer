const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const config = require("../../config");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics, CartIDs, StationIDs} = require("../models/enums");
const {CartInfo} = require("../models/structs");
const {clearTimeout} = require("node:timers");
const {logMessage} = require("../utils");

let regressionTestInProgress = null;

logSimMessage = (msg) => {
    logMessage(`SimController :: logSimMessage :: message='${msg}'`);
}

simulateQRMessage = (stationId, currCartId, oldCartId) => {
    const stationStatus = new StationStatus(stationId, currCartId, oldCartId);
    systemStatusManager.updateStation(stationStatus);
    logMessage(`simulateQRMessage: ${stationStatus}`);
}

simulateIMUMessage = (cart_id, speed) => {
    const cartInfo = new CartInfo(cart_id, speed);
    systemStatusManager.updateCart(cartInfo);
    logMessage(`simulateIMUMessage: ${cartInfo}`);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

resetSystemStatus = (currentTimeout = null) => {
    if (regressionTestInProgress && (regressionTestInProgress !== currentTimeout)) {
        clearTimeout(regressionTestInProgress);
        regressionTestInProgress = null;
        logMessage("The running regression test was cancelled");
    }
    systemStatusManager.reset();
    logMessage("SystemStatus reset successfully");
    publish(PublisherTopics.SYSTEM_RESET, {message: "SystemStatus reset successfully", timestamp: new Date()});
}

regressionTest = () => {
    const currentTimeout = setTimeout(async ()=>{
        logMessage("Regression test started");

        resetSystemStatus(currentTimeout);
        regressionTestInProgress = currentTimeout;
        await sleep(1000);
        if (regressionTestInProgress === null) return;

        const cartSpeedMPS = 0.2;
        const timeBetweenSt1St2Ms = 8 * 1000;
        const timeBetweenActionsMs = 1.5 * 1000;

        const cart1 = 'Cart RT1';
        const cart2 = 'Cart RT2';

        simulateIMUMessage(cart1, cartSpeedMPS)
        simulateIMUMessage(cart2, cartSpeedMPS)
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_1, cart1, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;
        simulateQRMessage(StationIDs.STATION_1, CartIDs.cart_empty, cart1);
        await sleep(timeBetweenSt1St2Ms);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_2, cart1, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_1, cart2, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;
        simulateQRMessage(StationIDs.STATION_1, CartIDs.cart_empty, cart2);
        await sleep(timeBetweenSt1St2Ms);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_2, cart2, cart1);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        logMessage("Regression test ended")

    }, 0);
}

module.exports = {simulateQRMessage, simulateIMUMessage, resetSystemStatus, regressionTest}