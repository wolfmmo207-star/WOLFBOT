const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "vd",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Niio-team (Vtuan) đã cướp cre của DC-nam", // =))  thay cre t chặt buồi từng thằng ok
    description: "Gửi video supper víp",
    commandCategory: "Nhóm",
    usages: "",
    cooldowns: 0
};

const stream_url = async function (url) {
    return axios({ url: url, responseType: 'stream' }).then(response => response.data);
};
global.anime = [];
global.girl = [];
global.trai = [];
module.exports.onLoad = async function (api) {
    const _v = {
        anime: JSON.parse(fs.readFileSync('./includes/listapi/video/api.json', 'utf-8')),
        girl: JSON.parse(fs.readFileSync('./includes/listapi/video/vdgai.json', 'utf-8')),
        trai: JSON.parse(fs.readFileSync('./includes/listapi/video/trai.json', 'utf-8')),
    };
    ['anime', 'girl', 'trai'].forEach((type, idx) => {
        const _status = `status${idx + 1}`;
        const _gl = `Vtuancuti${idx + 1}`;
        const mảng = global[type];
        if (!global[_gl]) {
            global[_gl] = setInterval(async () => {
                if (global[_status] || mảng.length > 5) return;
                global[_status] = true;

                Promise.all([...Array(7)].map(async () => {
                    const url = _v[type][Math.floor(Math.random() * _v[type].length)];
                    return await upload(url, api);
                })).then(res => {
                    mảng.push(...res);
                    global[_status] = false;
                });
            }, 1000 * 5);
        }
    });
};

const upload = async (url, api) => {
    const form = { upload_1024: await stream_url(url) };
    try {
        const res = await (api.postFormData ? api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php', form) : Promise.resolve({ body: '' }));
        const bodyStr = res && res.body ? res.body : (typeof res === 'string' ? res : JSON.stringify(res));
        const parsed = JSON.parse(bodyStr.replace('for (;;);', ''));
        return Object.entries(parsed.payload?.metadata?.[0] || {})[0];
    } catch (e) {
        console.error('Error uploading video:', e.message);
        return null;
    }
};

module.exports.run = async function (o) {
    const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));
    const videoTypes = {
        anime: global.anime,
        gái: global.girl,
        trai: global.trai
    };
    send({
        body: videoTypes[o.args[0]] ? `Video ${o.args[0].charAt(0).toUpperCase() + o.args[0].slice(1)}` : 'Vui lòng nhập "anime", "gái", hoặc "trai" để nhận video tương ứng.',
        attachment: videoTypes[o.args[0]] ? videoTypes[o.args[0]].splice(0, 1) : []
    });
};
