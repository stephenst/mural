# Mural Patterns - A Design Pattern Library Maker

An app for creating and managing your front-end pattern library.

1. Create patterns in Markdown files
2. Create structure by creating folders
3. Browseable interface

### Built with Gulp, Angular and Markdown/YAML

## 3 Seperate Sub-Modules
* Mural Patterns (this Read Me)
* Mural API (<a href="../api/Readme.md" target="_blank">read me</a>)
* Mural Styles (<a href="../styles/Readme.md" target="_blank">read me</a>)

## How to install
Dependecy
* [NodeJS](http://nodejs.org/)
* Bower
        `npm install -g bower`
1. Clone the repository
        `git clone https://github.com/stephenst/mural.git`
2. Install NPM and bower packages
        `npm install && bower install`
3. Launch the server
        `gulp serve`
3. Build the documentation
        `gulp Mural`
4. Open your browser and navigate to
        `http://localhost:3000/mural/patterns/index.html`


## How Mural Patterns works
1. Patterns folder is watched by Gulp and JSON files are generated for each root pattern
2. AngularJS uses these JSON documents to show a browseable interface of the patterns
3. Inject your own CSS by editing `index.html` and add your own patterns

## Pattern (markdown) Formats
The meta information in these files go between lines with `---`

Name: Title of the Pattern Section
hidecode: true|false  (if you have HTML code showing the exmaple have it under the bottom --- and we'll seperate it out.)
Description: This is the body copy that will display.  
Subsections within Description: (use markdown)
What - What the item is.
Use When - When do you implement it.

HTML Code goes below the meta information.
```
    ---
    name: Alert success
    hidecode: true
    description: >
        ### What
        Page level information or service alert. Critical updates with a defined time period should be pushed using the alert box.
    
        ### Use when
        For page level critical updates.
    ---
    <div class="ui-alert ui-alert--success">
        <div class="alert__title">This is a success alert</div>
        <div class="alert__body">More body text</div>
        <a href="#" class="alert_close"></a>
    </div>
```
