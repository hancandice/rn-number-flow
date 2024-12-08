import NonDigit, { NonDigitProps } from "./NonDigit";

const DecimalPoint = (props: Omit<NonDigitProps, "character">) => (
  <NonDigit {...props} character="." />
);

export default DecimalPoint;
