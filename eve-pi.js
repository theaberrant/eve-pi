var planetData = [];
var blueprints = [];

// Planet Data is hardcoded, based on http://wiki.eveuniversity.org/Planet
$.getJSON("data/planets.json", function (data) {
    $.each(data.planets, function (index, item) {
        var planetDiv = $('<div></div>')
            .text(item.type)
            .attr("class", "planet_deselected")
            .click(function () {
                processPlanet(this)
            });

        var image = document.createElement('img');
        image.setAttribute('src', getImageUrl(item.type_id));

        planetDiv.prepend(image);

        $("#planet-list").append(planetDiv);
        planetData.push(item)
    })
});

// Based on database static database query:
/*
 SELECT
 CONCAT('{',
 '[',
 GROUP_CONCAT(inputs
 SEPARATOR ','),
 ']',
 '}') AS inputs
 FROM
 (SELECT
 mg_output.marketGroupID,
 mg_output.marketGroupName,
 CONCAT('{"output":', CONCAT('"', it_output.typeName, '",'), '"output_type":', CONCAT('"', mg_output.marketGroupName, '",'), '"output_type_id":', CONCAT('"', it_output.typeID, '",'), '"inputs": [', GROUP_CONCAT(CONCAT('"', it_input.typeName, '"')
 SEPARATOR ','), ']}') inputs
 FROM
 planetSchematicsTypeMap ps_input
 JOIN invTypes it_input ON ps_input.typeID = it_input.typeID
 JOIN planetSchematicsTypeMap ps_output ON ps_input.schematicID = ps_output.schematicID
 JOIN invTypes it_output ON ps_output.typeID = it_output.typeID
 JOIN invMarketGroups mg_output ON it_output.marketGroupID = mg_output.marketGroupID
 WHERE
 ps_input.isInput = 1
 AND ps_output.isInput = 0
 GROUP BY mg_output.marketGroupId , it_output.typeName
 ORDER BY mg_output.marketGroupID DESC) AS input;
 */
$.getJSON("data/blueprints.json", function (data) {
    console.log("Loading Planetary blueprints...");
    $.each(data, function (index, item) {
        blueprints.push(item)
    })
});

function processPlanet(clicked) {
    // Reset planets
    $("#planet-list").find("> div").each(function (index, element) {
        element.setAttribute('class', 'planet_deselected');
    });

    console.log("Called processPlanet: " + clicked.innerText);
    clicked.setAttribute('class', 'planet_selected');
    $.each(planetData, function (index, item) {
        if (item.type == clicked.innerText) {
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
            if (blueprint.inputs != null && calledResource == blueprint.inputs[0]) {
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
        if (blueprint.inputs != null) {
            $.each(blueprint.inputs, function (i3, input) {
                $.each(selectedP1s, function (i1, p1) {
                    if (input == p1.output) {
                        if (firstP1) {
                            console.log("Found blueprint: " + blueprint.output);
                            displayOutput(blueprint);
                        } else {
                            firstP1 = true;
                        }
                    }
                })
            })
        }
    });
}

function displayOutput(blueprint) {
    var blueprintDiv = getDivFromBlueprint(blueprint, 1);

    $("#output-list").append(blueprintDiv);
}

function getDivFromBlueprint(blueprint, level) {
    var blueprintDiv = getOutputDiv(blueprint);

    // Get div for each input and append
    if (blueprint.inputs != null) {
        var inputWrapperDiv = $('<div></div>')
            .attr("class", "input_wrapper");

        $.each(blueprint.inputs, function (i1, input) {
            var inputBlueprint = findBlueprintFromOutput(input);
            if (inputBlueprint != null) {
                var inputDiv = getDivFromBlueprint(inputBlueprint, level + 1);
                inputDiv.attr("class", "input");
                inputWrapperDiv.append(inputDiv);
            }
        });
        blueprintDiv.append(inputWrapperDiv);
    }
    return blueprintDiv
}

function getOutputDiv(blueprint) {
    var returnDiv = $('<div></div>')
        .attr("class", "output_wrapper");
    var outputDiv = $('<div></div>')
        .attr("class", "output");

    var image = document.createElement('img');
    image.setAttribute('src', getImageUrl(blueprint.output_type_id));
    outputDiv.append(image);
    var textDiv = $('<div></div>')
        .text( blueprint.output)
        .attr("class", "output_text")
    var sellPriceDiv = $('<div></div>')
    setSellPriceDivText(blueprint.output_type_id, sellPriceDiv)
    var buyPriceDiv = $('<div></div>')
    setBuyPriceDivText(blueprint.output_type_id, buyPriceDiv)
    textDiv.append(sellPriceDiv)
    textDiv.append(buyPriceDiv)
    outputDiv.append(textDiv);

    returnDiv.append(outputDiv);
    return returnDiv
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

function getImageUrl(typeID) {
    return "https://image.eveonline.com/Type/" + typeID + "_64.png"
}

// TODO: Need to add some sort of local caching
function setSellPriceDivText(typeID, div) {
    var result = null;
    var scriptUrl ="http://api.eve-central.com/api/marketstat?typeid=" + typeID + "&usesystem=30000142"
    $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: true,
        success: function(data) {
            var allMarketData = $(data).find("type[id='" + typeID + "'] sell");
            result = $($(allMarketData).find("min")).text();
            div.text("Min Sell: " + result + " ISK")
        }
    });
}

// TODO: Need to add some sort of local caching
function setBuyPriceDivText(typeID, div) {
    var result = null;
    var scriptUrl ="http://api.eve-central.com/api/marketstat?typeid=" + typeID + "&usesystem=30000142"
    $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: true,
        success: function(data) {
            var allMarketData = $(data).find("type[id='" + typeID + "'] buy");
            result = $($(allMarketData).find("max")).text();
            div.text("Max Buy: " + result + " ISK")
        }
    });
}