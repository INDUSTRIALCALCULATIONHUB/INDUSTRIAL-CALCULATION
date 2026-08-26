(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character];
    });
  }

  function formatEngineeringValue(value) {
    if (!Number.isFinite(value)) return "—";

    var magnitude = Math.abs(value);
    if (magnitude === 0) return "0";

    if (magnitude >= 1e9 || magnitude < 1e-6) {
      return value.toExponential(6);
    }

    return value.toLocaleString(undefined, { maximumSignificantDigits: 7 });
  }

  function render(output, options) {
    var rows = options.rows.map(function (row) {
      var displayValue = row.display == null ? formatEngineeringValue(row.value) : row.display;
      return "<tr><th scope=\"row\">" + escapeHtml(row.unit) + "</th><td class=\"converter-results__value\">" + escapeHtml(displayValue) + "</td></tr>";
    }).join("");

    output.innerHTML = "<section class=\"result-card converter-results\" aria-live=\"polite\" aria-labelledby=\"converter-result-title\">" +
      "<div class=\"converter-results__heading\"><div><p class=\"converter-results__eyebrow\">Equivalent values</p><h2 id=\"converter-result-title\">" + escapeHtml(options.title) + "</h2></div><span>" + escapeHtml(options.quantityLabel) + "</span></div>" +
      "<p class=\"converter-results__context\">" + escapeHtml(options.context) + "</p>" +
      "<div class=\"converter-results__table-wrap\"><table class=\"result-table converter-result-table\"><caption>" + escapeHtml(options.title) + " for the entered value.</caption><thead><tr><th scope=\"col\">" + escapeHtml(options.unitColumn) + "</th><th scope=\"col\">" + escapeHtml(options.valueColumn) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
      "<p class=\"converter-results__precision\">Display precision: up to 7 significant digits. Scientific notation is used for values below 1 × 10⁻⁶ or at least 1 × 10⁹.</p>" +
      (options.note ? "<p class=\"converter-results__note\">" + escapeHtml(options.note) + "</p>" : "") +
      "</section>";
  }

  window.ICHConverterResults = { format: formatEngineeringValue, render: render };
}());
