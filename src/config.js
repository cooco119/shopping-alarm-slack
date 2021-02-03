const CONFIG = {
    // smartStoreTarget: 'https://brand.naver.com/legokorea/products/5305713896',
    smartStoreTarget: 'https://brand.naver.com/legokorea/products/5305713692',
    lotteOnTarget: 'https://www.lotteon.com/p/product/LO1443281794?sitmNo=LO1443281794_1443281795&mall_no=1&dp_infw_cd=BSGP914',
    // lotteOnTarget: 'https://www.lotteon.com/m/product/LM5702016913767?entryPoint=mysel&sitmNo=LM5702016913767_001&mall_no=1&dp_infw_cd=MLT',
    cronString: '* */10 * * * *',
    slackToken: process.env.SLACK_TOKEN || '',
};

module.exports = CONFIG;