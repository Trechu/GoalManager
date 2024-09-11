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

function create_divider(){
    var divider = document.createElement('div');
    divider.style.borderLeft = '1px solid #493c55';
    divider.style.height = '100%';
    divider.style.margin = 'auto';
    return divider;
}

function create_step_element(step){
    var stepDiv = document.createElement('div');
    stepDiv.style.textAlign = 'left';
    stepDiv.style.display = 'flex';
    stepDiv.style.flexDirection = 'row';
    stepDiv.style.width = '95%';
    stepDiv.style.height = '3em';
    stepDiv.style.margin = 'auto';
    stepDiv.style.backgroundColor = '#332340';
    stepDiv.style.padding = '0.5em';
    stepDiv.style.textOverflow = 'ellipsis';
    stepDiv.style.overflow = 'hidden';
    stepDiv.style.borderRadius = '15px';
    stepDiv.style.marginTop = '5px';
    stepDiv.style.marginBottom = '5px';
    stepDiv.style.textAlign = 'center';

    var stepBlank1 = document.createElement('div');
    stepBlank1.style.width = '5%';
    stepBlank1.style.margin = 'auto';
    stepBlank1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
  </svg>`

    stepDiv.appendChild(stepBlank1);

    stepDiv.appendChild(create_divider());

    var stepName = document.createElement('div');
    stepName.style.width = '15%';
    stepName.style.margin = 'auto';
    stepName.style.whiteSpace = 'nowrap';
    stepName.style.textOverflow = 'ellipsis';
    stepName.style.overflow = 'hidden';
    var stepText1 = document.createElement('span');
    stepText1.style.fontSize = '15px';
    stepText1.innerHTML = step["step name"];
    stepName.appendChild(stepText1);
    stepDiv.appendChild(stepName);

    stepDiv.appendChild(create_divider());

    var stepDesc = document.createElement('div');
    stepDesc.style.width = '25%';
    stepDesc.style.margin = 'auto';
    stepDesc.style.whiteSpace = 'nowrap';
    stepDesc.style.textOverflow = 'ellipsis';
    stepDesc.style.overflow = 'hidden';
    var stepText2 = document.createElement('span');
    stepText2.style.fontSize = '15px';
    stepText2.innerHTML = step["step description"];
    stepDesc.appendChild(stepText2);
    stepDiv.appendChild(stepDesc);

    stepDiv.appendChild(create_divider());

    var stepStatus = document.createElement('div');
    stepStatus.style.width = '15%';
    stepStatus.style.margin = 'auto';
    stepStatus.style.whiteSpace = 'nowrap';
    stepStatus.style.textOverflow = 'ellipsis';
    stepStatus.style.overflow = 'hidden';

    var stepStatusBlock = document.createElement('div');
    stepStatusBlock.style.width = '85%';
    stepStatusBlock.style.height = '90%';
    stepStatusBlock.style.margin = 'auto';
    stepStatusBlock.style.borderRadius = '10px';
    stepStatusBlock.style.whiteSpace = 'nowrap';
    stepStatusBlock.style.textOverflow = 'ellipsis';
    stepStatusBlock.style.overflow = 'hidden';
    
    switch(step["status"]){
        case "Completed":
            stepStatusBlock.style.backgroundColor = 'ForestGreen';
            break;
        case "In progress":
            stepStatusBlock.style.backgroundColor = 'DarkOrange';
            break;
        case "Suspended":
            stepStatusBlock.style.backgroundColor = 'DarkRed';
            break;
    }

    var stepText3 = document.createElement('span');
    stepText3.style.fontSize = '15px';
    stepText3.innerHTML = step["status"];

    stepStatusBlock.appendChild(stepText3);
    stepStatus.appendChild(stepStatusBlock);
    stepDiv.appendChild(stepStatus);

    stepDiv.appendChild(create_divider());

    var stepDate = document.createElement('div');
    stepDate.style.width = '20%';
    stepDate.style.margin = 'auto';
    stepDate.style.whiteSpace = 'nowrap';
    stepDate.style.textOverflow = 'ellipsis';
    stepDate.style.overflow = 'hidden';
    var stepText4 = document.createElement('span');
    stepText4.style.fontSize = '15px';
    stepText4.innerHTML = step["due date"];
    stepDate.appendChild(stepText4);
    stepDiv.appendChild(stepDate);

    stepDiv.appendChild(create_divider());

    var stepCost = document.createElement('div');
    stepCost.style.width = '15%';
    stepCost.style.margin = 'auto';
    stepCost.style.whiteSpace = 'nowrap';
    stepCost.style.textOverflow = 'ellipsis';
    stepCost.style.overflow = 'hidden';
    var stepText5 = document.createElement('span');
    stepText5.style.fontSize = '15px';
    stepText5.innerHTML = step["cost"];
    stepCost.appendChild(stepText5);
    stepDiv.appendChild(stepCost);

    stepDiv.appendChild(create_divider());

    var stepBlank2 = document.createElement('div');
    stepBlank2.style.width = '5%';
    stepBlank2.style.margin = 'auto';

    stepDiv.appendChild(stepBlank2);

    return stepDiv;
}

function create_goal_element(goal){
    var goalDiv = document.createElement('div');
    
    for(let step of goal.steps){
        goalDiv.appendChild(create_step_element(step));    
    }

    return goalDiv;
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

function open_step_addition_menu(){
    find_elem('overlay').style.display='block';
    find_elem('step-addition').style.display='block';
}

function close_step_addition_menu(){
    find_elem('step-addition').style.display='none';
    find_elem('overlay').style.display='none';
}

function close_project(){
    window.location.assign('http://localhost:3001/user/');
}

// render_project(JSON.parse(project));
close_step_addition_menu();