import moment from "moment";

export const formatDate = (date) => {
  const d = new Date(date);
  return moment(d).format("MMM Do YYYY");
};

const formatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (amount) => {
  return `$${formatter.format(amount)}`;
};

export const formatPriceNoSign = (amount) => {
  return `${formatter.format(amount)}`;
};
