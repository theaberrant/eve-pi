var planetData = [];
var resourceData = [];

$.getJSON("data/planets.json", function (data) {
    $.each(data.planets, function (index, item) {
        $("#planet-list").append(
            $('<div></div>')
                .text(item.type)
                .attr("class", "planet")
                .click(function () {
                    processPlanet(this)
                })
        );
        planetData.push(item)
    })
});

$.getJSON("data/resources.json", function (data) {
    console.log("Loading Resources...");
    $.each(data.resources, function (index, item) {
        $("#resource-list").append(
            $('<div></div>')
                .text(item.resource)
                .attr("class", "resource")
                .click(function () {
                    console.log("Resource Clicked: " + this.innerHTML);
                })
        );
        resourceData.push(item)
    })
});

$.getJSON("data/p1_basic.json", function (data) {
    console.log("Loading P1 Basics...");
    $.each(data.p1, function (index, item) {
        $("#p1-list").append(
            $('<div></div>')
                .text(item)
                .attr("class", "p1")
                .click(function () {
                    console.log("P1 Basic Clicked: " + this.innerHTML);
                })
        );
    })
});

$.getJSON("data/p2_refined.json", function (data) {
    console.log("Loading P2 Refined...");
    $.each(data, function (index, item) {
        $("#p2-list").append(
            $('<div></div>')
                .text(item.output)
                .attr("class", "p2")
                .click(function () {
                    console.log("P2 Refined Clicked: " + this.innerHTML);
                })
        );
    })
});

$(document).ready(function () {
//    console.log("Raw Data: " + data)
});

function processPlanet(clicked) {
    // Reset planets
    $("#planet-list").find("> div").each(function (index, element) {
        element.style.backgroundColor = 'white';
    });

    console.log("Called processPlanet: " + clicked.innerHTML);
    clicked.style.backgroundColor = 'blue';
    $.each(planetData, function (index, item) {
        if (item.type == clicked.innerHTML) {
            console.log("Planet Type: " + item.type);
            console.log("Planet Resources: " + item.resources);
            processResources(item.resources);
        }
    })
}

function processResources(resources) {
    // Reset resources
    $("#resource-list").find("> div").each(function (index, element) {
        element.style.backgroundColor = 'white';
    });

    $.each(resources, function (index, resource) {
        $("#resource-list").find("> div").each(function (index, resourceElement) {
            console.log("Updating Resource " + resource.innerHTML + " for pResource: " + resource);
            if (resourceElement.innerHTML == resource) {
                resourceElement.style.backgroundColor = 'blue';
            }
        });
    });

    var resourcesToProcess = [];
    $.each(resourceData, function(index, resource) {
        $.each(resources, function(i2, calledResource) {
            if (calledResource == resource.resource) {
                resourcesToProcess.push(resource);
            }
        })
    });

    processP1(resourcesToProcess);
}

function processP1(resources) {
    // Reset p1
    $("#p1-list").find("> div").each(function (index, element) {
        element.style.backgroundColor = 'white';
    });

    // Update p1 background for matching resource p1 values
    $.each(resources, function (index, resource) {
        $("#p1-list").find("> div").each(function (index, p1Element) {
            if (p1Element.innerHTML == resource.p1) {
                p1Element.style.backgroundColor = 'blue';
            }
        });
    });

    // Define p2 to be updated

    // Process P2
}