# GoogleAppsScriptLibrary

This repository is a collection of documents written in [Google Apps Script](https://developers.google.com/apps-script/). Google Apps Script allows you to write scripts in Google Drive (very similar to how you might make a document in Google Drive) that interacts natively with a variety of Google services (e.g. Sheets, Docs, Drive, Gmail, Calendar, Contacts, etc). Not only that, but there are also ways to have your script interact with full APIs of those services (e.g. YouTube, Maps, etc) or even external services (in this repository I have examples for [Trello](https://trello.com/), [Plivo](https://www.plivo.com/), & [Twilio](https://www.twilio.com/))

For developing in Google Apps Script, I definitely recommend extensions listed here: https://github.com/derekantrican/Google-Apps-Script-Library/wiki/Developing-in-Google-Apps-Script

Please use the [issues page](https://github.com/derekantrican/Google-Apps-Script-Library/issues) here to report issues with these scripts. You can also contact me at derekantrican@gmail.com and I can help you troubleshoot a problem

-----------

### Programs Overviews:

External APIs

- *Plivo.gs:* An example of how to use Google Apps Script to send & recieve text messages through [Plivo](https://www.plivo.com/)
- *Set Slack Status.gs:* An example of how to set Slack status (i.e. https://api.slack.com/docs/presence-and-status#custom_status)
- *Set Trello FollowUps.gs:* With this example, you can create a new label on any card on any board (that you have access to) in Trello with the [FollowUpThen](fut.io) format (e.g. `1hour@fut.io`). This script is designed to run on a time basis (e.g. every 15 minutes) and will create a FollowUpThen reminder for those cards and delete that temporary label from the board
- *Twilio.gs:* An example of how to use Google Apps Script to send & recieve text messages through [Twilio](https://www.twilio.com/)

Google Calendar

- *Change Event Color.gs:* This script uses the **Official** Google Calendar API to change the color of events in Google Calendar
- *Check for overlapping events.gs:* This script will check multiple Google Calendars and check for conflicting (overlapping) events and alert the user to any such cases
- *Convert Event to All-Day.gs:* This script will simply convert any event into an all-day event
- *Delete Event From Multiple Calendars.gs:* The title is pretty self-explanatory here
- *Move events to calendar.gs:* Can move (or just copy) events from one calendar to another
- *Set Invite Status.gs:* This script will set your status on events you are invited to (`YES`/`NO`/`MAYBE`/`INVITED`)
- *Split Multi-Day Event.gs:* The purpose of this script is to split events that last more than 24 hrs into sections no more than 24 hrs (the reason being that Google Calendar shows events >24hrs in the "all-day section" at the top of the calendar - making them harder to spot). This makes it easier to see when a large event is planned. **This script still has some development work to be done and has issues**

*ICS-ICAL Sync:* https://github.com/derekantrican/GAS-ICS-Sync

Tasks- Forms- etc

- *Any.Do Port.gs:* **This script was never fully working and should only be used for reference on how to create Google Forms and interact with Google Tasks** This was an attempt to recreate the [Moment](https://support.any.do/hc/en-us/articles/202781361-What-is-the-Any-do-Moment-) function of the task manager [Any.Do](https://www.any.do/)

----------
### Interesting libraries/articles

Here are a variety of articles, libraries, tools, etc I have found related to Google Apps Script:

- Continuous integration (building/testing/publishing/etc) with Travis CI: https://github.com/faresd/google-apps-script_travis-ci
- A library for updating a manifest file (`appsscript.json`) programatically: https://github.com/tanaikech/ManifestsApp
- An extension for adding git commands (push/pull, etc) to the GAS IDE: https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo
- A dark-theme for the GAS IDE: https://chrome.google.com/webstore/detail/appsscript-color/ciggahcpieccaejjdpkllokejakhkome
- Using VS Code on your computer to develop GAS:
  - https://www.labnol.org/internet/google-apps-script-developers/32305/
  - https://yagisanatode.com/2019/04/01/working-with-google-apps-script-in-visual-studio-code-using-clasp/
