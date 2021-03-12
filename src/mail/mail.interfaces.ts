export interface MailModuleOptions {
  client: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface EmailVar {
  key: string;
  value: string;
}

export interface AuthOptions {
  type: string;
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}
