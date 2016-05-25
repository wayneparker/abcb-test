# ABCB Test Exercise: Task Tracker v2.0

Initial release • 2016-05-25

I was tasked with this exercise in order to evaluate my web development skills. While I could have banged out something very simple, very quickly, I decided to treat this as an actual "real world" project, to demonstrate not just what I can do, but how I do it.

### Direction from Client:

>	Requirements
>	
>	* Should load the data below into the existing data section on page load.
>	* Should have the ability to create tasks that will immediately be prepended to the list.
>	* Should not require a web server, and should be able to run offline.
>	* Match the design as close as possible.
>	* All data exchanges should be in JSON format.
>	* IMPORTANT: This must be completed using jQuery or vanilla Javascript - no other JS frameworks may be used.  Also, do not use any CSS frameworks (e.g. Bootstrap)
>	
>	Existing Data (JSON)
>
		[
			{"name": "Test Task #1", "date": "12/01/2012", "assigned": "John Doe" },
			{"name": "Test Task #2", "date": "12/02/2012", "assigned": "John Doe" },
			{"name": "Test Task #3", "date": "12/03/2012", "assigned": "John Doe" },
			{"name": "Test Task #4", "date": "12/04/2012", "assigned": "John Doe" },
			{"name": "Test Task #5", "date": "12/05/2012", "assigned": "John Doe" },
			{"name": "Test Task #6", "date": "12/06/2012", "assigned": "John Doe" },
			{"name": "Test Task #7", "date": "12/07/2012", "assigned": "John Doe" }
		]

Basically, a simplified version of the classic TodoMVC in vanilla JS.

### Notes

* The folder /src/ref/ contains the reference files from the client: a text file with the instructions above, and a layered Photoshop comp.

* I set up source (`/src`), development (`/dev`) and production (`/dist`) folders. `gulp watch` is used to lint and process Sass and JavaScript (with sourcemaps, cos that's just how I roll), and to push `/src` assets to the correct folders. `gulp dist` minifies/uglifies CSS and JS, and pushes to the production folder, ready for deployment.

* Although the comp shows only a fixed 800px width, it *is* 2016, so I made the page responsive. below 720px, the form and list are stacked verically; between 720px and 1024px, they're displayed side by side, as in the comp; above 1024px, the width is fixed and centered in the browser.

* The only third party code I used was normalize.css, because I used it on *all* projects to make cross-browser rendering somewhat more sane.

* In order to write this as if it was a typical AJAX app (as it would be in the Real World), I wrote a quick 'n' dirty "emulator" to handle fake XMLHttpRequest calls locally. Modifying the app to use actual server data would be as simple as changing one call name. Easy peasy lemon squeezy. Just fer grins, I might update it to use Local Storage instead…

* I didn't write form validation code; it's simple enough, the built-in HTML 'required' attribute seems sufficient. 

* Likewise, I didn't go as far as writing unit tests. Like the form validation, I might do it if I have some time to kill.
