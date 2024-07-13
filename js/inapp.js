var templateJson;
var templateCode;
var selectedTemplateName;
var formValues={};
function startLoader() {
    var bodyTag = document.querySelector('body');
    bodyTag.classList.add('blurbg');
    var loaderDiv = document.createElement("div");
    loaderDiv.setAttribute("class", "loader");
    loaderDiv.setAttribute("id","processing");
    bodyTag.appendChild(loaderDiv);
    
}
document.getElementById("templateType").querySelectorAll('.dropdown-item').forEach( function(el) {
            
    el.addEventListener('click', function() {
        document.querySelector('.dropdown-toggle').innerText = el.textContent;
        selectedTemplateName='Disappearing Inapp'
        // startLoader()
        fetchData(selectedTemplateName)
        // var tempcode=fetchData.templateJson;
        // console.log(templateJson)
        // builder()
    });
});

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


    // console.log(templateJson.html_content)

    for (let i = 0; i <= maxFeilds; i++) {
        const field = fields[i];
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group mb-3';
        // console.log(field.description);

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        console.log(field.replace)

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
        console.log(templateCode)
        formBuilder();
    
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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
        const field = fields[i];
        const replaceText = field.replace;
        const replaceBy = formValues[field.id] || '';
        if(field.id=='timer'){
            var rewrite="progress "+replaceBy+"s linear forwards;"
            console.log("value of time"+replaceBy)
            templateCode = templateCode.replace(replaceText, rewrite);   

        }
        else{
            templateCode = templateCode.replace(replaceText, replaceBy);   
        }
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