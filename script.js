document.getElementById("derivative-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const rawInput = document.getElementById("function-input").value;
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "";

  if (!rawInput) {
    stepsDiv.innerHTML = "<p>Por favor, escribe una función.</p>";
    return;
  }

  try {
    // 👉 Convertir lo escrito a formato math.js
    let input = rawInput
      .replace(/([a-zA-Z])(\d+)/g, '$1^$2')         // x2 -> x^2
      .replace(/ln\(/gi, 'log(')                    // ln(x) -> log(x)
      .replace(/raiz\(/gi, 'sqrt(')                 // raiz(x) -> sqrt(x)
      .replace(/([a-df-zA-DF-Z])x/gi, '$1*x')       // ax -> a*x
      .replace(/^ex$/, 'exp(x)')                    // ex -> exp(x)
      .replace(/([^a-zA-Z])ex/g, '$1exp(x)');       // +ex -> +exp(x)

    const expr = math.parse(input);
    const simplified = expr.simplify();
    const derivative = math.derivative(simplified, 'x');

    // Mostrar pasos
    stepsDiv.innerHTML = `
      <p>1️⃣ Definición del límite de la derivada:</p>
      <p>f'(x) = lim (Δx→0) [ f(x + Δx) - f(x) ] / Δx</p>
      <p>2️⃣ Sustituimos f(x):</p>
      <p>= lim (Δx→0) [ (${rawInput}) evaluado en x + Δx menos f(x) ] / Δx</p>
      <p>3️⃣ Simplificamos y desarrollamos:</p>
      <p>= ${derivative.toString()}</p>
      <p><strong>✅ Resultado final: f'(x) = ${derivative.toTex()}</strong></p>
    `;

    // Graficar
    const elt = document.getElementById('graph');
    elt.innerHTML = "";
    const calculator = Desmos.GraphingCalculator(elt);
    calculator.setExpression({ id: 'f', latex: `y=${simplified.toTex()}` });
    calculator.setExpression({ id: 'df', latex: `y=${derivative.toTex()}` });

  } catch (error) {
    console.error(error);
    stepsDiv.innerHTML = `
      <p>⚠️ Error al procesar la función. Intenta escribirla así: x2, sin(x), ex, raiz(x)</p>
      <p>Ejemplos válidos: <code>x2</code>, <code>raiz(x)</code>, <code>1/x</code>, <code>ex</code>, <code>ln(x)</code>, <code>sin(x)</code></p>
    `;
  }
});
