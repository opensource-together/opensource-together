// Point d'entrée unique pour toutes les features API
import * as projects from "../../features/projects/services/projectAPI";

// import * as auth from "../../features/auth/services/authAPI";
// import * as users from "../../features/users/services/usersAPI";
// import * as guides from "../../features/guides/services/guidesAPI";
// import * as profile from "../../features/profile/services/profileAPI";

export const client = {
  projects,
  // auth,
  // users,
  // guides,
  // profile,
};
