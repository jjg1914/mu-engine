export interface Entity {
  id: number;
  send(event: string, ...args: any[]): boolean;
  on(event: string, handler: Function): this;
  before(event: string, handler: Function): this;
  after(event: string, handler: Function): this;
  around(event: string, handler: Function): this;
}
