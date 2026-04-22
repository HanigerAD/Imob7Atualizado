export class CurrencyHelper {
  static numberToCurrency(
    value: number | string,
    casasDecimais = 2,
    casasParaPonto = 3,
    separadorMilhar = ".",
    separadorDecimal = ","
  ) {
    let re =
      "\\d(?=(\\d{" +
      (casasParaPonto || 3) +
      "})+" +
      (casasDecimais > 0 ? "\\D" : "$") +
      ")";

    let num =
      typeof value == "string"
        ? Number(value).toFixed(Math.max(0, ~~casasDecimais))
        : value.toFixed(Math.max(0, ~~casasDecimais));

    return (
      separadorDecimal ? num.replace(".", separadorDecimal) : num
    ).replace(new RegExp(re, "g"), "$&" + (separadorMilhar || ","));
  }
}
