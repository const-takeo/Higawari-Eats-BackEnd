import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as FormData from 'form-data';
import got from 'got/dist/source';
import { EmailVar } from './mail.interfaces';

//got
jest.mock('got');
//form-data
jest.mock('form-data');
// , () => {
//     return {
//       append: jest.fn(),
//     };
//   }
const TEST_DOMAIN = 'mock-test-domain';

describe('MailService', () => {
  let service: MailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'mock-test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'mock-test-fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  //
  describe('sendVerificationEmail', () => {
    //
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'mock@mock.com',
        code: 'mock-code',
      };
      //spyOn
      //sendEmailを後でテストするからmockにしない　→ spy関数にする。
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {
        return true;
      });
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      //sendEmailはprivateなのでテストする為にはprivateを消す必要がある。
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'メールを認証して下さい。',
        'verifty-email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'userName', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });
  describe('sendEmail', () => {
    it('should send a email', async () => {
      const sendEmailArgs = {
        subject: 'メールを認証して下さい。',
        template: 'verifty-email',
        emailVars: [],
      };
      const result = await service.sendEmail(
        sendEmailArgs.subject,
        sendEmailArgs.template,
        sendEmailArgs.emailVars,
      );
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formSpy).toHaveBeenCalledTimes(4);
      expect(formSpy).toHaveBeenCalledWith(
        'from',
        `日替わりイーツー <mailgun@${TEST_DOMAIN}>`,
      );
      expect(formSpy).toHaveBeenCalledWith(`to`, `const.takeo@gmail.com`);
      expect(formSpy).toHaveBeenCalledWith(`subject`, sendEmailArgs.subject);
      expect(formSpy).toHaveBeenCalledWith(`template`, sendEmailArgs.template);
      //

      //
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(result).toEqual(true);
    });
    //
    it('should fail', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const result = await service.sendEmail('', '', []);
      expect(result).toEqual(false);
    });
  });
});
