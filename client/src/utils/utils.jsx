// Utility function to generate a random color
export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Utility function to get the contrast text color based on the background color's brightness
  export function getContrastText(backgroundColor) {
    if (!backgroundColor) {
        backgroundColor= '#FFFFFF';
    }
    else if (typeof backgroundColor !== 'string') {
        console.log('background color is not a string',backgroundColor );
        return "Red";
    }
    const hexColor = backgroundColor.replace("#", "");
    const red = parseInt(hexColor.substr(0, 2), 16);
    const green = parseInt(hexColor.substr(2, 2), 16);
    const blue = parseInt(hexColor.substr(4, 2), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness >= 128 ? "#000000" : "#FFFFFF";
  }
  