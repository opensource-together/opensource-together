export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
  type: 'LANGUAGE' | 'TECH';
}

export interface TechStackResponse {
  languages: TechStack[];
  technologies: TechStack[];
}
