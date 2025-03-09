let outputDiv = document.querySelector(".output");
let searchBtn = document.querySelector(".btn");
let inputField = document.querySelector("input");

let defaultUrl = "https://openapi.programming-hero.com/api/phones?search=13";

// Function to fetch data
async function getPhones(url) {
  let response = await fetch(url);
  let result = await response.json();
  return result.data;
}

// Function to display data
async function displayData(url, showAll = false) {
  let phones = await getPhones(url);
  console.log(phones);

  // Clear previous results
  outputDiv.innerHTML = "";

  if (phones.length === 0) {
    const message = document.createElement("h2");
    message.innerText = "Item is not available"; 
    message.style.cssText =
      "font-size: 2rem; color: #A6ADBA; text-align: center; margin-top: 20px;";
    outputDiv.appendChild(message); 
    return;
  }

  
  let fragment = document.createDocumentFragment();

  
  let displayedPhones = showAll ? phones : phones.slice(0, 12);

  displayedPhones.forEach((phone) => {
    let phoneDiv = document.createElement("div");
    phoneDiv.classList.add("phone");

    let image = document.createElement("img");
    image.classList.add("image");
    image.src = phone.image;

    let phoneName = document.createElement("h2");
    phoneName.innerText = phone.phone_name;

    let phonePara = document.createElement("p");
    phonePara.innerHTML = `There are many variations of passages of <br> available, but the majority have suffered`;

    let button = document.createElement("button");
    button.classList.add("phoneButton");
    button.innerText = "Show details";
    button.setAttribute("data-id", phone.slug); 

    phoneDiv.append(image, phoneName, phonePara, button);
    fragment.appendChild(phoneDiv);
  });

  outputDiv.appendChild(fragment); 

  
  let showAllContainer = document.createElement("div");
  showAllContainer.classList.add("showAllContainer");

  if (phones.length > 12 && !showAll) {
    let showAllButton = document.createElement("button");
    showAllButton.classList.add("phoneButton");
    showAllButton.innerText = "Show All";
    showAllButton.addEventListener("click", () => {
      displayData(url, true); 
    });
    showAllContainer.appendChild(showAllButton);
    outputDiv.appendChild(showAllContainer);
  }
}


async function loadDefaultPhones() {
  await displayData(defaultUrl);
}
loadDefaultPhones();


searchBtn.addEventListener("click", async (event) => {
  event.preventDefault(); 
  let input = inputField.value.trim();
  console.log(input);
  if (input === "") {
    alert("Please enter a phone name!");
    return;
  }

  let url = `https://openapi.programming-hero.com/api/phones?search=${input}`;
  await displayData(url);
});

outputDiv.addEventListener("click", async (event) => {
  if (event.target.classList.contains("phoneButton")) {
    const phoneId = event.target.getAttribute("data-id"); 
    await showPhoneDetails(phoneId); 
  }
});

async function showPhoneDetails(id) {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phone/${id}`
  );
  const data = await response.json();
  const details = data.data;

  
  document.getElementById(
    "imgContainer"
  ).innerHTML = `<img src="${details.image}" alt="">`;
  document.getElementById("detailsPhoneName").innerText = details.name;
  document.getElementById("detailsBrand").innerText = `Brand: ${details.brand}`;
  document.getElementById("detailsSpec").innerHTML = `
    <strong>Chipset:</strong> ${details.mainFeatures.chipSet} <br>
    <strong>Display Size:</strong> ${details.mainFeatures.displaySize} <br>
    <strong>Storage:</strong> ${details.mainFeatures.storage} <br>
    <strong>Memory:</strong> ${details.mainFeatures.memory} <br>
    <strong>Sensors:</strong> ${details.mainFeatures.sensors.join(", ")}
`;

  document.getElementById("releaseDate").innerText =
    details.releaseDate || "No release date available";

 
  document.getElementById("my_modal").style.display = "block";
}

const modal = document.getElementById("my_modal");
const closeModal = document.querySelector(".close");

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden"); 
  setTimeout(() => {
    modal.style.display = "none";
    modal.classList.remove("hidden"); 
  }, 300);
});
