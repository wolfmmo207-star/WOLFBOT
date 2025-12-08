const leavenoti = require('../../modules/events/leavenoti.js');

module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");

    return async function ({ event }) {
        const { threadID, logMessageType, logMessageData, author } = event;
        const { setData, getData, delData, createData } = Threads;

        try {
            let threadData = await getData(threadID);
            if (!threadData) {
                logger('Dữ liệu nhóm không tồn tại: ' + threadID, '[ERROR]');
                return;
            }

            let dataThread = threadData.threadInfo || {};
            dataThread.adminIDs = dataThread.adminIDs || [];
            dataThread.participantIDs = dataThread.participantIDs || [];

            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT == "add_admin") {
                        dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
                        api.sendMessage(`✅ Update ${dataThread.adminIDs.length} QTV`, threadID);
                    } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                        dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                        api.sendMessage(`✅ Update ${dataThread.adminIDs.length} QTV`, threadID);
                    }
                    logger('Làm mới list admin tại nhóm ' + threadID, '[UPDATE DATA]');
                    await setData(threadID, { threadInfo: dataThread });
                    break;
                }
                case "log:thread-name": {
                    logger('Cập nhật tên tại nhóm ' + threadID, '[UPDATE DATA]');
                    dataThread.threadName = logMessageData.name;
                    await setData(threadID, { threadInfo: dataThread });
                    api.sendMessage(`📝 Tên nhóm đã được đổi thành: ${logMessageData.name}`, threadID);
                    break;
                }
                case 'log:unsubscribe': {
                    const userFbId = logMessageData.leftParticipantFbId;
                    if (userFbId == api.getCurrentUserID()) {
                        logger('Thực hiện xóa data của nhóm ' + threadID, '[DELETE DATA THREAD]');
                        const index = global.data.allThreadID?.findIndex(item => item == threadID);
                        if (index > -1) global.data.allThreadID.splice(index, 1);
                        await delData(threadID);
                        return;
                    } else {
                        (await leaveNoti.run({ api, event, Users, Threads }));
                        const participantIndex = dataThread.participantIDs.findIndex(item => item == userFbId);
                        if (participantIndex > -1) dataThread.participantIDs.splice(participantIndex, 1);

                        const adminIndex = dataThread.adminIDs.findIndex(item => item.id == userFbId);
                        if (adminIndex > -1) {
                            dataThread.adminIDs.splice(adminIndex, 1);
                        }

                        logger('Thực hiện xóa user ' + userFbId, '[DELETE DATA USER]');
                        await setData(threadID, { threadInfo: dataThread });
                    }
                    break;
                }
            }
        } catch (e) {
            console.error('Đã xảy ra lỗi update data: ' + e);
        }
        return;
    };
};
