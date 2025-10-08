export const generatePoNumber = () => {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  return `PO-${ts}-${rand}`.toUpperCase();
};
