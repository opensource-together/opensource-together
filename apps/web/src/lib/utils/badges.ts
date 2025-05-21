export const getRoleBadgeVariant = (
  roleName: string,
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
  return "info"; // default variant
};
