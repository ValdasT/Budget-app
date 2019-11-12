const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const VERSION = '2019-02-01';
let assistantId = process.env.WATSON_ASSISTANT_ID;
let apikey = process.env.WATSON_API_KEY;
let url = 'https://gateway-lon.watsonplatform.net/assistant/api'

let getResponse = (req, res) => {
    return new Promise((resolve, reject) => {
        createConnection(async (err, assistan) => {
           let sessionId = req.cookies.sessionId;
            console.log( req.cookies.sessionId);
            if (!sessionId) {
                sessionId = await createSessionId(assistan);
                res.cookie('sessionId', sessionId, {maxAge: 360000});
            }

            assistan.message({
                assistantId: assistantId,
                sessionId: sessionId,
                input: {
                    'message_type': 'text',
                    'text': req.body.userMessage
                }
            })
                .then(res => {
                    resolve(res.result.output.generic)
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                });
        })
    });
};

let createConnection = (callback) => {

    const assistant = new AssistantV2({
        version: VERSION,
        authenticator: new IamAuthenticator({
            apikey: apikey
        }),
        url: url
    });
    callback(null, assistant);
}

let createSessionId = (assistan) => {
    return new Promise((resolve, reject) => {
        console.log('creating new session');
        assistan.createSession({
            assistantId: assistantId
        })
            .then(res => {
                let sessionId = res.result.session_id;
                resolve(sessionId)
            })
            .catch(err => {
                reject(err)
            });
    });
}

module.exports = {
    getResponse: getResponse
}