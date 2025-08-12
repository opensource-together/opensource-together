export class WsTokenResponseDto {
  wsToken: string;
  expiresIn: number;
  tokenType: string;

  constructor(
    wsToken: string,
    expiresIn: number = 3600,
    tokenType: string = 'Bearer',
  ) {
    this.wsToken = wsToken;
    this.expiresIn = expiresIn;
    this.tokenType = tokenType;
  }

  static create(wsToken: string): WsTokenResponseDto {
    return new WsTokenResponseDto(wsToken);
  }
}
