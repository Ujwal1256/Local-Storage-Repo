# Ques 15 - Local Storage Implementation

## Overview

This project demonstrates the use of local storage in a web application. The implementation allows users to store, retrieve, and manage data directly in their browser using the `localStorage` API.

## Features

- Save user input to local storage
- Retrieve and display stored data
- Remove specific items or clear all data
- Responsive and user-friendly interface

## How It Works

1. **Saving Data:**  
    User inputs are captured and stored in the browser's local storage using `localStorage.setItem(key, value)`.

2. **Retrieving Data:**  
    Stored data is fetched and displayed using `localStorage.getItem(key)`.

3. **Removing Data:**  
    Users can remove individual items with `localStorage.removeItem(key)` or clear all data with `localStorage.clear()`.

## Usage

1. Clone or download the repository.
2. Open the HTML file in your browser.
3. Interact with the interface to add, view, or remove data from local storage.

## Files

- `index.html` – Main HTML file with the UI and the script.


## Notes

- Data persists even after refreshing or closing the browser, until manually cleared.
- No backend or server is required.

