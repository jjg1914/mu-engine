export interface Entity {
  id: number;
  send(event: string, ...args: any[]): boolean;
  on(event: string, handler: Function): this;
}
