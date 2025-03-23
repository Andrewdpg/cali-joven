export type City = {
  name: string;
};

export type Commune = {
  name: string;
  city_id: string;
  organization_id: string;
  president: string;
  contact_info: string;
};
