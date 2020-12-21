var express = require('express');
const nodemailer =require('nodemailer');

function mailCodeSend(output,mail){
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'tikmoneyapp@gmail.com',
        pass: '12367321aA*'
      }
    });
    
    var mailOptions = {
      from: 'tikmoneyapp@gmail.com',
      to: mail,
      subject: 'TikMoney',
      html: `<!DOCTYPE html>
      <html lang="tr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #f1f1f1;margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;">
      <head style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <meta charset="utf-8" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <meta name="viewport" content="width=device-width" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <meta name="x-apple-disable-message-reformatting" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <title style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"></title>
          <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
      <style style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">html,
      body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
      }* {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }div[style*="margin: 16px 0"] {
          margin: 0 !important;
      }table,
      td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
      }table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
      }img {
          -ms-interpolation-mode:bicubic;
      }a {
          text-decoration: none;
      }
      *[x-apple-data-detectors],  /* iOS */
      .unstyle-auto-detected-links *,
      .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }.a6S {
          display: none !important;
          opacity: 0.01 !important;
      }.im {
          color: inherit !important;
      }
      img.g-img + div {
          display: none !important;
      }
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u ~ div .email-container {
              min-width: 320px !important;
          }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u ~ div .email-container {
              min-width: 375px !important;
          }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
          u ~ div .email-container {
              min-width: 414px !important;
          }
      }</style>
      <style style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">.bg_white{
        background: #ffffff;
      }
      .bg_light{
        background: #fafafa;
      }
      .bg_black{
        background: #000000;
      }
      .bg_dark{
        background: rgba(0,0,0,.8);
      }
      .email-section{
        padding:0em;
      }h1,h2,h3,h4,h5,h6{
        font-family: 'Playfair Display', serif;
        color: #000000;
        margin-top: 0;
      }body{
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0,0,0,.4);
      }a{
        color: #f3a333;
      }table{
      }/*HEADING SECTION*/
      .heading-section{
      }
      .heading-section h2{
        color: #000000;
        font-size: 28px;
        margin-top: 0;
        line-height: 1.4;
      }
      .heading-section .subheading{
        margin-bottom: 20px !important;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(0,0,0,.4);
        position: relative;
      }
      .heading-section .subheading::after{
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        content: '';
        width: 100%;
        height: 2px;
        background: #f3a333;
        margin: 0 auto;
      }</style>
      </head><body width="100%" style="margin: 0 auto !important;padding: 0 !important;mso-line-height-rule: exactly;background-color: #222222;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #f1f1f1;font-family: 'Montserrat', sans-serif;font-weight: 400;font-size: 15px;line-height: 1.8;color: rgba(0,0,0,.4);height: 100% !important;width: 100% !important;">
        <center style="width: 100%;background-color: #f1f1f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
          <div style="display: none;font-size: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;mso-hide: all;font-family: sans-serif;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px;margin: 0 auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
              <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              </tr><tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                <td class="bg_white" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #ffffff;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
                    <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                      <td class="bg_white email-section" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #ffffff;padding: 0em;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                        <table style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
                    <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                      <td style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                        <img src="https://i.hizliresim.com/6Z6O1u.jpg" style="width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;-ms-interpolation-mode: bicubic;">
                      </td>
                    </tr>
                  </table>
                      </td>
                    </tr><!-- end: tr -->
                    <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                      <td class="bg_white email-section" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: #ffffff;padding: 0em;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                        <div class="heading-section" style="text-align: center;padding: 0 30px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                        <span class="subheading" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: inline-block;font-size: 13px;text-transform: uppercase;letter-spacing: 2px;color: rgba(0,0,0,.4);position: relative; !important;">Hesap Aktİvasyonu</span>
                        <hr width="100%" color="#a88132" size="4">
                        <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">Sevgili Kullanıcımız,</p>
                    <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">Bu eposta, kaydınızın tamamlanabilmesi için size otomatik olarak Tikmoney tarafından gönderilmiştir..</p>
                    <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">Kesin kaydınızı tamamlayabilmek için aşağıda belirtilen aktivasyon kodunu uygulamamızdaki email doğrulama ekranına yazınız..</p>
                                <h2 style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Playfair Display', serif;color: #000000;margin-top: 0;font-size: 28px;line-height: 1.4;">${output}</h2>
                        </div>
                      </td>
                    </tr><!-- end: tr -->
                    
                  </table>		      </td>
              </tr><!-- end:tr -->
            <!-- 1 Column Text + Button : END -->
            </table>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
              <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                  <td class="bg_dark email-section" style="text-align: center;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background: rgba(0,0,0,.8);padding: 0em;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
                          <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <td style="text-align: center;padding-right: 10px;color: #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                              <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">© 2020 DESING BY TİKMONEY</p>
                            </td>
                          </tr>
                        </table>
                  </td>
                </tr><!-- end: tr -->
            </table>    </div>
        </center>
      </body>
      </html>`
        
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports = mailCodeSend;