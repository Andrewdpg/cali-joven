export type Report = {
  document_id: string;
  title: string;
  created_by: string;
};

export type Document = {
  organization_id: string;
  type: string;
  title: string;
  file_url: string;
};
