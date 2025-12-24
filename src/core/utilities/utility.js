export const getHours = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, "0"),
    value: String(i).padStart(2, "0"),
  }));
};

export const getMinutes = () => {
  return [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ].map((m) => ({
    label: m,
    value: m,
  }));
};
