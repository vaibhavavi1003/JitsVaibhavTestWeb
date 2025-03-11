var templateJson;
var templateCode;
var selectedTemplateName;
var formValues = {};
var dynamicValues = {};

// Directly add new template names in this array
const templates = [

    { id: "e1", name: "Disappearing Inapp", function: fetchData },
    { id: "e2", name: "Footer Survey", function: fetchData },
    { id: "e3", name: "Footer Survey (Multiple)", function: fetchData },
    { id: "e4", name: "Video Gif", function: fetchData },
    { id: "e5", name: "Image Carousel", function: fetchData },
    { id: "e6", name: "Feedback Rating with PlayStore", function: fetchData },
    { id: "e7", name: "Dynamic PIP", function: fetchData },
    { id: "e8", name: "Stories V1", function: fetchData },
    { id: "e9", name: "Stories V2", function: fetchData },
    { id: "e10", name: "Scratch Card", function: fetchData },
    { id: "e11", name: "Copy Coupon Code", function: fetchData }
];

// Start the loading screen
function startLoader() {
  var bodyTag = document.querySelector("body");
  bodyTag.classList.add("blurbg");
  var loaderDiv = document.createElement("div");
  loaderDiv.setAttribute("class", "loader");
  loaderDiv.setAttribute("id", "processing");
  bodyTag.appendChild(loaderDiv);
  // No need to add any inner HTML for the new loader as it uses ::before and ::after
}

function hideLoader() {
  var loaderDiv = document.getElementById("processing");
  if (loaderDiv) {
    loaderDiv.remove(); // Remove the loader div from the DOM
  }

  var bodyTag = document.querySelector("body");
  bodyTag.classList.remove("blurbg"); // Remove the blurbg class from the body
}

function populateDropdown() {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  dropdownMenu.innerHTML = "";

  templates.forEach((template) => {
    const listItem = document.createElement("li");
    listItem.className = "dropdown-item";
    listItem.id = template.id;
    listItem.textContent = template.name;
    listItem.addEventListener("click", () => {
      document.querySelector(".dropdown-toggle").innerText = template.name;
      selectedTemplateName = template.name;
      template.function(selectedTemplateName);
    });
    dropdownMenu.appendChild(listItem);
  });
}
populateDropdown();

// function templateChange(templateName, templateJson) {
//   try {
//     switch (templateName) {
//       case "Disappearing Inapp":
//         DA();
//         break;

//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

function formBuilder() {
  const form = document.getElementById("dynamicContent");
  form.innerHTML = "";

  // Process static fields first (legacy support)
  if (templateJson.json_content) {
    var maxFields = templateJson.json_content.max;
    var fields = templateJson.json_content;
    for (let i = 0; i <= maxFields; i++) {
      const field = fields[i];
      if (!field) continue;

      createFormField(field, form);
    }
  }

  // Process dynamic content if available
  if (templateJson.json_content.dynamicContent) {
    processDynamicContent(templateJson.json_content.dynamicContent, form);
  }
}

function createFormField(field, parentElement, prefix = "") {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group mb-3";

  const label = document.createElement("label");
  const fieldId = prefix ? `${prefix}.${field.id}` : field.id;
  label.setAttribute("for", fieldId);
  label.textContent = field.label;
  formGroup.appendChild(label);

  let input;

  switch (field.type) {
    case "Text":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("id", fieldId);
      input.value = field.default || "";
      formGroup.appendChild(input);
      break;

    case "Number":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("type", "number");
      input.setAttribute("id", fieldId);
      input.value = field.default || 0;
      formGroup.appendChild(input);
      break;

    case "Checkbox":
      input = document.createElement("input");
      input.className = "form-check-input ms-2";
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", fieldId);
      if (field.default === true) {
        input.checked = true;
      }
      formGroup.appendChild(input);
      break;

    case "Select":
      input = document.createElement("select");
      input.className = "form-control";
      input.setAttribute("id", fieldId);

      if (field.options && Array.isArray(field.options)) {
        field.options.forEach((option) => {
          const optionEl = document.createElement("option");
          optionEl.value = option;
          optionEl.textContent = option;
          if (field.default === option) {
            optionEl.selected = true;
          }
          input.appendChild(optionEl);
        });
      }
      formGroup.appendChild(input);
      break;

    case "Image":
      input = document.createElement("input");
      input.className = "form-control";
      input.setAttribute("id", fieldId);
      input.value = field.default || "";
      formGroup.appendChild(input);

      const description = document.createElement("p");
      description.className = "form-text mt-2";
      description.textContent = field.description || "";
      formGroup.appendChild(description);
      break;

    case "ColorPicker":
      input = document.createElement("input");
      input.className = "col-sm-1 col-form-label";
      input.setAttribute("type", "color");
      input.setAttribute("id", fieldId);
      input.value = field.default || "#000000";
      formGroup.appendChild(input);

      const colorDesc = document.createElement("p");
      colorDesc.className = "form-text mt-2";
      colorDesc.textContent = field.description || "";
      formGroup.appendChild(colorDesc);
      break;

    case "DynamicArray":
      const arrayContainer = document.createElement("div");
      arrayContainer.className = "dynamic-array-container mb-2";
      arrayContainer.id = `${fieldId}-container`;

      // Initial items from default
      const defaultItems = field.default || [""];
      defaultItems.forEach((value, index) => {
        const itemWrapper = document.createElement("div");
        itemWrapper.className = "d-flex mb-2";

        const itemInput = document.createElement("input");
        itemInput.className = "form-control me-2";
        itemInput.setAttribute("type", "text");
        itemInput.setAttribute("id", `${fieldId}[${index}]`);
        itemInput.value = value;
        itemWrapper.appendChild(itemInput);

        if (index > 0 || defaultItems.length > 1) {
          const removeBtn = document.createElement("button");
          removeBtn.className = "btn btn-danger";
          removeBtn.textContent = "✕";
          removeBtn.onclick = function () {
            itemWrapper.remove();
          };
          itemWrapper.appendChild(removeBtn);
        }

        arrayContainer.appendChild(itemWrapper);
      });

      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-secondary mt-2";
      addBtn.textContent = "Add Item";
      addBtn.onclick = function () {
        if (arrayContainer.children.length >= field.maxItems) {
          alert(`Maximum ${field.maxItems} items allowed`);
          return;
        }

        const index = arrayContainer.children.length;
        const itemWrapper = document.createElement("div");
        itemWrapper.className = "d-flex mb-2";

        const itemInput = document.createElement("input");
        itemInput.className = "form-control me-2";
        itemInput.setAttribute("type", "text");
        itemInput.setAttribute("id", `${fieldId}[${index}]`);
        itemWrapper.appendChild(itemInput);

        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-danger";
        removeBtn.textContent = "✕";
        removeBtn.onclick = function () {
          itemWrapper.remove();
        };
        itemWrapper.appendChild(removeBtn);

        arrayContainer.appendChild(itemWrapper);
      };

      formGroup.appendChild(arrayContainer);
      formGroup.appendChild(addBtn);
      break;
  }

  if (
    field.description &&
    !["Image", "ColorPicker", "DynamicArray"].includes(field.type)
  ) {
    const description = document.createElement("p");
    description.className = "form-text mt-2";
    description.textContent = field.description;
    formGroup.appendChild(description);
  }

  parentElement.appendChild(formGroup);
}

let arrayTabsInfo = {};

function processDynamicContent(dynamicContent, form) {
  if (!dynamicContent || !Array.isArray(dynamicContent)) return;

  // Create tab container structure
  const tabContainer = document.createElement("div");
  tabContainer.className = "dynamic-content-tabs mb-4";

  // Create nav tabs with proper Bootstrap classes
  const tabNav = document.createElement("ul");
  tabNav.className = "nav nav-tabs mb-0";
  tabNav.setAttribute("role", "tablist");
  tabNav.id = "dynamicContentTabs";

  // Create tab content container
  const tabContent = document.createElement("div");
  tabContent.className = "tab-content p-3 border border-top-0 rounded-bottom";
  tabContent.id = "dynamicContentTabContent";

  // Initialize arrayTabsInfo as empty object
  arrayTabsInfo = {};

  // Process each content section as a tab
  dynamicContent.forEach((content, index) => {
    if (content.type === "array" || content.type === "survey") {
      // For array/survey types, create initial tab and track for adding more items later
      arrayTabsInfo[content.variableName] = {
        config: content,
        count: 1, // Start with 1 item
        maxItems: content.maxItems || 10,
        tabs: [] // Track tab IDs for better management
      };

      // Create the first item tab
      createDynamicContentTab(tabNav, tabContent, {
        id: `${content.variableName}-0`,
        title: `${content.variableName} 1`,
        isActive: index === 0,
        content: content,
        itemIndex: 0,
      });
      
      // Track the tab
      arrayTabsInfo[content.variableName].tabs.push(`${content.variableName}-0`);
    } else {
      // For non-array types (like config), create a single tab
      createDynamicContentTab(tabNav, tabContent, {
        id: content.variableName,
        title: content.variableName,
        isActive: index === 0,
        content: content,
      });
    }
  });

  // Add "Add Item" buttons for array type tabs
  for (const [tabName, info] of Object.entries(arrayTabsInfo)) {
    const addButtonLi = document.createElement("li");
    addButtonLi.className = "nav-item add-tab-button ms-2";

    const addButton = document.createElement("button");
    addButton.className = "btn btn-sm btn-success rounded-circle nav-add-btn";
    addButton.innerHTML = "<span>+</span>";
    addButton.title = `Add ${tabName} Item`;

    addButton.onclick = function () {
      if (info.count >= info.maxItems) {
        alert(`Maximum ${info.maxItems} items allowed for ${tabName}`);
        return;
      }

      // Create a new tab for this array item
      const newIndex = info.count;
      const tabId = `${tabName}-${newIndex}`;

      createDynamicContentTab(tabNav, tabContent, {
        id: tabId,
        title: `${tabName} ${newIndex + 1}`,
        isActive: false,
        content: info.config,
        itemIndex: newIndex,
        removable: true,
        parentInfo: info // Pass parent info for better tab management
      });

      // Track the new tab
      info.tabs.push(tabId);

      // Place the add button at the end again
      tabNav.appendChild(addButtonLi);

      // Activate the new tab
      const newTabButton = document.querySelector(`#tab-${tabId}-tab`);
      if (newTabButton) {
        const bsTab = new bootstrap.Tab(newTabButton);
        bsTab.show();
      }

      info.count++;
    };

    addButtonLi.appendChild(addButton);
    tabNav.appendChild(addButtonLi);
  }

  // Assemble the tab structure
  tabContainer.appendChild(tabNav);
  tabContainer.appendChild(tabContent);

  // Add a section title for dynamic content
  const dynamicContentHeader = document.createElement("h3");
  dynamicContentHeader.className = "mt-4 mb-3";
  dynamicContentHeader.textContent = "Dynamic Content";
  form.appendChild(dynamicContentHeader);

  // Add the tab container to the form
  form.appendChild(tabContainer);

  // Initialize all tabs with proper Bootstrap functionality
  const tabEls = tabNav.querySelectorAll('button[data-bs-toggle="tab"]');
  tabEls.forEach((tabEl) => {
    tabEl.addEventListener("click", function (event) {
      event.preventDefault();
      const bsTab = new bootstrap.Tab(tabEl);
      bsTab.show();
    });
  });
}


function createDynamicContentTab(tabNav, tabContent, options) {
    const { id, title, isActive, content, itemIndex, removable, parentInfo } = options;
  
    const tabId = `tab-${id}`;
  
    // Create tab nav item
    const tabNavItem = document.createElement("li");
    tabNavItem.className = "nav-item";
    tabNavItem.setAttribute("role", "presentation");
    tabNavItem.id = `nav-item-${id}`;
  
    // Create the tab button with properly styled text
    const tabButtonLink = document.createElement("button");
    tabButtonLink.className = `nav-link ${isActive ? "active" : ""}`;
    tabButtonLink.id = `${tabId}-tab`;
    tabButtonLink.setAttribute("data-bs-toggle", "tab");
    tabButtonLink.setAttribute("data-bs-target", `#${tabId}`);
    tabButtonLink.setAttribute("type", "button");
    tabButtonLink.setAttribute("role", "tab");
    tabButtonLink.setAttribute("aria-controls", tabId);
    tabButtonLink.setAttribute("aria-selected", isActive ? "true" : "false");
    tabButtonLink.textContent = title;
  
    // Add remove button if tab is removable
    if (removable) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-danger btn-sm remove-tab-btn";
      // removeBtn.innerHTML = "×";
      removeBtn.title = `Remove ${title}`;
      removeBtn.setAttribute("aria-label", `Remove ${title}`);
      removeBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
  
        // Get the variable name from the ID (format: variableName-index)
        const dashIndex = id.indexOf('-');
        const variableName = id.substring(0, dashIndex);
        
        // Find the next tab to activate
        const allTabs = tabNav.querySelectorAll('.nav-link');
        let nextTab = null;
  
        // Find current tab index and the next tab to activate
        for (let i = 0; i < allTabs.length; i++) {
          if (allTabs[i] === tabButtonLink) {
            if (i > 0) nextTab = allTabs[i - 1]; // Previous tab if available
            else if (allTabs[i + 1]) nextTab = allTabs[i + 1]; // Next tab if available
            break;
          }
        }
  
        // Remove from tracking
        if (arrayTabsInfo[variableName]) {
          // Remove the tab ID from the tabs array
          const tabIndex = arrayTabsInfo[variableName].tabs.indexOf(id);
          if (tabIndex !== -1) {
            arrayTabsInfo[variableName].tabs.splice(tabIndex, 1);
          }
          
          // Important: Decrease the count when removing a tab
          arrayTabsInfo[variableName].count = Math.max(1, arrayTabsInfo[variableName].count - 1);
          
          // Update the UI to show the new count
          console.log(`${variableName} count decreased to ${arrayTabsInfo[variableName].count}`);
        }
  
        // Remove tab content and nav item
        const tabContentPane = document.getElementById(tabId);
        if (tabContentPane) tabContentPane.remove();
        
        tabNavItem.remove();
  
        // Activate another tab if found
        if (nextTab) {
          const bsTab = new bootstrap.Tab(nextTab);
          bsTab.show();
        }
      };
  
      tabButtonLink.appendChild(removeBtn);
    }
  
    tabNavItem.appendChild(tabButtonLink);
    tabNav.appendChild(tabNavItem);
  
    // Create tab pane
    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane fade ${isActive ? "show active" : ""}`;
    tabPane.id = tabId;
    tabPane.setAttribute("role", "tabpanel");
    tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);
  
    // Create content inside tab pane
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "dynamic-section";
  
    switch (content.type) {
      case "config":
        // Add a title for the config section
        const configTitle = document.createElement("h4");
        configTitle.className = "mb-3 text-dark";
        configTitle.textContent = "Configuration Settings";
        sectionContainer.appendChild(configTitle);
  
        content.fields.forEach((field) => {
          createFormField(field, sectionContainer, content.variableName);
        });
        break;
  
      case "array":
      case "survey":
        // For array/survey items, we render a single item's fields
        if (itemIndex !== undefined) {
          // Create a container for this specific array item
          const itemContainer = document.createElement("div");
          itemContainer.id = `${content.variableName}-item-${itemIndex}`;
          itemContainer.className = "array-item";
  
          // Add a title for the item
          const itemTitle = document.createElement("h4");
          itemTitle.className = "mb-3 text-dark";
          itemTitle.textContent =
            content.type === "survey"
              ? `Question ${itemIndex + 1}`
              : `${content.variableName} Item ${itemIndex + 1}`;
          itemContainer.appendChild(itemTitle);
  
          // Render the fields for this array item
          content.itemTemplate.fields.forEach((field) => {
            createFormField(
              field,
              itemContainer,
              `${content.variableName}[${itemIndex}]`
            );
          });
  
          sectionContainer.appendChild(itemContainer);
        }
        break;
    }
  
    tabPane.appendChild(sectionContainer);
    tabContent.appendChild(tabPane);
  
    return tabNavItem;
  }

function addDynamicItem(contentConfig, index, container) {
  const itemId = `${contentConfig.variableName}-item-${index}`;
  const itemDiv = document.createElement("div");
  itemDiv.className = "dynamic-item border-bottom pb-3 pt-3";
  itemDiv.id = itemId;

  // Item header with remove button
  const itemHeader = document.createElement("div");
  itemHeader.className =
    "d-flex justify-content-between align-items-center mb-3";

  const itemTitle = document.createElement("h5");
  itemTitle.textContent =
    contentConfig.type === "survey"
      ? `Question ${index + 1}`
      : `Item ${index + 1}`;
  itemHeader.appendChild(itemTitle);

  if (
    index > 0 ||
    document.querySelectorAll(`[id^="${contentConfig.variableName}-item-"]`)
      .length > 0
  ) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-danger";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = function () {
      itemDiv.remove();
    };
    itemHeader.appendChild(removeBtn);
  }

  itemDiv.appendChild(itemHeader);

  // Add fields
  contentConfig.itemTemplate.fields.forEach((field) => {
    createFormField(field, itemDiv, `${contentConfig.variableName}[${index}]`);
  });

  container.appendChild(itemDiv);
}

function fetchFormData() {
  // Get static form values
  const form = document.getElementById("dynamicContent");
  const staticInputs = form.querySelectorAll(
    'input:not([id*="["]):not([id*="."]), select:not([id*="["]):not([id*="."])'
  );

  formValues = {};
  staticInputs.forEach((input) => {
    if (input.type === "checkbox") {
      formValues[input.id] = input.checked;
    } else {
      formValues[input.id] = input.value;
    }
  });

  // Process dynamic content
  dynamicValues = {};
  if (templateJson.json_content.dynamicContent) {
    processDynamicFormData(templateJson.json_content.dynamicContent);
  }

  console.log("Static values:", formValues);
  console.log("Dynamic values:", dynamicValues);

  codeBuilder();
}

function processDynamicFormData(dynamicContent) {
  if (!dynamicContent || !Array.isArray(dynamicContent)) return;

  dynamicContent.forEach((content) => {
    const variableName = content.variableName;

    switch (content.type) {
      case "config":
        dynamicValues[variableName] = {};
        content.fields.forEach((field) => {
          const inputId = `${variableName}.${field.id}`;
          const input = document.getElementById(inputId);
          if (input) {
            if (input.type === "checkbox") {
              dynamicValues[variableName][field.id] = input.checked;
            } else if (input.type === "number") {
              dynamicValues[variableName][field.id] = parseFloat(input.value);
            } else {
              dynamicValues[variableName][field.id] = input.value;
            }
          }
        });
        break;

      case "array":
      case "survey":
        dynamicValues[variableName] = [];
        const itemContainers = document.querySelectorAll(
          `[id^="${variableName}-item-"]`
        );

        itemContainers.forEach((container, index) => {
          const itemData = {};

          content.itemTemplate.fields.forEach((field) => {
            if (field.type === "DynamicArray") {
              // Handle dynamic arrays (e.g., answers in a survey question)
              const arrayInputs = document.querySelectorAll(
                `[id^="${variableName}[${index}].${field.id}["]`
              );
              const arrayValues = [];

              arrayInputs.forEach((input) => {
                if (input.value.trim()) {
                  arrayValues.push(input.value.trim());
                }
              });

              itemData[field.id] = arrayValues;
            } else {
              const inputId = `${variableName}[${index}].${field.id}`;
              const input = document.getElementById(inputId);
              if (input) {
                if (input.type === "checkbox") {
                  itemData[field.id] = input.checked;
                } else if (input.type === "number") {
                  itemData[field.id] = parseFloat(input.value);
                } else {
                  itemData[field.id] = input.value;
                }
              }
            }
          });

          dynamicValues[variableName].push(itemData);
        });
        break;
    }
  });
}

async function fetchData(templateName) {
  const url = `https://v5ffl5exja.execute-api.ap-south-1.amazonaws.com/prod?inappTemplate=${templateName}`;
  try {
    startLoader();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error in response");
    }

    templateJson = await response.json();
    templateCode = templateJson.html_content;
    //Preview the template
    if (!templateJson.json_content.dynamicContent) {
      loadIframe(templateCode);
    }else if (templateJson.json_content.sample) {
      // For dynamic templates with sample data, process and preview
      loadDynamicPreview();
    } 
    formBuilder();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    hideLoader();
  }
}

function copyCode() {
  const codeBlock = document.getElementById("codeBlock");
  navigator.clipboard
    .writeText(codeBlock.value)
    .then(() => {
      alert("Code copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function loadDynamicPreview() {
  // Get sample data from the template
  const sampleValues = templateJson.json_content.sample;
  
  // Call codeBuilder in preview mode with sample data
  codeBuilder(true, sampleValues);
}

function loadIframe(template) {
  // Get reference to the existing iframe
  const iframe = document.getElementById("codeIframe");
  
  // Create a unique name to prevent caching issues
  const uniqueName = 'iframe_' + Date.now();
  
  // Create a new iframe element
  const newIframe = document.createElement('iframe');
  newIframe.id = "codeIframe";
  newIframe.className = iframe.className;
  newIframe.style.cssText = iframe.style.cssText;
  
  // Replace the old iframe with the new one
  iframe.parentNode.replaceChild(newIframe, iframe);
  
  // Write content to the new iframe
  const iframeDoc = newIframe.contentDocument || newIframe.contentWindow.document;
  
  if (template) {
    iframeDoc.open();
    iframeDoc.write(template);
    iframeDoc.close();
  } else {
    // Otherwise use what's in the code block
    const codeBlock = document.getElementById("codeBlock");
    iframeDoc.open();
    iframeDoc.write(codeBlock.value);
    iframeDoc.close();
  }
}

function codeBuilder(isPreview = false, previewData = null) {
  let processedCode = templateCode;

  const dynamicDataToUse = isPreview ? previewData : dynamicValues;
  // Process static replacements (legacy support)
  if (templateJson.json_content) {
    var maxFields = templateJson.json_content.max;
    var fields = templateJson.json_content;

    for (let i = 0; i <= maxFields; i++) {
      var field = fields[i];
      if (!field) continue;

      var replaceText = field.replace;
      var replaceBy = formValues[field.id] || "";
      var replaceval = field.replaceVal;

      if (replaceval !== undefined) {
        replaceBy = replaceText.replace(replaceval, replaceBy);
      }
      processedCode = processedCode.replace(replaceText, replaceBy);
    }
  }

  // Process dynamic content
  if (dynamicDataToUse && Object.keys(dynamicDataToUse).length > 0) {
    for (const [variableName, value] of Object.entries(dynamicDataToUse)) {
      // Create a placeholder pattern that matches {{variableName}}
      const placeholderPattern = new RegExp(`\\{\\{${variableName}\\}\\}`, "g");

      // Replace all instances with the stringified value
      const jsonValue = JSON.stringify(value, null, 2);
      processedCode = processedCode.replace(placeholderPattern, jsonValue);
    }

    // Also add the variables as JavaScript declarations for any script that needs them
    let dynamicJsCode = "";
    for (const [variableName, value] of Object.entries(dynamicDataToUse)) {
      dynamicJsCode += `const ${variableName} = ${JSON.stringify(
        value,
        null,
        2
      )};\n\n`;
    }

    // Insert the declarations if there are no placeholders or for additional scripts
    const headClosePoint = processedCode.indexOf("</head>");
    if (headClosePoint !== -1) {
      processedCode =
        processedCode.slice(0, headClosePoint) +
        "\n<script>\n// Dynamic content configuration\n" +
        dynamicJsCode +
        "</script>\n" +
        processedCode.slice(headClosePoint);
    }
  }

  if (!isPreview) {
    const codeBlock = document.getElementById("codeBlock");
    codeBlock.value = processedCode;
  }
  loadIframe(processedCode);
}
