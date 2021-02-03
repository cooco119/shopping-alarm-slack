const Crawler = require("crawler")
const CronJob = require('cron').CronJob;
const CONFIG = require('./config');
const { WebClient } = require('@slack/web-api');

const web = new WebClient(CONFIG.slackToken);

const smartStoreJob = new CronJob(CONFIG.cronString, () => {
    const crawler = new Crawler({
        maxConnections: 1,
        rateLimit: 2000,
        callback: (err, res, done) => {
            if (err) {
                console.error(err);
            } else {
                const $ = res.$;
                console.log($("title").text());
                console.log(`구매가능?`, $("div._2QCa6wHHPy").find("div.XqRGHcrncz").text());
                if ($("div._2QCa6wHHPy").find("div.XqRGHcrncz").children().length === 2) {
                    console.log("구매 가능!");
                    web.chat.postMessage({
                        channel: 'shopping-alarm',
                        mrkdwn: true,
                        text: `스마트 스토어 상품이 구매 가능 상태로 변경되었습니다! 고고고! => ${CONFIG.smartStoreTarget}`
                    })
                } else {
                    console.log("구매 불가 ㅜㅜ")
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
