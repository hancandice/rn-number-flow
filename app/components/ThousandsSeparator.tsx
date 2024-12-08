import NonDigit, { NonDigitProps } from "./NonDigit";

const ThousandsSeparator = (props: Omit<NonDigitProps, "character">) => (
  <NonDigit {...props} character="," />
);

export default ThousandsSeparator;
