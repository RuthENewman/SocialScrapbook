const addButton = document.querySelector('#add-button');
const mainDiv = document.querySelector('#main_div');
const experienceCardsDiv = document.querySelector('.experience_cards');
const experienceNameInput = document.querySelector('#experience_name');
const experienceDateInput = document.querySelector('#experience_date');
const experienceMediaURLInput = document.querySelector('#experience_media_link');
const experienceCategoryInput = document.querySelector('#experience_category');
const experienceCommentInput = document.querySelector('#experience_comment');
const form = document.querySelector('form');
const media_type = document.querySelector('#media_type');

const state = {
  experiences: [],
  selectedExperience: null
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const experienceData = getExperienceData();
  addAnExperience(experienceData)
  createAnExperience(experienceData)
  form.reset()
})

function getExperienceData() {
  if (media_type.value == 'image') {
    return { name: experienceNameInput.value,
      date: experienceDateInput.value,
      media_type: media_type.value,
      media_url: experienceMediaURLInput.value,
      category: experienceCategoryInput.value,
      comment: experienceCommentInput.value
    };
  } else if (media_type.value == 'youtube video') {
    let video_code = experienceMediaURLInput.value.split('=')[1]
    let youtube_url = `https://www.youtube.com/embed/${video_code}`;
    return { name: experienceNameInput.value,
      date: experienceDateInput.value,
      media_type: media_type.value,
      media_url: youtube_url,
      category: experienceCategoryInput.value,
      comment: experienceCommentInput.value,
  }
}
}

function addAnExperience(experienceDataObject) {
  const eventDiv = document.createElement('div');
  eventDiv.className = 'experience_card';
  eventDiv.dataset.id = experienceDataObject.id;
  const dateObject = new Date(experienceDataObject.date);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const humanReadableDate = dateObject.toLocaleDateString('en-GB', dateOptions);
  eventDiv.innerHTML = `
    <div class="experience_details">
    <h3>${experienceDataObject.name}</h3>
    <p>${humanReadableDate}</p>
    <p>${experienceDataObject.category}</p>
    <p>${experienceDataObject.comment}</p>
    </div>
    <div class="experience_media"></div>
    <div class="experience_buttons">
    <button class="edit-button" data-id="${experienceDataObject.id}">Edit</button>
    <button class="delete-button" data-id="${experienceDataObject.id}">Delete</button>
    </div>
    </div>`;

    const mediaDiv = eventDiv.querySelector('.experience_media');
    if (experienceDataObject.media_type == 'image') {
        mediaDiv.innerHTML = `
        <img src="${experienceDataObject.media_url}" class="resize" alt="${experienceDataObject.name}" />
      `;
    } else if (experienceDataObject.media_type == 'youtube video') {
      const video_code = experienceDataObject.media_url.split('=')[1]
      mediaDiv.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${video_code}"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      >
      </iframe>
      `;
    }

    experienceCardsDiv.appendChild(eventDiv)

}

// event listener for edit button

// function clickToEdit() {
  document.addEventListener('click', event => {
    if (event.target.className === 'edit-button') {
      const foundExperience = state.experiences.find(experience => experience.id == parseInt(event.target.dataset.id))
      debugger
      experienceNameInput.value = foundExperience.name;
      experienceDateInput.value = foundExperience.date.split("T")[0];
      media_type.value = foundExperience.media_type;
      experienceMediaURLInput.value = foundExperience.media_url;
      experienceCategoryInput.value = foundExperience.category;
      experienceCommentInput.value = foundExperience.comment;

      state.selectedExperience = foundExperience;
  }
    // editExperience()
})

// }

function editExperience() {
  form.addEventListener('submit', event => {
    state.selectedExperience.name = experienceNameInput.value;
    state.selectedExperience.date = experienceDateInput.value;
    state.selectedExperience.media_url = experienceMediaURLInput.value;
    state.selectedExperience.category = experienceCategoryInput.value;
    state.selectedExperience.comment = experienceCommentInput.value;
    event.preventDefault();
    updateExperience()
      .then(initialize);
  })
}

// function clickToDelete() {
  document.addEventListener('click', event => {
    if (event.target.className === 'delete-button') {
      const foundExperience = state.experiences.find(experience => experience.id == parseInt(event.target.dataset.id))
      state.selectedExperience = foundExperience;
      deleteExperience()
        .then(initialize)
    }
  })
// }

// initializer
function initialize() {
  getExperiences()
    .then(experiences => {
      // do I need to add something to reset (e.g. innerHTML of the div equal to an empty string?)
      experienceCardsDiv.innerHTML = '';
      state.experiences = experiences;
      state.experiences.forEach(experience => addAnExperience(experience))
    })
    // clickToEdit();
    // clickToDelete();
}

// server stuff

function getExperiences() {
  return fetch('http://localhost:3000/experiences')
    .then(resp => resp.json())
}

function createAnExperience(experienceData) {
  state.experiences.push({name: experienceData.name, date: experienceData.date, media_type: experienceData.media_type, media_url: experienceData.media_url, category: experienceData.category, comment: experienceData.comment})
  return fetch('http://localhost:3000/experiences', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
    body: JSON.stringify(experienceData)
  }).then(resp => resp.json())
    .then(initialize)
}

function updateExperience() {
  const experience = state.selectedExperience;

  return fetch(`http://localhost:3000/experiences/${experience.id}`, {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: experience.name,
      date: experience.date,
      media_type: experience.media_type,
      media_url: experience.media_url,
      category: experience.category,
      comment: experience.comment
    })
  }).then(resp => resp.json())
}

function deleteExperience() {
  const experience = state.selectedExperience;
  return fetch(`http://localhost:3000/experiences/${experience.id}`, {
    method: "DELETE"
  }).then(response => response.json())
}

initialize();
