var templateJson;
var templateCode;

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
        templateJson = {
            "0": {
                "label": "Please Enter Timer Duration :",
                "type": "Text",
                "id": "timer"
            },
            "1": {
                "label": "Enter Background Imager Url :",
                "type": "Image",
                "id": "imgUrl"
            },
            "2": {
                "label": "Button Redirection",
                "type": "Text",
                "id": "deeplink"
            },
            "max":2
        }
        var templateCode = "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <title>video ad</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap\" rel=\"stylesheet\">\n    <script>\n        var redirectURL = \"https://jits-clever.github.io/TestWeb/\";\n        var videoURL = \"https://shopifyctjt.s3.ap-south-1.amazonaws.com/sale.gif\";\n    </script>\n    <style>\n\n        .video-container {\n            position: relative;\n            overflow: hidden;\n            border-radius: 1.5rem;\n            margin: 1rem auto;\n            transition: all 2s ease; \n        }\n\n        .video-container img {\n            width: 100%;\n            object-fit: contain;\n            height: 250px;\n            width: 150px;\n        }\n\n        .dismiss {\n            position: absolute;\n            top: 1rem;\n            left: 1rem;\n            color: white;\n            font-size: 2rem;\n            cursor: pointer;\n        }\n\n        .small-popup {\n            width: auto; /* Adjust size as needed */\n            height: auto;\n            bottom: 10px; /* Adjust position as needed */\n            right: 10px; /* Adjust position as needed */\n            border-radius: 0.5rem;\n            position: fixed;\n            animation: slideIn 2s forwards;\n        }\n\n        @keyframes slideIn {\n            from {\n                transform: translate(100%, 100%);\n            }\n            to {\n                transform: translate(0, 0);\n            }\n        }\n\n    </style>\n</head>\n\n<body>\n    <div class=\"small-popup\" id=\"popup\">\n        \n        <div class=\"video-container\" id=\"videoContainer\">\n            <span class=\"dismiss\" onclick=\"closePopup()\">✕</span>\n        </div>\n    </div>\n\n    <script>\n        var video = document.getElementById('videoContainer');\n        var source = document.createElement('img');\n\n        source.setAttribute('src', videoURL);\n        source.setAttribute('id', 'myVideo');\n\n        video.appendChild(source);\n        document.addEventListener(\"DOMContentLoaded\", function () {\n\n            const videoTag = document.getElementById('myVideo');\n            videoTag.addEventListener(\"click\",function (){\n                window.location.href = redirectURL;\n            })\n        });\n        function closePopup() {\n            popup.style.display = \"none\"; // Hide the popup\n        }\n    </script>\n</body>\n\n</html>"
        
        startLoader()
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