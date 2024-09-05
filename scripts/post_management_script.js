document.getElementById('opened-project').style.display='none';

function close_project(){
    document.getElementById('project-viewer').style.display='block';
    document.getElementById('opened-project').style.display='none'; 
}

function open_project(project){
    document.getElementById('project-viewer').style.display='none';
    document.getElementById('opened-project').style.display='block';
    var data = JSON.parse(project);
    console.log(data);
    console.log(data.members)
}
