// Funkcija za prikazivanje i sakrivanje prozora za graf
function setupPopup() {
    document.getElementById("showGraphsButton").addEventListener("click", function () {
        // Prikaži iskačući prozor
        var popup = document.getElementById("barChartPopup");
        popup.style.display = "block";

        // Ukloni prethodni graf (ako postoji)
        d3.select("#barChart").selectAll("*").remove();

        showChart('Mass (10^24kg)', 'Planetary Mass'); // Default chart on popup open
    });

    document.getElementById("closeBarChartPopup").addEventListener("click", function () {
        var popup = document.getElementById("barChartPopup");
        popup.style.display = "none";
    });
}

function drawChart(attribute, title) {
    d3.json("../data/planetscsvjson.json").then(planetsData => {
        var margin = { top: 100, right: 80, bottom: 150, left: 140 };
        var width = 900 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;

        var x = d3.scaleBand()
            .domain(planetsData.map(d => d.Planet))
            .range([0, width])
            .padding(0.1); //razmak izmedu stupova

        var y = d3.scaleLinear()
            .domain([0, d3.max(planetsData, d => d[attribute])])
            .range([height, 0]);

        var svg = d3.select("#barChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("background-color", "#505050")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y).ticks(10);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("dx", "-55px")
            .attr("dy", "0");

        svg.append("text")
            .attr("x", (width / 2.2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text(title);

        svg.append("text")
            .attr("x", (width / 2.1))
            .attr("y", (height + (margin.bottom / 2)))
            .attr("dy", "45px")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Planets");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", - margin.left + 40)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text(attribute);

        var barchart = svg.selectAll("rect")
            .data(planetsData)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.Planet); })
            .attr("y", function (d) { return y(0); })
            .attr("height", 0) // Početna visina stupca
            .attr("width", x.bandwidth())
            .attr("fill", function (d) { return d.Color; })
            .transition()
            .delay(function (d, i) { return i; }) // Odgađanje tranzicije za svaki stupac
            .duration(800)
            .attr("y", function (d) { return y(d[attribute]); })
            .attr("height", function (d) { return height - y(d[attribute]); }); // Krajnja visina stupca

        svg.selectAll(".label")
            .data(planetsData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", function (d) { return x(d.Planet) + 20; })
            .attr("y", function (d) { return y(0); })
            .text(function (d) { return d[attribute]; })
            .attr("fill", "black")
            .transition()
            .delay(function (d, i) { return i; })
            .duration(800)
            .attr("y", function (d) { return y(d[attribute]) - 5; });
    });
}

function showChart(attribute, title) {
    d3.select("#barChart").selectAll("*").remove();
    drawChart(attribute, title);
}

document.addEventListener("DOMContentLoaded", setupPopup);
