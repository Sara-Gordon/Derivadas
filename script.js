document.getElementById("derivative-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const rawInput = document.getElementById("function-input").value.trim();
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "";

  if (!rawInput) {
    stepsDiv.innerHTML = "<p>Por favor, escribe una función.</p>";
    return;
  }

  try {
    // 🧠 Reglas de transformación amigables para Sarita
    let input = rawInput
      .replace(/(\b[a-z])(\d+)/gi, '$1^$2')             // x2 → x^2, a3 → a^3
      .replace(/ln\(/gi, 'log(')                        // ln(x) → log(x)
      .replace(/raiz\(/gi, 'sqrt(')                     // raiz(x) → sqrt(x)
      .replace(/([0-9])([a-zA-Z])/g, '$1*$2')           // 3x → 3*x
      .replace(/([a-zA-Z])([0-9])/g, '$1^$2')           // x2 → x^2 (si aún no lo hizo)
      .replace(/e\^x/gi, 'exp(x)');                     // e^x → exp(x)

    const expr = math.parse(input);
    const simplified = expr.simplify();
    const derivative = math.derivative(simplified, 'x');

    // Mostrar pasos como en tus hojas
    stepsDiv.innerHTML = `
      <p>1️⃣ Definición del límite de la derivada:</p>
      <p>f'(x) = lim (Δx→0) [ f(x + Δx) - f(x) ] / Δx</p>
      <p>2️⃣ Sustituimos f(x):</p>
      <p>= lim (Δx→0) [ (${rawInput}) evaluado en x + Δx menos f(x) ] / Δx</p>
      <p>3️⃣ Simplificamos y desarrollamos:</p>
      <p>= ${derivative.toString()}</p>
      <p><strong>✅ Resultado final: f'(x) = ${derivative.toTex()}</strong></p>
    `;

    // Gráfica con Desmos
    const elt = document.getElementById('graph');
    elt.innerHTML = "";
    const calculator = Desmos.GraphingCalculator(elt);
    calculator.setExpression({ id: 'f', latex: `y=${simplified.toTex()}` });
    calculator.setExpression({ id: 'df', latex: `y=${derivative.toTex()}` });

  } catch (error) {
    console.error(error);
    stepsDiv.innerHTML = `
      <p>⚠️ Error al procesar la función.</p>
      <p>Asegúrate de escribir funciones como:</p>
      <ul>
        <li><code>x2</code> → se interpreta como <code>x^2</code></li>
        <li><code>e^x</code> → se interpreta como <code>exp(x)</code></li>
        <li><code>raiz(x)</code> → se interpreta como <code>sqrt(x)</code></li>
        <li><code>ln(x)</code> → se interpreta como <code>log(x)</code></li>
      </ul>
    `;
  }
});
