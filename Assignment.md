# Web Development Assignment 2025

## Dashboard

In this assignment you will implement a dashboard  that can display
a collection of **widgets** and other associated information.

## Starter Code

The code included here implements the basic framework for the application, including
an overall page structure and the advertising components.  If you run
the application you will see the basic page with space for a number of _widgets_.  
You will fill these slots with your own widgets - one per team member. (A _widget_
is a name for an element of a graphical user interface, basically the same as a
component).

The module `config.js` exports a variable `BASE_URL_AD_SERVER` that contains the address
of the backend ad server. This is used in the ad-widget component
to define the URL endpoint.  You will also want to do something similar to use 
your own chosen API end point.

The code contains implementations of the following components:

### `<comp2110-dashboard>`

This is a container for the whole application and currently contains
some of the pre-defined widgets.  You can modify this as you see fit to achieve
your overall application layout and behaviour.

### `<widget-column>`

This component implements a container for widgets and can be used to define
the style information and layout for the group.  You can modify this if you
wish or replace it with something else.

### `<ad-widget>`

This component displays an advertisement from the backend portal server. You should not
modify it and it should appear somewhere in your page design.


## Implementing Widgets

Widgets are components that extend the functionality of the application.
Each widget is stand-alone - that is, the application will work with or
without it, but adding it might improve the application.   

The overall organisation of the dashboard can either be fixed - you hand-craft
the layout and the API endpoints that each widget talks to - or automatically
configured based on the API.  In this second case, your app would query the API
for a list of eg. sensors, and display a widget for each one.