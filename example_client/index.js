const knapsackInstance = {
    size: 10,
    weights: [1, 2, 3, 4],
    utilities: [1,2,3,4]
};

const updateInstanceFromFormEntries = function() {
    knapsackInstance.size = $('#kssize').val();
    knapsackInstance.weights = [];
    knapsackInstance.utilities = [];
    for(let i = 0; i<$('#ksnumitems').val(); i++) {
        knapsackInstance.weights.push($('#ksitemutility' + (i+1)).val());
        knapsackInstance.utilities.push($('#ksitemweight' + (i+1)).val());
    }
};

const rebuildFormItemEntries = function() {
    let s = '';
    for(let i=0; i<knapsackInstance.weights.length; i++) {
        s += `<label>Utility of item ${i + 1} <input id="ksitemutility${i + 1}" type="number" value="${knapsackInstance.utilities[i]}" /></label><br />`;
        s += `<label>Weight of item ${i + 1} <input id="ksitemweight${i + 1}" type="number" value="${knapsackInstance.weights[i]}" /></label><br />`;
    }
    $('#myksitementries').html(s);
};

const updateNumItems = function(newNumItems) {
    const oldNumItems = knapsackInstance.weights.length;
    if(newNumItems > oldNumItems) {
        for(let i = 0; i<newNumItems-oldNumItems; i++) {
            knapsackInstance.weights.push(0);
            knapsackInstance.utilities.push(0);
        }
    } else {
        for(let i = 0; i<oldNumItems-newNumItems; i++) {
            knapsackInstance.weights.pop();
            knapsackInstance.utilities.pop();
        }
    }
    rebuildFormItemEntries();
};

const instanceToJsonGdxFormat = function(instance) {
    return {
        sets: [{name: 'i', from: 1, to: instance.weights.length }],
        parameters: [
            {name: 'v', indices: 'i', values: instance.utilities},
            {name: 'w', indices: 'i', values: instance.weights},
        ],
        scalars: [ {name: 'C', value: instance.size } ] };
};

$(document).ready(function() {
    const socket = io('http://localhost:8001');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    socket.on('sendcode', function(data) {
        $('#tamodelcode').val(data.code);
    });

    $('#ksnumitems').on('change', function(evt) {
        updateNumItems($(this).val());
    });

    $('#kssize').val(knapsackInstance.size);
    rebuildFormItemEntries();

    $('input[id^="ks"]').on('change', function(evt) {
        updateInstanceFromFormEntries();
    });

    $('#btnshowjson').click(function(evt) {
        $('#resultbox').html(JSON.stringify(knapsackInstance));
    });

    $('#solvebtn').click(function(evt) {
        socket.emit('solve', { code: $('#tamodelcode').val(), data: instanceToJsonGdxFormat(knapsackInstance) });
    });

    socket.on('solveresult', function(data) {
        $('#resultbox').html(JSON.stringify(data));
    });
});