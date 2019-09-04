# impress.js_panzoom

## PanZoom plugin what?
It's a pan and zoom plugin in for Impress.js

Impress.js is a HTML5/CSS3 based open source presentation tool. It's like Prezi, but open, free, and better. It was authored by Bartek Szopka and Henrik Ingo. The current release version is 1.0.0.

 *  url:     http://impress.js.org
 *  source:  http://github.com/impress/impress.js/

This repository contains a plugin that added an indispensable function for me: the ability to zoom in and out of slides and the presentation as a whole (by mouse wheel or touchpad). This allows a presenter to zoom out, pan to, and click on any of the steps, to continue from there. I use this feature (rather much more than the imho ugly and clunky goto drop down) to go to certain slides during after presentation discussion, and to zoom in on details of a slide during a presentation when I feel a need to. When zoomed in (or out) press forward to return to the current slide itself.

## Why isn't this an integrated plugin or 3rd party add on of impress.js?
I haven't put in a pull request on the official impress.js repository yet, because I have no automated tests yet. If time serves, I will walk the proper path to a pull request. For now you'll have to trust me this plugin works (tested on Chrome and FireFox).

## Installing
You can either replace your js/impress.js with the one in this repository (it's a build of Impress.js with the standard plugins and this one added), or you can concatenate the contents of panzoom.js to the very end of your own impress.js (e.g. when you have changed or added plugins). In the latter case you'll have to make sure that the Substep plugin (if you're using that one) runs *after* this plugin. To ensure so, find the line reading:

`window.impress.addPreStepLeavePlugin( substep, 1 )`

and change the 1 to 2:

`window.impress.addPreStepLeavePlugin( substep, 2 )`

## Can I see it in action first?
Sure, pick on of my Prezs, e.g.: http://jorisvanzundert.net/prezs/presentations/EADH_2018/EADH_2018.html#/DeepLearningModel (Although I prefer Firefox for anything else, Chrome must be advised for its speed.)

## Comments etc.
If you think of any improvements, feature requests, bugs, please use this repo to notify me.

--JZ_20190904_2114
