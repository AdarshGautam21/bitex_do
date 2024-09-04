const sha256 = require('js-sha256');

module.exports = {
    dasshpe_payid: '2011170952471033',
    dasshpe_salt: '453646ff55d141a3',
    // payment_url: 'https://secure.dasshpe.com/crm/jsp/paymentrequest',
    payment_url: 'https://secure.dasshpe.com/crm/jsp/merchantpay',
    front_url: 'https://bitex.com/user-wallet',
    // front_btx_url: 'http://localhost:3000/btxCoin',
    front_btx_url: 'https://bitex.com/btxCoin',
    // front_btx_url: 'http://staging.bitexuae.net/btxCoin',
    // front_url: 'http://localhost:3000/user-wallet',
    // front_url: 'http://staging.bitexuae.net/user-wallet',
    // return_url: 'https://api.bitexuae.net/api/auth/dasshpe-response',
    return_url: 'https://api.bitex.com/api/auth/dasshpe-response',
    generateHash: function(data) {
        var preHashString = "";
        Object.entries(data).forEach(([key, value]) => {
            preHashString += key + "=" + value + "~";
        }); 
        // dataKeys.forEach(function(key) {
        //     preHashString += key + "=" + data[key] + "~";
        // });
        preHashString = preHashString.substring(0, preHashString.length - 1);
        return sha256(preHashString + this.dasshpe_salt).toUpperCase();
    },

    createTransaction: function(data) {
        var hash = this.generateHash(data);
        return Object.assign(data, {'HASH' : hash});
    },

    paymentResponseHtml: function(data) {
        let html = `
        <div className="box">`;
            if(data.status === 'Captured') {
                html += `<img src="https://mcusercontent.com/e3875b3dfc4f73cd67e7817b6/images/1d610de8-2f00-4573-933d-9615e0bddaf1.png"
                />
                <h4 className="green"> Payment successful</h4>`;
            } else {
                html += `<img src="https://mcusercontent.com/e3875b3dfc4f73cd67e7817b6/images/3ebe8e95-be5c-46e7-beb6-98862ffaaf93.png"/>
                <h4 className="red">${data.responseMsg}</h4>`;
            }
            html += `<p> Status: <span>${data.status}</span> </p>
            <p> Transaction ID: <span>${data.transactionId}</span></p>`;
            if(data.paymentType) {
                html += `<p>Payment Type:<span> ${data.paymentType}</span></p>`;
            }
            html += `<p> Amount: <span> ${data.coin} ${data.amount}  </span> </p>

        </div>`;

        return `<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
            <title>Bitex</title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                
                .container-success .box {
                    background-color: #fff;
                    box-shadow: rgba(0, 0, 0, 0.07) 0px 0px 20px;
                    padding: 35px 15px;
                    border-radius: 5px;
                    text-align: center;
                }
                .container-success .box h4 {
                    font-size: 26px;
                    font-weight: 400;
                    margin: 15px 0 30px 0;
                }
                .container-success .box h4.green {
                    color: rgb(6, 196, 54);
                }
                .container-success .box h4.red {
                    color: rgb(214, 8, 8);
                }
                .container-success .box p {
                    color: #414141;
                }
                .container-success .box img {
                    width:10%;
                }
                .container-success .btn {
                    background-color: rgb(23, 41, 78);
                    padding: 8px 22px;
                    color: rgb(255, 255, 255);
                    border: none;
                    border-radius: 3px;
                    font-size: 16px;
                    line-height: 20px;
                    margin-top: 25px;
                }

            </style>
            </head>
        
            <body>
            <div className="container-success">   
                ${html}
            </div>
            </body>
            
        </html>`;
    },

};