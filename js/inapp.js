var templateJson;
var templateCode;
var selectedTemplateName;
var formValues={};

//Direclty add new template name in this array
const templates = [
    { id: 'e1', name: 'Disappearing Inapp', function: fetchData },
    { id: 'e2', name: 'Footer Survey', function: fetchData },
    { id: 'e3', name: 'Video Gif', function: fetchData },
    { id: 'e4', name: 'Image Carousel', function: fetchData },
    { id: 'e5', name: 'Feedback Rating with PlayStore', function: fetchData },
    { id: 'e4', name: 'Dynamic PIP', function: fetchData }
];

function startLoader() {
    var bodyTag = document.querySelector('body');
    bodyTag.classList.add('blurbg');
    var loaderDiv = document.createElement("div");
    loaderDiv.setAttribute("class", "loader");
    loaderDiv.setAttribute("id","processing");
    bodyTag.appendChild(loaderDiv);
}
function hideLoader() {
    var loaderDiv = document.getElementById("processing");
    if (loaderDiv) {
        loaderDiv.remove(); // Remove the loader div from the DOM
    }

    var bodyTag = document.querySelector('body');
    bodyTag.classList.remove('blurbg'); // Remove the blurbg class from the body
}

function populateDropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.innerHTML = ''; 

    templates.forEach(template => {
        const listItem = document.createElement('li');
        listItem.className = 'dropdown-item';
        listItem.id = template.id;
        listItem.textContent = template.name;
        listItem.addEventListener('click', () => {
            document.querySelector('.dropdown-toggle').innerText = template.name;
            selectedTemplateName = template.name;
            template.function(selectedTemplateName);
        });
        dropdownMenu.appendChild(listItem);
    });
}
populateDropdown();

function templateChange(templateName,templateJson) {
    try {
        switch (templateName) {
            case "Disappearing Inapp":
                DA()
                break;
        
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

function formBuilder() {
    const form = document.getElementById('dynamicContent');
    form.innerHTML = '';
    var maxFeilds = templateJson.json_content.max;
    var fields = templateJson.json_content;
    for (let i = 0; i <= maxFeilds; i++) {
        const field = fields[i];
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group mb-3';

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);

        let input;
        if (field.type == 'Text') {
            input = document.createElement('input');
            input.className = 'form-control';
            input.setAttribute('id', field.id);
            formGroup.appendChild(input);
            
        } else if (field.type == 'Image') {
            input = document.createElement('input');
            input.className = 'form-control';
            input.setAttribute('id', field.id);
            formGroup.appendChild(input);

            const description = document.createElement('p');
            description.className = 'form-text mt-2';
            description.textContent = field.description;
            formGroup.appendChild(description);
        }else if(field.type =='ColorPicker'){
            input = document.createElement('input');
            input.className = 'col-sm-1 col-form-label';
         input.setAttribute('type', 'color');
         input.setAttribute('id', field.id);
            formGroup.appendChild(input);

            const description = document.createElement('p');
    description.className = 'form-text mt-2';
    description.textContent = field.description;
    formGroup.appendChild(description);

        }

        form.appendChild(formGroup);
    }
}
function fetchFormData() {
    const form = document.getElementById('dynamicContent');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        formValues[input.id] = input.value;
    });

    console.log(formValues)
    codeBuilder()
}

async function fetchData(templateName){
    const url = `https://v5ffl5exja.execute-api.ap-south-1.amazonaws.com/prod?inappTemplate=${templateName}`;
    try {
        startLoader()
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error in response');
        }

        templateJson = await response.json();
        templateCode=templateJson.html_content
        formBuilder();
    
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
    finally{
        hideLoader();
    }
    
}

function copyCode() {
    const codeBlock = document.getElementById('codeBlock');
    navigator.clipboard.writeText(codeBlock.value)
        .then(() => {
            alert('Code copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

function loadIframe() {
    const codeBlock = document.getElementById('codeBlock').value;
    const iframe = document.getElementById('codeIframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(codeBlock);
    iframeDoc.close();
}


function codeBuilder(){
    var maxFeilds = templateJson.json_content.max;
    var fields = templateJson.json_content;
    var imageUrl=formValues.imgUrl;
    var time=formValues.timer;
    var deepLink=formValues.deeplink;
    
    for (let i = 0; i <= maxFeilds; i++) {
        var field = fields[i];
        var replaceText = field.replace;
        var replaceBy = formValues[field.id] || '';
        var replaceval=field.replaceVal;

        if(replaceval!==undefined){
            replaceBy=replaceText.replace(replaceval,replaceBy)
        }
             templateCode = templateCode.replace(replaceText, replaceBy);  
    }
 
        const codeBlock = document.getElementById('codeBlock');
        codeBlock.value=templateCode;
    navigator.clipboard.writeText(templateCode)
    .then(() => {
        console.log('Code copied to clipboard!');
    })
    .catch(err => {
        console.error('Failed to copy: ', err);
    });
}
