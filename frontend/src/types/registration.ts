export interface Registration {
  id: number;
  restaurant: {
    name: string;
    description: string;
  } | null;
  status: string;
  registration_date: string;
}