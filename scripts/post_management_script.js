function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        window.location.assign('http://localhost:3001/user/');
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

function open_project(id){
    window.location.assign('http://localhost:3001/user/' + id);
}

function handle_search_bar() {
    let data = find_elem('post-search').value;
    document.querySelectorAll('.project-view').forEach((project) => {
        if (project.getAttribute('project-name').toLowerCase().includes(data.toLowerCase())) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    })
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
