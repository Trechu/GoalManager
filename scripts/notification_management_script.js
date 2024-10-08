function handle_logout() {
    fetch("http://localhost:3001/logout", {
        method: "POST"
    }).then(response => {
        window.location.assign('http://localhost:3001/user/');
    });
}

function to_user() {
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

function handle_search_bar() {
    let data = find_elem('notif-search').value;
    document.querySelectorAll('.notif-div').forEach((notif) => {
        if (notif.getAttribute('project-name').toLowerCase().includes(data.toLowerCase())) {
            notif.style.display = 'block';
        } else {
            notif.style.display = 'none';
        }
    })
}

function resolve_request(_id, decision){
    fetch("http://localhost:3001/user/resolve/member", {
        method: "POST",
        body: JSON.stringify({
            notif_id: _id, status: decision
        })
    }).then(response => {
        window.location.reload();
    });
}