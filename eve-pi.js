var planetData = [];
var blueprints = [];

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

$.getJSON("data/blueprints.json", function (data) {
    console.log("Loading Planetary blueprints...");
    $.each(data, function (index, item) {
        blueprints.push(item)
    })
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
            findP1FromResources(item.resources);
        }
    })
}

function findP1FromResources(resources) {
    var p1Blueprints = [];
    $.each(blueprints, function (i1, blueprint) {
        $.each(resources, function (i2, calledResource) {
            if (calledResource == blueprint.inputs[0]) {
                console.log("Blueprint input " + calledResource + " found: " + blueprint);
                p1Blueprints.push(blueprint);
            }
        })
    });

    findP2FromBlueprints(p1Blueprints);
}

function findP2FromBlueprints(selectedP1s) {
    // Reset Outputs
    var p2ListNode = document.getElementById('output-list');
    while (p2ListNode.firstChild) {
        p2ListNode.removeChild(p2ListNode.firstChild);
    }

    var firstP1 = false;
    $.each(blueprints, function (i2, blueprint) {
        firstP1 = false;
        $.each(blueprint.inputs, function (i3, input) {
            $.each(selectedP1s, function (i1, p1) {
                if (input == p1.output) {
                    if (firstP1) {
                        console.log("Found blueprint: " + blueprint.output);
                        displayBlueprint(blueprint);
                    } else {
                        firstP1 = true;
                    }
                }
            })
        })
    });
}

function displayBlueprint(blueprint) {
    var blueprintDiv = $('<div></div>')
        .text(blueprint.output)
        .attr("class", "output_on");
    $.each(blueprint.inputs, function (i1, input) {
        blueprintDiv.append(
            $('<div></div>')
                .text(input + " -> " + findBlueprintFromOutput(input).inputs)
                .attr("class", "blueprint_inputs")
            , null);
    });

    $("#output-list").append(blueprintDiv);
}

function findBlueprintFromOutput(output) {
    var outputBlueprint = null;
    $.each(blueprints, function (i1, blueprint) {
        if (blueprint.output == output) {
            outputBlueprint = blueprint;
        }
    });
    return outputBlueprint;
}