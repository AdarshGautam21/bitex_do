const express = require('express');
const router = express.Router();
const Crypto = require('crypto');
const randomstring = require("randomstring");
const fs = require("fs");

const BankUtrDetail = require('../../models/BankUtrDetail');

/**
 * @route POST /api/bitgo-setting/update/:bitgoId
 * @description Get assets update.
 * @access Public
 */
router.post('/get_bank_transfer',async (req, res) => {

    const reqData = req.body;
    const privateKey = fs.readFileSync("./config/bitex_live.key");
    
    if(reqData.encryptedKey && reqData.encryptedData) {
        const encryptKey = reqData.encryptedKey;
        const encryptedData = reqData.encryptedData;
        const binaryData = Buffer.from(encryptKey, "base64");
        const createPrivateKey = Crypto.createPrivateKey(privateKey);
        const sessionkey =  Crypto.privateDecrypt({key: createPrivateKey, padding: Crypto.constants.RSA_PKCS1_PADDING}, binaryData).toString();
        const iv = encryptedData.slice(0, 16);
        const decipher = Crypto.createDecipheriv('aes-128-cbc', sessionkey, iv);
        let decrypted = decipher.update(encryptedData, 'base64');
        decrypted += decipher.final();
        if(decrypted) {
            // console.log("decrypted:", decrypted);
            const index = decrypted.lastIndexOf("{");
            const data = JSON.parse(decrypted.slice(index));
            if(data && data.UTR) {
                checkExistingUtr = await BankUtrDetail.findOne({UTR: data.UTR});
                if(checkExistingUtr) {
                    res.json(encrypedResponseGenerator('06', reqData));
                    return;
                }
                // console.log("checkExistingUtr: ", checkExistingUtr, data);
                const bankUtrDetail = new BankUtrDetail({
                    UTR: data.UTR,
                    MODE: data.MODE,
                    amount: data.AMT,
                    SENDERREMARK: data.SENDERREMARK,
                    customerAccountNo: data.CustomerAccountNo,
                    payeeName: data.PayeeName,
                    payeeAccountNumber: data.PayeeAccountNumber,
                    bankPostalCode: data.BankPostalCode,
                    payeeBankIFSC: data.PayeeBankIFSC,
                    payeePaymentDate: data.PayeePaymentDate,
                    bankInternalTransactionNumber: data.BankInternalTransactionNumber,
                });
                bankUtrDetail
                .save()
                .then(bankUtr => {
                    res.json(encrypedResponseGenerator('11', reqData));
                    return;
                })
                .catch(err => {
                    res.json(encrypedResponseGenerator('12', reqData));
                    return;

                });
            } else {
                res.json(encrypedResponseGenerator('12', reqData));
                return;
            }
        }
    } else {
        res.json(encrypedResponseGenerator('12', reqData));
    }
});


/**
 * @route GET /api/bitgo-setting/update/:bitgoId
 * @description Get assets update.
 * @access Public
 */

router.get('/get_bank_transfer', async (req, res) => {
    const bankUtrDetails =  await BankUtrDetail.find();
    res.json({status: 'success', data:bankUtrDetails, message: 'Successfully received transaction details.'});
});

function encrypedResponseGenerator(code, reqData) {
    /////////// encrypedResponseData
    const publicKey  = fs.readFileSync("./config/bitex_live.cer");
    const encryptingKey = randomstring.generate(16);
    const resEncryptedData = Crypto.publicEncrypt(
    {
        key: publicKey,
        padding: Crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encryptingKey)
    )
    let resEncryptKey = resEncryptedData.toString("base64");
    const resIv = encryptingKey.toString("base64");

    let resPlanText = `${resIv}{
        "SuccessANDRejected":"Successful Transaction",
        "CODE":"11"
    }`;
    if(code === '06') {
        resPlanText = `${resIv}{
            "SuccessANDRejected":"Duplicate UTR",
            "CODE":"06"
        }`;
    } else if(code === '12') {
        resPlanText = `${resIv}{
            "SuccessANDRejected": "Failed transaction",
            "CODE":"12"
        }`;
    }
    const cipher = Crypto.createCipheriv('aes-128-cbc', encryptingKey, resIv);
    let resEncryptData = cipher.update(resPlanText, 'utf8', 'base64')
    resEncryptData += cipher.final('base64');

    return {
        requestId: (reqData.requestId) ?  reqData.requestId: '',
        service: (reqData.service) ? reqData.service: '', 
        encryptedKey: resEncryptKey, 
        iv: "", 
        encryptedData: resEncryptData 
    };
}


module.exports = router;
