function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        window.location.assign('http://localhost:3001/');
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

function open_step_addition_menu(){
    show_elem('overlay');
}

function close_step_addition_menu(){
    hide_elem('overlay');
}

function close_project(){
    window.location.assign('http://localhost:3001/user/');
}

// render_project(JSON.parse(project));
close_step_addition_menu();