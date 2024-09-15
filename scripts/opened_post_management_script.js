function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        window.location.assign('http://localhost:3001/');
    });
}

function to_user(){
    window.location.assign('http://localhost:3001/user');
}

function find_elem(id){
    return document.getElementById(id);
}

function hide_elem(id){
    document.getElementById(id).style.display='none'; 
}

function show_elem(id){
    document.getElementById(id).style.display='block';
}

function open_step_addition_menu(project, goal_name){
    show_elem('overlay');
    var project_data = JSON.parse(project);
    var goal_name = JSON.parse(goal_name);
    console.log(project_data);
    console.log(goal_name);
}

function create_step_request(project, goal_name){
    var project_data = JSON.parse(project);

    fetch("http://localhost:3001/user/create/step", {
        method: "POST",
        body: JSON.stringify({project_id: project_data["_id"], goal_name: JSON.parse(goal_name), step_name: find_elem('step-name').value, step_description: find_elem('step-desc').value,
        step_status: find_elem('step-status').value, step_date: find_elem('step-date').value, step_cost: find_elem('step-cost').value})
    }).then(response => {
        window.location.reload();
    });
};

function close_step_addition_menu(){
    hide_elem('overlay');
}

function close_project(){
    window.location.assign('http://localhost:3001/user/');
}

close_step_addition_menu();