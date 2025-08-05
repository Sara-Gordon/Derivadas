document.getElementById("derivative-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const input = document.getElementById("function-input").value;
  const stepsDiv = document.getElementById("steps");
  stepsDiv.innerHTML = "";

  if (!input) {
    stepsDiv.innerHTML = "<p>Por favor, escribe una función.</p>";
    return;
  }

  try {
    const expr = math.parse(input);
    const simplified = expr.simplify();
    
    // Derivada simbólica
    const derivative = math.derivative(simplified, 'x');
    
    // Mostrar pasos (en texto)
    const step1 = `1️⃣ Definición del límite de la derivada:`;
    const step2 = `f'(x) = lim (Δx→0) [ f(x + Δx) - f(x) ] / Δx`;
    const step3 = `2️⃣ Sustituimos f(x):`;
    const step4 = `= lim (Δx→0) [ (${input.replace(/ /g, '')}) evaluado en x + Δx menos f(x) ] / Δx`;
    const step5 = `3️⃣ Simplificamos y desarrollamos:`;
    const step6 = `= ${derivative.toString()}`;
    const step7 = `✅ Resultado final: f'(x) = ${derivative.toTex()}`;

    stepsDiv.innerHTML = `
      <p>${step1}</p>
      <p>${step2}</p>
      <p>${step3}</p>
      <p>${step4}</p>
      <p>${step5}</p>
      <p>${step6}</p>
      <p><strong>${step7}</strong></p>
    `;

    // Graficar con Desmos
    const elt = document.getElementById('graph');
    elt.innerHTML = "";
    const calculator = Desmos.GraphingCalculator(elt);
    calculator.setExpression({ id: 'f', latex: `y=${simplified.toTex()}` });
    calculator.setExpression({ id: 'df', latex: `y=${derivative.toTex()}` });

  } catch (error) {
    console.error(error);
    stepsDiv.innerHTML = `
      <p>⚠️ Error al procesar la función. Asegúrate de que esté bien escrita.</p>
      <p>Ejemplos válidos: <code>x^2</code>, <code>sqrt(x)</code>, <code>1/x</code>, <code>sin(x)</code>, <code>exp(x)</code></p>
    `;
  }
});
