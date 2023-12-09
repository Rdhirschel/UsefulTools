# UsefulTools

This project is a collection of useful tools for personal usage. It's designed to provide quick and easy access to a variety of utilities that can help with everyday tasks, or just useful things that are needed from time to time.

## Features
- **Photo Filters**: Apply various filters of colors to your photos to enhance their appearance.
- **URL Shortener**: Shorten long URLs for easy sharing.
- **Youtube to MP3 Converter**: Work In Progress

## Usage

### URL Shortener

1. Navigate to the URL Shortener page.
2. Enter the URL you want to shorten in the input field.
3. Click the "Shorten" button.
4. The page will display a shortened URL. You can copy this URL and use it anywhere you want.

### Photo Filters

1. Navigate to the Photo Filters page.
2. Click the "Upload" button to upload the photo you want to apply filters to.
3. Select a filter from the list of available filters.
4. Click the "Apply" button to apply the selected filter to your photo.
5. If you're happy with the result, you can download the filtered photo by clicking the "Download" button.

### Youtube to MP3 Converter
 - Still isn't complete.


## Technical Details

-  **URL Shortener:** The URL Shortener works by taking a URL input from the user and sending it to a server. The server uses a hash function to generate a unique short code for each URL. The original URL and the short code are stored in a database. When the short code is used, the server retrieves the original URL from the database and redirects to it. If the URL entered by the user is not valid, an error message is displayed.

- **Photo Filters:** The Photo Filters feature works by manipulating the pixels of an image. When a user uploads an image, the image is drawn onto a canvas and the pixel data is extracted. The user can then select a color filter to apply to the image. The color filter works by converting the RGB color of each pixel to HSL (Hue, Saturation, Lightness), changing the hue and saturation to match the selected color, and then converting back to RGB. The lightness of the original pixel is preserved, maintaining the image's original shading. The filtered image is then redrawn on the canvas. The user has the option to download the filtered image or undo the color change.

- **Youtube to MP3 Converter**: Yet to be added.

*Please note that these are simplified explanations. The actual implementation involves more details and considerations.*

## Contributing
- We welcome contributions to this project. If you have a tool you'd like to add, or if you have improvements to existing tools, please feel free to make a pull request. 
- **Have an idea for a new tool or an improvement to an existing one?** We'd love to hear from you! Feel free to reach out to us and share your ideas. We're always open to suggestions and feedback.

## Authors
<table>
  <tr>
    <td><img src="https://github.com/Rdhirschel.png" width="50" height="50"></td>
    <td><a href="https://github.com/Rdhirschel" target="_blank">Rdhirschel</a></td>
  </tr>
  <tr>
    <td><img src="https://github.com/etetetN.png" width="50" height="50"></td>
    <td><a href="https://github.com/etetetN" target="_blank">etetetN</a></td>
  </tr>
</table>
