export class ProfileResponseDto {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  socialLinks: { type: string; url: string }[];
  skills: { name: string; level: string }[];
  experiences: {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
  }[];
  joinedAt: string;
  profileUpdatedAt: string;
}
