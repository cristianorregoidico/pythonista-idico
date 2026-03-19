export interface ContactLink {
  id?: string;
  label: string;
  url: string;
}

export interface PublicUser {
  id: string;
  name: string;
  city: string;
  country: string | null;
  latitude: number;
  longitude: number;
  pythonVersion: string;
  pythonTechnologies: string[];
  profileImageUrl: string | null;
  contactLinks: ContactLink[];
}

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
}
