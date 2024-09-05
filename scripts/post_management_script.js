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

    var stepName = document.createElement('div');
    stepName.style.width = '15%';
    stepName.style.margin = 'auto';
    var stepText1 = document.createElement('span');
    stepText1.style.fontSize = '15px';
    stepText1.innerHTML = step["step name"];
    stepName.appendChild(stepText1);
    stepDiv.appendChild(stepName);

    var stepDesc = document.createElement('div');
    stepDesc.style.width = '25%';
    stepDesc.style.margin = 'auto';
    var stepText2 = document.createElement('span');
    stepText2.style.fontSize = '15px';
    stepText2.innerHTML = step["step description"];
    stepDesc.appendChild(stepText2);
    stepDiv.appendChild(stepDesc);

    var stepStatus = document.createElement('div');
    stepStatus.style.width = '20%';
    stepStatus.style.margin = 'auto';
    var stepText3 = document.createElement('span');
    stepText3.style.fontSize = '15px';
    stepText3.innerHTML = step["status"];
    stepStatus.appendChild(stepText3);
    stepDiv.appendChild(stepStatus);

    var stepDate = document.createElement('div');
    stepDate.style.width = '20%';
    stepDate.style.margin = 'auto';
    var stepText4 = document.createElement('span');
    stepText4.style.fontSize = '15px';
    stepText4.innerHTML = step["due date"];
    stepDate.appendChild(stepText4);
    stepDiv.appendChild(stepDate);

    var stepCost = document.createElement('div');
    stepCost.style.width = '20%';
    stepCost.style.margin = 'auto';
    var stepText5 = document.createElement('span');
    stepText5.style.fontSize = '15px';
    stepText5.innerHTML = step["cost"];
    stepCost.appendChild(stepText5);
    stepDiv.appendChild(stepCost);


    return stepDiv;
}

function create_goal_element(goal){
    var goalDiv = document.createElement('div');

    var goalLabelDiv = document.createElement('div');
    goalLabelDiv.style.display = 'flex';
    goalLabelDiv.style.textAlign = 'center';

    var goalLabel = document.createElement('div');
    goalLabel.style.width = '15%';
    goalLabel.style.padding = '1%'
    var goalText1 = document.createElement('span');
    goalText1.innerHTML = goal["goal name"];
    goalLabel.appendChild(goalText1);
    goalLabelDiv.appendChild(goalLabel);

    var goalLabelDesc = document.createElement('div');
    goalLabelDesc.style.width = '25%';
    goalLabelDesc.style.padding = '1%'
    var goalText2 = document.createElement('span');
    goalText2.innerHTML = "To do";
    goalLabelDesc.appendChild(goalText2);
    goalLabelDiv.appendChild(goalLabelDesc);

    var goalLabelStatus = document.createElement('div');
    goalLabelStatus.style.width = '20%';
    goalLabelStatus.style.padding = '1%'
    var goalText3 = document.createElement('span');
    goalText3.innerHTML = "Status";
    goalLabelStatus.appendChild(goalText3);
    goalLabelDiv.appendChild(goalLabelStatus);

    var goalLabelDate = document.createElement('div');
    goalLabelDate.style.width = '20%';
    goalLabelDate.style.padding = '1%'
    var goalText4 = document.createElement('span');
    goalText4.innerHTML = "Due date";
    goalLabelDate.appendChild(goalText4);
    goalLabelDiv.appendChild(goalLabelDate);

    var goalLabelCost = document.createElement('div');
    goalLabelCost.style.width = '20%';
    goalLabelCost.style.padding = '1%'
    var goalText5 = document.createElement('span');
    goalText5.innerHTML = "Cost";
    goalLabelCost.appendChild(goalText5);
    goalLabelDiv.appendChild(goalLabelCost);
    
    goalDiv.appendChild(goalLabelDiv);
    
    for(let step of goal.steps){
        goalDiv.appendChild(create_step_element(step));    
    }

    return goalDiv;
}

function open_project(project){
    hide_elem('project-viewer');
    show_elem('opened-project');
    var data = JSON.parse(project);
    console.log(data);
    find_elem('project-title').innerHTML = data["project name"];
    find_elem('project-description').innerHTML = data["project description"];
    var goals = find_elem('project-goals');
    // Clear previous entires
    goals.innerHTML = '';
    for(let goal of data.goals){
        goals.appendChild(create_goal_element(goal));
    }

}

hide_elem('opened-project');
