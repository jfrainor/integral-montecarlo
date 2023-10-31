document.addEventListener("DOMContentLoaded", function () {
    const numSimulacionesInput = document.getElementById("numSimulaciones");
    const calcularButton = document.getElementById("calcularButton");
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");

    // Definir los límites de integración
    const límite_inferior = 2;
    const límite_superior = 3;

    // Definir la función que representa la integral a aproximar
    function f(x) {
        return 3 * x ** 2 + 2 * x;
    }

    // Inicializar variables
    let i = 0; // Variable para el número de cálculo
    const calculoRegistroTable = document.getElementById("calculoRegistroTable"); // Tabla para mostrar los resultados

    calcularButton.addEventListener("click", function () {
        const numSimulaciones = parseInt(numSimulacionesInput.value);

        // Restablecer los resultados del Método de Monte Carlo en cada cálculo
        const coordenadas = [];

        let puntos_bajo_curva = 0;

        for (let j = 0; j < numSimulaciones; j++) {
            const x_aleatorio = límite_inferior + Math.random() * (límite_superior - límite_inferior);
            const y_aleatorio = Math.random() * (f(límite_superior));

            coordenadas.push({ x: x_aleatorio, y: y_aleatorio });

            if (y_aleatorio <= f(x_aleatorio)) {
                puntos_bajo_curva++;
            }
        }

        // Borrar la gráfica anterior
        d3.select("svg").remove();

        // Ancho y alto del gráfico
        const width = 600;
        const height = 300;

        // Crear el elemento SVG
        const svg = d3.select(".graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Escala para los ejes X e Y
        const xScale = d3.scaleLinear()
            .domain([límite_inferior, límite_superior])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, f(límite_superior)])
            .range([height, 0]);

        // Dibujar la línea de la función
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(f(d.x)));

        svg.append("path")
            .datum([{ x: límite_inferior, y: 0 }, { x: límite_superior, y: 0 }])
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        // Dibujar los puntos de Monte Carlo
        svg.selectAll("circle")
            .data(coordenadas)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 3)
            .attr("fill", d => d.y <= f(d.x) ? "green" : "red");

        // Calcular el área total del rectángulo y el resultado aproximado de la integral
        const área_total_rectángulo = (límite_superior - límite_inferior) * f(límite_superior);
        const resultado_aproximado = área_total_rectángulo * (puntos_bajo_curva / numSimulaciones);
        const valor_real = 24; // Valor real de la integral
        const error_porcentaje = Math.abs(((valor_real - resultado_aproximado) / valor_real) * 100);

        // Mostrar los resultados
        document.getElementById("valorReal").textContent = valor_real.toFixed(2);
        document.getElementById("resultadoAproximado").textContent = resultado_aproximado.toFixed(2);
        document.getElementById("errorPorcentaje").textContent = error_porcentaje.toFixed(2) + "%";

        // Agregar el cálculo a la tabla en el modal
        const row = calculoRegistroTable.insertRow();
        row.innerHTML = `
            <td>Cálculo ${++i}</td>
            <td>${valor_real.toFixed(2)}</td>
            <td>${resultado_aproximado.toFixed(2)}</td>
            <td>${error_porcentaje.toFixed(2)}%</td>
        `;
    });
});







