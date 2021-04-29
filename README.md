# LWC REST Service

This is a utility component built on Lightning Web Components, which you can use wherever you want in your Lightning experience such as a separate tab or just a component in an existing page.

## Features

- Rapid callouts directly from LWC component through Fetch API
- GET, POST, PUT, PATCH, DELETE methods
- Response JSON body prettier
- Sending FormData, Raw and file request bodies

## Installation

1. Install [this package](<https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5g000000gkHJ>) to your org
2. In Lightning app buider add component at some page
3. Go to Setup -> CSP Trusted Sites -> Add new site instance to have permission to send a query (after saving it takes a few minutes)