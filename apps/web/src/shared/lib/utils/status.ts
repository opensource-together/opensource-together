export const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "ACCEPTED":
      return "Acceptée";
    case "REJECTED":
      return "Refusée";
    default:
      return status;
  }
};

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return "text-orange-400";
    case "ACCEPTED":
      return "text-green-500";
    case "REJECTED":
      return "text-red-500";
    default:
      return "text-black/70";
  }
};
