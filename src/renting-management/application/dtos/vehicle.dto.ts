export class VehicleDto {
  public name: string;
  public brand: string;
  public model: string;
  public integrity: string;
  public state: number;
  public year: Date;
  public ownerId: number;
  public categories?: string[];
}
