const Crawler = require("crawler")
const CronJob = require('cron').CronJob;
const CONFIG = require('./config');
const { WebClient } = require('@slack/web-api');

const web = new WebClient(CONFIG.slackToken);

let lastRefernceTime;

const smartStoreJob = new CronJob(CONFIG.cronString, () => {
    const crawler = new Crawler({
        maxConnections: 1,
        callback: (err, res, done) => {
            const currentTime = new Date();
            if (!lastRefernceTime) {
                lastRefernceTime = currentTime;
            }
            if (err) {
                console.error(err);
            } else {
                const $ = res.$;
                console.log($("title").text());
                console.log(`[${currentTime.toUTCString()}] 구매가능?`, $("div._2QCa6wHHPy").find("div.XqRGHcrncz").text());
                if ($("div._2QCa6wHHPy").find("div.XqRGHcrncz").children().length === 2) {
                    console.log("[${currentTime.toUTCString()}] 구매 가능!");
                    web.chat.postMessage({
                        channel: 'shopping-alarm',
                        mrkdwn: true,
                        text: `스마트 스토어 상품이 구매 가능 상태로 변경되었습니다! 고고고! => ${CONFIG.smartStoreTarget}`
                    });
                } else {
                    console.log("구매 불가 ㅜㅜ");
                    if (currentTime - lastRefernceTime > 1000 * 60 * 60 * 2) {
                        console.log(`[${currentTime.toUTCString()}] 6시간이 지났습니다.`)
                        lastRefernceTime = currentTime;
                        web.chat.postMessage({
                            channel: 'shopping-alarm',
                            mrkdwn: true,
                            text: `스마트 스토어 상품을 계속 추적중입니다. 아직 구매 불가해요 ㅠㅠ => ${CONFIG.smartStoreTarget}`
                        });
                    }
                }
            }
            done();
        }
    });
    
    crawler.queue(CONFIG.smartStoreTarget);
});

const lotteOnJob = new CronJob(CONFIG.cronString, () => {
    const crawler = new Crawler({
        maxConnections: 1,
        rateLimit: 2000,
        callback: (err, res, done) => {
            if (err) {
                console.error(err);
            } else {
                const $ = res.$;
                console.log($("title").text());
                console.log(`구매가능?`, $("div.productDetailTop").find(`div[data-area="product_buy"]`).children().length);
                if ($("div.productDetailTop").find("div.buttonGroup.col2").children().length === 2) {
                    console.log("구매 가능!");
                    // web.chat.postMessage({
                    //     channel: 'shopping-alarm',
                    //     mrkdwn: true,
                    //     text: `롯데 ON 상품이 구매 가능 상태로 변경되었습니다! 고고고! => ${CONFIG.lotteOnTarget}`
                    // })
                } else {
                    console.log("구매 불가 ㅜㅜ")
                }
            }
            done();
        }
    });
    
    crawler.queue(CONFIG.lotteOnTarget);
});

smartStoreJob.start();
// lotteOnJob.start();

console.log(`[${(new Date()).toUTCString()}] 스마트스토어 트래킹 시작`);
web.chat.postMessage({
    channel: 'shopping-alarm',
    mrkdwn: true,
    text: `스마트 스토어 상품을 추적을 시작했습니다! => ${CONFIG.smartStoreTarget}`
});