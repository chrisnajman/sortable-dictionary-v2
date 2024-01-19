const LOCAL_STORAGE_PREFIX = "DICTIONARY-gh"
const ENTRIES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-entries`
const SORT_BUTTONS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-sort-buttons-enabled`
const DARKMODE_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-darkmode-switch`

let entries = JSON.parse(localStorage.getItem(ENTRIES_STORAGE_KEY)) || []

// Theme
const btnThemeToggle = document.getElementById("btn-theme-toggle")
const themeSun = document.getElementById("theme-sun")
const themeMoon = document.getElementById("theme-moon")
const root = document.querySelector("html")

// Modal
const launchModalBtn = document.getElementById("launch-modal")
const modal = document.getElementById("modal")

// Form
const entriesForm = document.getElementById("entries-form")
const btnCancel = document.getElementById("cancel")

// Sort
const btnSortWordsAZ = document.getElementById("btn-sort-words-a-z")
const btnSortWordsZA = document.getElementById("btn-sort-words-z-a")
const btnSortLanguagesAZ = document.getElementById("btn-sort-languages-a-z")
const btnSortLanguagesZA = document.getElementById("btn-sort-languages-z-a")
const sortButtons = document.querySelectorAll(".sort-button")

setTheme()

entriesForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const term = document.getElementById("term").value
  const definition = document.getElementById("definition").value
  const lang = document.querySelector("[data-language-select]").value
  const language = document.getElementById("language-select").value
  const entry = {
    term,
    definition,
    lang,
    language,
    id: new Date().valueOf().toString(),
  }

  convertLangSelectToFullName(entry)
  entries.push(entry)
  updateEntriesInLocalStorage()
  hightlightFirstRow()
  resetFormCloseModal()
  checkAndUpdateSortButtons()
})

btnCancel.addEventListener("click", resetFormCloseModal)

displayTableRows(entries)

/** Sort Buttons */
btnSortWordsAZ.addEventListener("click", sortTermsAZ)
btnSortWordsZA.addEventListener("click", sortTermsZA)
btnSortLanguagesAZ.addEventListener("click", sortLangsAZ)
btnSortLanguagesZA.addEventListener("click", sortLangsZA)

// Table / Delete button
addGlobalEventListener("click", "[data-delete-row]", (e) => {
  // Remove from the screen
  const parent = e.target.closest(".table-row")
  parent.remove()

  // Remove from local storage
  const entryId = parent.dataset.entryId

  entries = entries.filter((entry) => {
    return entry.id !== entryId
  })

  updateEntriesInLocalStorage()
  checkAndUpdateSortButtons()
})

// Table / Edit word button
addGlobalEventListener("click", "[data-edit-word]", (e) => {
  e.target.textContent = e.target.textContent === "Edit" ? "Save edit" : "Edit"
  const parent = e.target.closest(".table-row")

  const text = parent.querySelector("[data-def]")
  text.toggleAttribute("contenteditable")

  const entryId = parent.dataset.entryId
  const entry = entries.find((ent) => {
    return ent.id === entryId
  })

  entry.edited = !text.hasAttribute("contenteditable")
  if (entry.edited) entry.definition = text.textContent

  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries))
})

// Table / Set language when 'Other' is chosen from language dropdown
addGlobalEventListener("click", "[data-edit-language]", (e) => {
  e.target.textContent =
    e.target.textContent === "Set language" ? "Save" : "Set language"
  const parent = e.target.closest(".table-row")

  const text = parent.querySelector("[data-lang]")
  text.toggleAttribute("contenteditable")

  const entryId = parent.dataset.entryId
  const entry = entries.find((ent) => {
    return ent.id === entryId
  })

  entry.edited = !text.hasAttribute("contenteditable")
  if (entry.edited) {
    entry.language = text.textContent
    e.target.remove()
  }

  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries))
})

/** Modal */
launchModalBtn.addEventListener("click", () => {
  modal.showModal()
})

/* modal backdrop (anything that's not the form) */
modal.addEventListener("click", (e) => {
  const formClicked = e.target.closest("form")
  if (!formClicked) {
    resetFormCloseModal()
  }
})

/** Theme */
btnThemeToggle.addEventListener("click", (e) => {
  root.classList.toggle("dark-theme")

  const isDarkMode = root.classList.contains("dark-theme")

  e.target.setAttribute("aria-pressed", String(isDarkMode))

  if (isDarkMode) {
    themeSun.classList.add("hide")
    themeMoon.classList.remove("hide")
  } else {
    themeMoon.classList.add("hide")
    themeSun.classList.remove("hide")
  }

  const sunClass = themeSun.classList.contains("hide") ? "hide" : ""
  const moonClass = themeMoon.classList.contains("hide") ? "hide" : ""

  const themeItems = [isDarkMode, sunClass, moonClass]
  localStorage.setItem(DARKMODE_STORAGE_KEY, JSON.stringify(themeItems))
})

/** Functions */
function resetFormCloseModal() {
  entriesForm.reset()
  modal.close()
}

function updateEntriesInLocalStorage() {
  setEntries(entries)
  displayTablerowsAndSetItem()

  if (entries.length >= 2) {
    localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "true")
  } else {
    localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "false")
  }
}

function setEntries(newEntries) {
  entries = newEntries
}

/* 
  Because last entry displays at the top of the table, 
  A-Z/Z-A sort order has to be reversed.
*/
function sortTermsAZ() {
  entries.sort((a, b) => {
    const termA = a.term.toLowerCase()
    const termB = b.term.toLowerCase()
    return termB.localeCompare(termA)
  })
  displayTablerowsAndSetItem()
}

function sortTermsZA() {
  entries.sort((a, b) => {
    const termA = a.term.toLowerCase()
    const termB = b.term.toLowerCase()
    return termA.localeCompare(termB)
  })
  displayTablerowsAndSetItem()
}

function sortLangsAZ() {
  entries.sort((a, b) => {
    const languageA = a.language.toLowerCase()
    const languageB = b.language.toLowerCase()
    return languageB.localeCompare(languageA)
  })
  displayTablerowsAndSetItem()
}

function sortLangsZA() {
  entries.sort((a, b) => {
    const languageA = a.language.toLowerCase()
    const languageB = b.language.toLowerCase()
    return languageA.localeCompare(languageB)
  })
  displayTablerowsAndSetItem()
}

function displayTablerowsAndSetItem() {
  displayTableRows(entries)
  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries))
  if (entries.length >= 2) {
    enableSortButton()
    localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "true")
  } else {
    disableSortButton()
    localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "false")
  }
}

// This displays last entry at the top of the table. Because of this, A-Z/Z-A sort order has to be reversed.
function displayTableRows(entries = []) {
  const tableBody = document.getElementById("table-body")
  tableBody.innerHTML = "" // Clears the table body
  const template = document.getElementById("table-row-template")

  entries.forEach((entry) => {
    const newRow = template.content.cloneNode(true)
    newRow.querySelector(".table-row").dataset.entryId = entry.id
    newRow.querySelector("[data-term]").textContent = entry.term
    newRow.querySelector("[data-term]").setAttribute("lang", entry.lang)
    newRow.querySelector("[data-def]").textContent = entry.definition
    newRow.querySelector("[data-lang]").textContent = entry.language

    const langer = newRow.querySelector("[data-lang]")

    if (langer.textContent === "Other") {
      const languageButton = document.createElement("button")
      languageButton.setAttribute("data-edit-language", "")
      languageButton.classList.add("button", "btn-edit-language")
      languageButton.textContent = "Set language"
      langer.after(languageButton)
    }

    // Append new row at the BEGINNING of the table body
    tableBody.insertBefore(newRow, tableBody.firstChild)
  })

  if (entries.length >= 2) {
    enableSortButton()
  }
}

function hightlightFirstRow() {
  if (document.querySelector(".table-row:first-child")) {
    document
      .querySelector(".table-row:first-child")
      .classList.add("latest-entry")
  }
}

function addGlobalEventListener(type, selector, callback, option = false) {
  document.addEventListener(
    type,
    (e) => {
      if (e.target.matches(selector)) callback(e)
    },
    option
  )
}

function convertLangSelectToFullName(entry) {
  switch (entry.language) {
    case "en":
      entry.language = "English"
      break
    case "fr":
      entry.language = "French"
      break
    case "de":
      entry.language = "German"
      break
    case "it":
      entry.language = "Italian"
      break
    case "la":
      entry.language = "Latin"
      break
    case "es":
      entry.language = "Spanish"
      break
    case "und":
      entry.language = "Other"
      break
    default:
      entry.language = "Not available"
  }
}

function checkAndUpdateSortButtons() {
  const numTableRows = document.querySelectorAll(".table-row").length
  if (numTableRows < 2) {
    sortButtons.forEach((button) => {
      button.setAttribute("disabled", "")
    })
  } else {
    sortButtons.forEach((button) => {
      button.removeAttribute("disabled")
    })
  }
}

function enableSortButton() {
  sortButtons.forEach((button) => {
    button.removeAttribute("disabled")
  })

  localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "true")
}

function disableSortButton() {
  sortButtons.forEach((button) => {
    button.setAttribute("disabled", "true")
  })

  localStorage.setItem(SORT_BUTTONS_STORAGE_KEY, "false")
}

function setTheme() {
  const activeTheme = JSON.parse(
    localStorage.getItem(DARKMODE_STORAGE_KEY)
  ) || [false, "", ""]

  const isDarkMode = activeTheme[0]

  if (isDarkMode) {
    root.classList.add("dark-theme")
    themeSun.classList.add("hide")
    themeMoon.classList.remove("hide")
  } else {
    root.classList.remove("dark-theme")
    themeMoon.classList.add("hide")
    themeSun.classList.remove("hide")
  }

  btnThemeToggle.setAttribute("aria-pressed", String(isDarkMode))
}

/* On page load */
const areSortButtonsEnabled = localStorage.getItem(SORT_BUTTONS_STORAGE_KEY)
if (areSortButtonsEnabled && areSortButtonsEnabled === "true") {
  enableSortButton()
} else {
  disableSortButton()
}
