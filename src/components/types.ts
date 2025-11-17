export interface playerTypeT {
  uid: string;
  name: string;
}
export interface cardTypeT {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'jack'
    | 'queen'
    | 'king'
    | 'joker';
}
