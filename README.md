# Buggy library-specification

A specification for buggy library servers, including tests for the REST API.

# REST API

The REST API is defined in the [swagger specification](https://buggyorg.github.io/library-specification/). A short overview over the commands:

<table><tr><td>Path</td><td>Method</td><td>Summary</td></tr><tr><td>/components</td><td>POST</td><td>Insert a new component</td></tr><tr><td>/components</td><td>GET</td><td>List all components</td></tr><tr><td>/components/count</td><td>GET</td><td>Number of components</td></tr><tr><td>/components/get/{meta}</td><td>GET</td><td>Information for a specific component.</td></tr><tr><td>/components/get/{meta}/version/{version}</td><td>GET</td><td>Information for a specific component.</td></tr><tr><td>/config/{key}</td><td>POST</td><td>Set a configuration value</td></tr><tr><td>/config/{key}</td><td>GET</td><td>A configuration value</td></tr><tr><td>/export</td><td>GET</td><td>Returns the whole database</td></tr><tr><td>/info</td><td>GET</td><td>Server information</td></tr><tr><td>/meta/{component}</td><td>GET</td><td>All meta keys for a component</td></tr><tr><td>/meta/{component}/version/{version}</td><td>GET</td><td>All meta keys for a component @version</td></tr><tr><td>/meta/{component}/version/{version}/{key}</td><td>GET</td><td>Meta key value for a component</td></tr><tr><td>/meta/{component}/version/{version}/{key}</td><td>POST</td><td>Set a meta key</td></tr><tr><td>/meta/{component}/{key}</td><td>POST</td><td>Set a meta key</td></tr><tr><td>/meta/{component}/{key}</td><td>GET</td><td>Meta key value for a component</td></tr></table>
