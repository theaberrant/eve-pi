var planetData = [];
var resourceData = [];
var p2Data = [];
var selectedP1 = [];


$.getJSON("data/planets.json", function (data) {
    $.each(data.planets, function (index, item) {
        $("#planet-list").append(
            $('<div></div>')
                .text(item.type)
                .attr("class", "planet_off")
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
                .attr("class", "resource_off")
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
                .attr("class", "p1_off")
        );
    })
});

$.getJSON("data/p2_refined.json", function (data) {
    console.log("Loading P2 Refined...");
    $.each(data, function (index, item) {
        $("#p2-list").append(
            $('<div></div>')
                .text(item.output)
                .attr("class", "p2_off")
        );
        p2Data.push(item)
    })
});

$(document).ready(function () {
//    console.log("Raw Data: " + data)
});

function processPlanet(clicked) {
    // Reset planets
    $("#planet-list").find("> div").each(function (index, element) {
        element.setAttribute('class', 'planet_off');
    });

    console.log("Called processPlanet: " + clicked.innerHTML);
    clicked.setAttribute('class', 'planet_on');
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
    $("#resource-list").children("div").each(function (index, element) {
        element.setAttribute('class', 'resource_off');
    });

    $.each(resources, function (index, resource) {
        $("#resource-list").children("div").each(function (index, resourceElement) {
            if (resourceElement.innerHTML == resource) {
                resourceElement.setAttribute('class', 'resource_on');
            }
        });
    });

    var resourcesToProcess = [];
    $.each(resourceData, function (index, resource) {
        $.each(resources, function (i2, calledResource) {
            if (calledResource == resource.resource) {
                resourcesToProcess.push(resource);
            }
        })
    });

    processP1(resourcesToProcess);
}

function processP1(resources) {
    // Reset p1
    $("#p1-list").children("div").each(function (index, element) {
        element.setAttribute('class', 'p1_off');
    });

    // Update p1 background for matching resource p1 values
    selectedP1 = [];
    $.each(resources, function (index, resource) {
        $("#p1-list").children("div").each(function (index, p1Element) {
            if (p1Element.innerHTML == resource.p1) {
                p1Element.setAttribute('class', 'p1_on');
                selectedP1.push(resource.p1)
            }
        });
    });

    // Define p2 to be updated
    processP2(selectedP1);
    // Process P2
}

function processP2(selectedP1s) {
    // Reset P2
    $("#p2-list").children("div").each(function (index, element) {
        element.setAttribute('class', 'p2_off');
    });

    var p2ToHighlight = [];
    var firstP1 = false;
    $.each(p2Data, function (i2, p2) {
        firstP1 = false;
        $.each(p2.inputs, function (i3, p2Input) {
            $.each(selectedP1s, function (i1, p1) {
                if (p2Input == p1) {
                    if (firstP1) {
                        p2ToHighlight.push(p2)
                    } else {
                        firstP1 = true;
                    }
                }
            })
        })
    });

    $.each(p2ToHighlight, function (index, p2) {
        $("#p2-list").children("div").each(function (index, p2Element) {
            if (p2Element.innerHTML == p2.output) {
                p2Element.setAttribute('class', 'p1_on');
            }
        });
    });
}