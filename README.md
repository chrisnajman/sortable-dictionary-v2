# Sortable Dictionary (V2)

## Description

I'm always looking up words, in several languages, so I decided to build my own sortable dictionary.

Note: the page doesn't break when viewed on a mobile, but I'd recommend using tablet or desktop for the best experience.

This build features enhancements and modifications to my previous [sortable dictionary](https://github.com/chrisnajman/sortable-dictionary) project.

### How it works

#### Adding an entry

- Add a word or phrase (required) to the modal dialog form.
  - All language characters and accents are allowed, together with hyphens and single apostrophes.
    - Special characters are not allowed.
  - Clicking 'Cancel' will close the form and modal.
- Select a language (optional):
  - If the form is submitted without selecting a language, the default language (English) will be printed to the table row.
  - If the language is not available, you can select "Other". This can be edited after the form is submitted.
- Add a definition (optional). This can be added (or edited) after the form is submitted.

#### Editing/sorting/deleting an entry

Once the form has been submitted, a new table row is generated.

Note: usually, new table rows go to the bottom of the table. For ease of use in this project, the newly-generated entry appears at the top. To signal this, the new entry is briefly highlighted.

- Either the word/phrase or language can be sorted (a-z and z-a) via:
  - two buttons in the 'Word/phrase' table header, and
  - two buttons in the 'Language' table header.
    - At least two rows need to be generated before the sort buttons are enabled.
- A definition can be edited (or added).
- If the language selected was "Other", a "Set language" button will appear in the entry under 'Language'.

Entries, edits, additions and sort order are saved to local storage.
Deleted entries are also deleted from local storage.

## HTML

- `template` used for dynamic `table` rows.
- `dialog` is used to house the form.
- The table has a min-width of 736px. At screens smaller than 768px (width dimensions of iPad Mini) scrollbars will appear.

## Javascript

- Dialog modal.
- Theme switcher.
- Sort functionality (using ES6 `.sort()` method).
- ES6 (no transpilation to ES5)

## CSS

- `flexbox` used for page layout and page elements.
- Files are organised using `@import` to pull modules into `style.css`.
- Files are organised internally using CSS nesting.
- Responsive (as far as a data table can be responsive).
- Dark theme.

## Adding a language

This requires adding code to both the HTML and JavaScript (You can add as many languages as you require).
First, look up the relevant [ISO Country Code](https://www.w3docs.com/learn-html/html-language-codes.html).

- E.g. for 'Portuguese', the country code is 'pt'.

Then, in `./index.html` add `<option value="pt">Portuguese</option>` somewhere in the `select` dropdown:

```HTML
<select id="language-select" name="language-select" data-language-select>
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
    <option value="la">Latin</option>
    <option value="es">Spanish</option>
    <option value="pt">Portuguese</option> <!-- Portuguese added -->
    <option value="und">Other</option>
</select>
```

Finally, in `./js/script.js` add a new `case` in the `switch` statement:

```JavaScript
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
    case "pt":
      entry.language = "Portuguese" /* Portuguese added */
      break
    case "und":
      entry.language = "Other"
      break
    default:
      entry.language = "Not available"
  }
}
```

## Testing

- Tested on:
  - Windows 10
    - Chrome
    - Firefox
    - Microsoft Edge

The page has been tested in both browser and device views.
