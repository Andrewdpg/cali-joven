export type Organization = {
  name: string;
  acronym: string;
};

export type Commission = {
  organization_id: string;
  name: string;
  leader: string;
  members: string[];
};
