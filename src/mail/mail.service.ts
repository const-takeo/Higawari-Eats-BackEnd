import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    // using form-data(npm i form-data)
    const form = new FormData();
    form.append('from', `日替わりイーツー <mailgun@${this.options.domain}>`);
    form.append(`to`, `const.takeo@gmail.com`);
    form.append(`subject`, subject);
    // form.append(`text`, content);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, `${eVar.value}`));
    // using got(npm i got) for request
    try {
      const response = await got(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString(`base64`)}`,
          },
          body: form,
        },
      );
      console.log(response.body);
    } catch (error) {
      console.log(error);
    }
  }
  sendVerificationEmail(email: string, code: string) {
    console.log(email, code);
    this.sendEmail('メールを認証して下さい。', 'verifty-email', [
      { key: 'code', value: code },
      { key: 'userName', value: email },
    ]);
  }
}
