### CyberStation

**CyberStation** is a browser application written in Javascript ([ES6, ES2015](http://www.ecma-international.org/ecma-262/6.0/index.html)) 
that provides a UI to 
connect to a [TAXII-2.0](https://oasis-open.github.io/cti-documentation/taxii/intro.html) server 
and allow a user to create and then send 
[STIX 2.1](https://oasis-open.github.io/cti-documentation/stix/intro) objects to it.

[STIX-2.1](https://oasis-open.github.io/cti-documentation/resources#stix-20-specification) 
 cyber threat intelligence objects are described as [1]: 
"Structured Threat Information Expression (STIX™) is a language and serialization format 
used to exchange cyber threat intelligence (CTI). STIX enables organizations to share 
CTI with one another in a consistent and machine readable manner, allowing security 
communities to better understand what computer-based attacks they are most likely to 
see and to anticipate and/or respond to those attacks faster and more effectively.

[TAXII-2.0](https://oasis-open.github.io/cti-documentation/taxii/intro.html) server 
is described as [2]: "Trusted Automated Exchange of Intelligence Information (TAXII™) 
is an application protocol for exchanging CTI over HTTPS. ​TAXII defines a RESTful API 
(a set of services and message exchanges) and a set of requirements for TAXII Clients 
and Servers."

### Documentation

The aim of **CyberStation** is to create STIX-2.1 objects through a UI and sending them as a bundle to a 
selected TAXII-2 server. The App consist of a single page user interface, with a number 
of tabs to choose from. The work flow consists of selecting a server together with a collection endpoint to connect to.
 Then creating a bundle of STIX objects using the UI and sending that bundle to the selected server endpoint. 
The following describes the different pages of **CyberStation**. 

#### Login
The user is first presented with a login form, it is not yet functional, 
so ignore it for now and just press the **Submit** button.

#### Main page
The main page has a top bar that allows for selecting the **SERVER** and **STIX** pages.

Clicking on the **SERVER** button brings a page with the tabs; **SERVERS** where TAXII-2 servers can be added, removed and selected,
and **COLLECTIONS** representing the endpoints of the chosen server collections. Clicking on 
the **STIX** button brings the UI for creating the different types of STIX objects. 

#### Server page
On the **SERVER** tab page, a test server from [freetaxii-server](https://github.com/freetaxii/freetaxii-server)
is predefined for selection. Selecting a server brings the list of its api roots. 
One api root should be selected to be able to send STIX objects to the server.

The UI allows for adding new servers by clicking the 
![+](/images/add.png?raw=true "Add") button or deleting previously defined servers 
by selecting the desired server and clicking on the ![-](/images/delete.png?raw=true "Delete") button.

On the **COLLECTIONS** tab page, a list of the collections available at the selected server is displayed.
A collection should be selected to be able to send STIX objects to the server.

#### Stix page
Clicking on the **STIX** button brings a page where STIX objects can be created. All STIX objects 
must belong to a bundle. As such, a bundle object must first be created from the **BUNDLE** page before 
any STIX objects types can be added to it.

The UI allows for adding new bundles by clicking the ![+](/images/add.png?raw=true "Add") button or deleting previously defined bundles 
by selecting the desired bundle and clicking on the ![-](/images/delete.png?raw=true "Delete") button. In addition a **SEND TO SERVER** button 
allows for sending the bundle to the selected server. This button is disabled if no server and collection 
endpoint are selected or the selected collection does not allow writing to.

Other tabs on the STIX page allow for creating the different STIX types objects.
Currently only **"attack pattern, indicator, relationship and sighting"** are implemented.

If a server/api root/collection has not yet been selected, a bundle of STIX objects can still be created. Such 
bundle is saved to local (browser) storage, such that it can be further edited later on, 
and eventually sent to the selected TAXII-2 server.   


## Demo

There is a demo of **CyberStation** at [CyberStation 0.1](https://workingdog.github.io/cyberstation/).
It makes use of the 
[freetaxii-server](https://github.com/freetaxii/freetaxii-server).


#### Requisite
 
You need a modern browser compatible with Javascript ES6, see 
[ES6 compatibility table](https://kangax.github.io/compat-table/es6/).
 Note when using [freetaxii-server](https://github.com/freetaxii/freetaxii-server) there is 
 currently an issue with the "Allow-Control-Allow-Origin" requirement. 
 To overcome this on Chrome for example, launch Chrome (on macos) with:
 
     open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
 

### References
 
1) [STIX 2.1 Specification](https://oasis-open.github.io/cti-documentation/). OASIS open standards

2) [TAXII-2.0 Specification](https://oasis-open.github.io/cti-documentation/resources#taxii-20-specification). OASIS open standards

3) [freetaxii-server](https://github.com/freetaxii/freetaxii-server). A cyber threat intelligence server based on TAXII 2 and written in Golang.

4) [TAXII-2.0 Javascript lib](https://github.com/workingDog/taxii2lib). A TAXII 2.0 javascript client library.

### Status

work in progress, not tested, prototype stage.




