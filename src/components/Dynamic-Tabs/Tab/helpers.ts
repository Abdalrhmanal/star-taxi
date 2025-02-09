
export const generateRandomColor = () => {
  let color = '#' + Math.floor(Math.random() * 16777215).toString(16);

  while (color.length < 7) {
    color += '0';
  }
  return color;
};

export const getStatusColor = (status: any) => {
  switch (status) {
    case "Completed":
      return { color: "#118d72", backgroundColor: "#dbf6e5" };
    case "Pending":
      return { color: "#b76e00", backgroundColor: "#fff1d6" };
    case "Refunded":
      return { color: "#637381", backgroundColor: "#edeff1" };
    case "InProgress":
      return { color: "#b76d10", backgroundColor: "#edeff1" };
    case "Scheduled":
      return { color: "#611381", backgroundColor: "#edeff1" };
    case "Planned":
      return { color: "#b76e00", backgroundColor: "#fff1d6" };
    default:
      return { color: "text.primary", backgroundColor: "transparent" }; // Default color
  }
};


export const getInitials = (text: string | null | undefined): string => {
  if (!text) return '';
  const words = text.split(' ');
  return words.map(word => word[0]).join('').toUpperCase();
};