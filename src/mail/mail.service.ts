import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  sendVerificationEmail(email: string, verifyCode: string) {
    console.log(email);
    console.log(this.options.clientId);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.options.client,
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        refreshToken: this.options.refreshToken,
      },
    });
    transporter.sendMail({
      from: this.options.client,
      to: email,
      subject: 'Higawari-Eats認証メール',
      html: `   
      <div style="text-align:center">
        <h1>アカウントを認証してください。</h1>
        <table align="center" border="3" width="500px" height="300px">
          <tr>
            <th bgcolor=#e3f0fb height="100px"><font size="5">アカウント認証</font></th>
          </tr>
          <tr>
            <td>
                <p><font size="5">ログイン後認証してください。</font></p>
                <a href="http://localhost:3000/confirm?=${verifyCode}"><font size="6">認証を行う</font></a>
            </td>
          </tr>
        </table>
      </div>
      `,
    });
  }
}
