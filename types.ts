export enum CellBaseStatus {
  EMPTY = 'EMPTY',
  VISITED = 'VISITED',
}

export interface Position {
  row: number;
  col: number;
}
