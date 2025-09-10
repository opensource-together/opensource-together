export const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "ACCEPTED":
      return "Acceptée";
    case "REJECTED":
      return "Refusée";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
};
