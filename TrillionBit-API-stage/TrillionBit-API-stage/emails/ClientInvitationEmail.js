module.exports = function clientInvitationEmail(otpassword, appUrl, agentCode, decodedEmail) {
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
        #outlook a {
          padding: 0;
        }
    
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
    
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
    
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        p {
          display: block;
          margin: 13px 0;
        }
        .boxShadow {
            background-image: url(https://gallery.mailchimp.com/e3875b3dfc4f73cd67e7817b6/images/70726600-7f63-45e2-ad54-c2bd1ce25cce.png);
            background-position: top right;
            background-repeat: no-repeat;
            background-color: #fff;
            box-shadow: 0px 0px 10px 6px #ececec;
        }
      </style>
      <!--[if mso]>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
      <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap" rel="stylesheet" type="text/css">
      <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap);
      </style>
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
          .mj-column-per-70 {
            width: 70% !important;
            max-width: 70%;
          }
          .mj-column-per-30 {
            width: 30% !important;
            max-width: 30%;
          }
          .mj-column-per-40 {
            width: 40% !important;
            max-width: 40%;
          }
          .mj-column-per-60 {
            width: 60% !important;
            max-width: 60%;
          }
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width:480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
          td.mj-full-width-mobile {
            width: auto !important;
          }
          .titleWelcome {
            padding-top: 160px;
          }
        }
      </style>
    </head>
    
    <body style="background-color:#f9f9f9;">
      <div style="background-color:#f9f9f9;">
        <!--[if mso | IE]>
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px 0px;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:180px;"> <img height="auto" src="https://api.bitex.com/api/guest/get_image/bitex-logo-india.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                    width="180" /> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="boxShadow-outlook" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div class="boxShadow" style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:420px;"
                >
              <![endif]-->
                  <div class="mj-column-per-70 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:25px 0px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                              <tr>
                                <td align="left" style="font-size:0px;padding:50px 25px 25px 25px;word-break:break-word;">
                                  <div class="titleWelcome" style="font-family:Lato, sans-serif;font-size:22px;font-weight:600;line-height:1;text-align:left;color:#000000;">Welcome to Bitex!</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;"> You have invited by agent ${agentCode} <br/> Now you can start trading cryptocurrencies on one of the Leading Digital Asset Exchanges in the world.</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">In order to activate your account, please click on active now button.</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <a href="${appUrl}/client_activation/${otpassword}/${decodedEmail}">
                                    <button style="border: 2px solid #f79218;border-radius: 5px;background-color: #f79218;height:51px;width:150px;padding:6px 19px;">
                                        <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;color:#fff;">Active Now</div>
                                    </button>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
                <td
                   class="" style="vertical-align:top;width:180px;"
                >
              <![endif]-->
                  <div class="mj-column-per-30 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:0px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"> </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td style="font-size:0px;padding:0px;word-break:break-word;">
                          <p style="border-top:solid 1px #f9f9f9;font-size:1;margin:0px auto;width:100%;"> </p>
                          <!--[if mso | IE]>
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #f9f9f9;font-size:1;margin:0px auto;width:600px;" role="presentation" width="600px"
            >
              <tr>
                <td style="height:0;line-height:0;">
                  &nbsp;
                </td>
              </tr>
            </table>
          <![endif]-->
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="boxShadow-outlook" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div class="boxShadow" style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:240px;"
                >
              <![endif]-->
                  <div class="mj-column-per-40 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="background-color:#f0ab4d;vertical-align:top;padding:0px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                    <tbody>
                                      <tr>
                                        <td style="width:240px;"> <img height="auto" src="https://gallery.mailchimp.com/e3875b3dfc4f73cd67e7817b6/images/b08c06cd-69ab-40db-925f-3418895d1ec5.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                            width="240" /> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
                <td
                   class="" style="vertical-align:top;width:360px;"
                >
              <![endif]-->
                  <div class="mj-column-per-60 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:15px 0px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">Once the account is active, please start off by securing your account with</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"><a href="${appUrl}/login" style="text-decoration:none;color:#17294E;font-size:16px;font-weight:700;line-height:22px;"> Two-factor authentication </a></div>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:40px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">This will help us in keeping your funds safe.</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td style="font-size:0px;padding:0px;word-break:break-word;">
                          <p style="border-top:solid 1px #f9f9f9;font-size:1;margin:0px auto;width:100%;"> </p>
                          <!--[if mso | IE]>
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #f9f9f9;font-size:1;margin:0px auto;width:600px;" role="presentation" width="600px"
            >
              <tr>
                <td style="height:0;line-height:0;">
                  &nbsp;
                </td>
              </tr>
            </table>
          <![endif]-->
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="boxShadow-outlook" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div class="boxShadow" style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:25px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:center;color:#535353;">After that, you are ready to make your first deposit and start trading Fiat against Cryptocurrencies like BTC, ETH, XRP, LTC, XLM and so on. In order to make Fiat Deposit (AED), you need to verify your account by completing
                                    KYC. Follow the steps mentioned <a href="${appUrl}" style="text-decoration:none;color:#17294E;font-size:16px;font-weight:700;line-height:22px;"> here </a>.</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                  <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:25px;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:center;color:#535353;">If you have any questions, please contact us through our support center or email us at</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;"><a href="mail:support@bitex.com" style="text-decoration:none;color:#17294E;font-size:16px;font-weight:700;line-height:22px;"> support@bitex.com </a></div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" vertical-align="middle" style="font-size:0px;padding:0px;word-break:break-word;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                    <tr>
                                      <td align="center" bgcolor="#f9f9f9" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#f9f9f9;" valign="middle">
                                        <p href="" style="display:inline-block;background:#f9f9f9;color:#17294E;font-family:Lato, sans-serif;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;">
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:30px 0px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:center;color:#535353;">Again, thank you for signing up and happy trading!</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:center;color:#535353;">The Bitex Team</div>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word;">
                                  <div style="font-family:Lato, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;"><a href="https://bitex.com" style="text-decoration:none;color:#17294E;font-size:16px;font-weight:700;line-height:22px;"> www.bitex.com </a></div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          <![endif]-->
      </div>
    </body>
    
    </html>`;
}
