export const getRoleBadgeVariant = (
  roleName: string
): "info" | "danger" | "success" => {
  const lowerRole = roleName.toLowerCase();
  if (lowerRole.includes("frontend") || lowerRole.includes("fullstack")) {
    return "info";
  }
  if (
    lowerRole.includes("design") ||
    lowerRole.includes("ui") ||
    lowerRole.includes("ux")
  ) {
    return "danger";
  }
  if (lowerRole.includes("backend") || lowerRole.includes("core")) {
    return "success";
  }
  return "info";
};

export const getTechBadgeVariant = (
  techName: string
): "info" | "danger" | "success" => {
  const lowerTech = techName.toLowerCase();
  if (
    lowerTech.includes("react") ||
    lowerTech.includes("next") ||
    lowerTech.includes("angular") ||
    lowerTech.includes("vue") ||
    lowerTech.includes("frontend") ||
    lowerTech.includes("typescript") ||
    lowerTech.includes("javascript") ||
    lowerTech.includes("html") ||
    lowerTech.includes("css") ||
    lowerTech.includes("sass") ||
    lowerTech.includes("scss") ||
    lowerTech.includes("tailwind") ||
    lowerTech.includes("bootstrap") ||
    lowerTech.includes("material") ||
    lowerTech.includes("chakra") ||
    lowerTech.includes("emotion") ||
    lowerTech.includes("styled")
  ) {
    return "info";
  }
  if (
    lowerTech.includes("design") ||
    lowerTech.includes("ui") ||
    lowerTech.includes("ux") ||
    lowerTech.includes("figma") ||
    lowerTech.includes("adobe") ||
    lowerTech.includes("illustrator") ||
    lowerTech.includes("photoshop") ||
    lowerTech.includes("premiere") ||
    lowerTech.includes("after") ||
    lowerTech.includes("effects") ||
    lowerTech.includes("motion") ||
    lowerTech.includes("design")
  ) {
    return "danger";
  }
  if (
    lowerTech.includes("node") ||
    lowerTech.includes("express") ||
    lowerTech.includes("nest") ||
    lowerTech.includes("fastify") ||
    lowerTech.includes("graphql") ||
    lowerTech.includes("apollo") ||
    lowerTech.includes("prisma") ||
    lowerTech.includes("supabase") ||
    lowerTech.includes("firebase") ||
    lowerTech.includes("django") ||
    lowerTech.includes("flask") ||
    lowerTech.includes("backend") ||
    lowerTech.includes("core") ||
    lowerTech.includes("java") ||
    lowerTech.includes("php") ||
    lowerTech.includes("ruby") ||
    lowerTech.includes("go") ||
    lowerTech.includes("rust") ||
    lowerTech.includes("elixir") ||
    lowerTech.includes("erlang") ||
    lowerTech.includes("scala") ||
    lowerTech.includes("kotlin") ||
    lowerTech.includes("swift") ||
    lowerTech.includes("dart") ||
    lowerTech.includes("postgres") ||
    lowerTech.includes("mysql") ||
    lowerTech.includes("mongodb") ||
    lowerTech.includes("redis") ||
    lowerTech.includes("rabbitmq") ||
    lowerTech.includes("kafka") ||
    lowerTech.includes("aws") ||
    lowerTech.includes("azure") ||
    lowerTech.includes("gcp") ||
    lowerTech.includes("docker") ||
    lowerTech.includes("kubernetes")
  ) {
    return "success";
  }
  return "info";
};
