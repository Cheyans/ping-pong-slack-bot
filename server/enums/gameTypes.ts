/**
 * Your team vs Opponent's team
 */
export enum GameTypes {
  SINGLES = "1v1",
  DOUBLES = "2v2",
  TRIPLES = "3v3",
  ONE_VS_TWO = "1v2",
  TWO_VS_ONE = "2v1",
  TWO_VS_THREE = "2v3",
  THREE_VS_TWO = "3v2"
}

export namespace GameTypes {
  export const members = [
    GameTypes.SINGLES,
    GameTypes.DOUBLES,
    GameTypes.TRIPLES,
    GameTypes.ONE_VS_TWO,
    GameTypes.TWO_VS_ONE,
    GameTypes.TWO_VS_THREE,
    GameTypes.THREE_VS_TWO
  ];

  /**
   * Your team vs Opponent's team
   */
  export const playerCounts = {
    [GameTypes.SINGLES]: [0, 1],
    [GameTypes.DOUBLES]: [1, 2],
    [GameTypes.TRIPLES]: [2, 3],
    [GameTypes.ONE_VS_TWO]: [0, 2],
    [GameTypes.TWO_VS_ONE]: [1, 1],
    [GameTypes.TWO_VS_THREE]: [1, 3],
    [GameTypes.THREE_VS_TWO]: [2, 2]
  };
}
