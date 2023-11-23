export interface ILocation {
  id: number;
  type: string;
  name: string;
  public_name: string;
  parent_id: number;
  state_id?: number;
}
