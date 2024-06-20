let sortAscending = false;
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

function setupPopup2() {
    
    document.getElementById("showMoonsButton").addEventListener("click", function () {
        var popup = document.getElementById("moonModal");
        popup.style.display = "block";
    });

    document.getElementById("closeMoonModal").addEventListener("click", function () {
        var popup = document.getElementById("moonModal");
        popup.style.display = "none";
    });

        // Ukloni prethodni graf (ako postoji)
        d3.select("#moonChart").selectAll("*").remove();

        showMoonChart('gravity', 'Gravity', sortAscending); // Default chart on popup open

    document.getElementById("sortButton").addEventListener("click", function () {
        sortAscending = !sortAscending;
        const activeButton = document.querySelector('.graph-buttons button.active');
        if (activeButton) {
            const selectedAttribute = activeButton.getAttribute('data-attribute');
            const title = activeButton.innerText;
            showMoonChart(selectedAttribute, title, sortAscending);
        } else {
            console.error("No active button found.");
        }
    });
}

function changeActiveButton(button, attribute, title) {
    const buttons = document.querySelectorAll('.graph-buttons button');
    buttons.forEach(btn => btn.classList.remove('active')); // Uklanja klasu "active" sa svih gumba
    button.classList.add('active'); // Dodaje klasu "active" na kliknuti gumb
    showMoonChart(attribute, title, sortAscending);
}

function showMoonChart(attribute, title, sortAscending) {
    d3.json("../data/moonscsvjson.json").then(moonsData => {
        let sortedMoonsData = moonsData.slice(); // Kopiramo podatke kako bismo izbjegli promjenu originalnog niza
        if (sortAscending) {
            sortedMoonsData.sort((a, b) => d3.ascending(a[attribute], b[attribute]));
        } else {
            sortedMoonsData.sort((a, b) => d3.descending(a[attribute], b[attribute]));
        }
        d3.select("#moonViz").selectAll("*").remove(); // Ukloni prethodni graf
        drawMoonChart(attribute, title, sortedMoonsData);
    });
}

function drawMoonChart(attribute, title, moonsData) {
    var margin = { top: 100, right: 80, bottom: 150, left: 140 };
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(moonsData.map(d => d.eName))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(moonsData, d => d[attribute])])
        .range([height, 0]);

    var svg = d3.select("#moonViz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("background-color", "#505050")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2.2))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(title);

    // Dodavanje osi X
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("dx", "-55px")
        .attr("dy", "0")
        .style("font-size", "15px");

    // Dodavanje osi Y
    var yAxis = d3.axisLeft(y).ticks(10);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll("rect")
        .data(moonsData)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.eName); })
        .attr("y", function (d) { return y(0); })
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", function (d, i) { return colorScale(i); }) // Postavljanje boje na temelju indeksa podataka
        .transition()
        .duration(800)
        .attr("y", function (d) { return y(d[attribute]); })
        .attr("height", function (d) { return height - y(d[attribute]); });

    // Dodavanje osi X s naslovom "Moons"
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 1.5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Moons");

    // Dodavanje osi Y s naslovom atributa (velikim početnim slovom)
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", -margin.left + 40)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(splitCamelCase(attribute));

    // Funkcija za dodavanje razmaka između riječi u camel case nazivu atributa
    function splitCamelCase(s) {
        return s.replace(/([A-Z])/g, ' $1') // Dodajemo razmak ispred svakog velikog slova
            .replace(/^./, function (str) { return str.toUpperCase(); }); // Veliko početno slovo
    }

}

document.addEventListener("DOMContentLoaded", setupPopup2);
