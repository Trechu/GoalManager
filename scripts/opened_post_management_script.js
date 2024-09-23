function find_id() {
    const url = window.location.href;
    return url.substring(url.lastIndexOf('/') + 1, url.length);
}

function determine_seed() {
    var seed = find_id();
    while (seed.length < 6) {
        seed = seed + seed;
    }
    return seed;
}

const seed = determine_seed().replace(/[^0-9]/g, '');

function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        window.location.assign('http://localhost:3001/');
    });
}

function to_user() {
    window.location.assign('http://localhost:3001/user');
}

function find_elem(id) {
    return document.getElementById(id);
}

function hide_elem(id) {
    document.getElementById(id).style.visibility = 'hidden';
}

function show_elem(id) {
    document.getElementById(id).style.visibility = 'visible';
}

function get_color(iteration) {
    const letters = '0123456789ABCDEF';
    var color = '#';
    while (seed.length < 6) {
        seed = seed + seed;
    }
    function random(seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    for (var i = 0; i < 6; i++) {
        color += letters[((Math.floor(random(parseInt(seed[i]) + iteration * 2) * 16))) % 16];
    }
    return color;
}

function colorize() {
    let i = 1;
    document.querySelectorAll('.fancy-bar').forEach((element) => {
        element.style.backgroundColor = get_color(i);
        i++;
    });
}


function set_goal_name(goal_name) {
    document.querySelector('#stepModalTitle').innerHTML = goal_name;
}

function handle_search_bar() {
    let data = find_elem('goal-search').value;
    document.querySelectorAll('.goal-view').forEach((goal) => {
        if (goal.getAttribute('goal-name').toLowerCase().includes(data.toLowerCase())) {
            goal.style.display = 'block';
        } else {
            goal.style.display = 'none';
        }
    })
}

function prepare_value(value) {
    var JSONString = JSON.stringify(value);
    var EscapedJSONString = JSONString.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    return JSON.parse(EscapedJSONString);
}

function create_step_request() {

    fetch("http://localhost:3001/user/create/step", {
        method: "POST",
        body: JSON.stringify({
            project_id: find_id(), goal_name: document.querySelector('#stepModalTitle').innerHTML, step_name: prepare_value(find_elem('step-name').value), step_description: prepare_value(find_elem('step-desc').value),
            step_status: prepare_value(find_elem('step-status').value), step_date: prepare_value(find_elem('step-date').value), step_cost: prepare_value(find_elem('step-cost').value)
        })
    }).then(response => {
        window.location.reload();
    });
};

function create_goal_request() {
    fetch("http://localhost:3001/user/create/goal", {
        method: "POST",
        body: JSON.stringify({
            project_id: find_id(), goal_name: prepare_value(find_elem('goal-name').value)
        })
    }).then(response => {
        window.location.reload();
    });
}

function close_project() {
    window.location.assign('http://localhost:3001/user/');
}

colorize();