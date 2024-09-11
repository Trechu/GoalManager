function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        location.reload();
    });
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

function close_project(){
    show_elem('project-viewer');
    hide_elem('opened-project');
}

function open_project(project){
    var data = JSON.parse(project);
    window.location.assign('http://localhost:3001/user/' + data._id);
}

function render_project(data){
    hide_elem('project-viewer');
    show_elem('opened-project');
    find_elem('project-title').innerHTML = data["project name"];
    find_elem('project-description').innerHTML = data["project description"];
    var goals = find_elem('project-goals');
    // Clear previous entires
    goals.innerHTML = '';
    for(let goal of data.goals){
        goals.appendChild(create_goal_element(goal));
    }
}

function open_project_addition_menu(){
    find_elem('overlay').style.display='block';
    find_elem('post-addition').style.display='block';
}

function close_project_addition_menu(){
    find_elem('post-addition').style.display='none';
    find_elem('overlay').style.display='none';
}

function handle_post_creation(username){
    var name_data = find_elem('proj-name');
    var desc_data = find_elem('proj-desc');
    if(name_data.value.length <= 4) {
        window.alert('Please provide a name for the project (at least 5 characters and/or numbers)');
        return;
    }
    if(desc_data.value.length <= 4) {
        window.alert('Please provide a brief description of the project (at least 5 characters and/or numbers)');
        return;
    }
    fetch("http://localhost:3001/user/create", {
        method: "POST",
        body: JSON.stringify({username: username, name: name_data.value, description: desc_data.value})
    }).then(response => {
        location.reload();
    });}

close_project_addition_menu();