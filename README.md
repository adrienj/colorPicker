# colorPicker

Touch-enabled Color Picker jQuery Plugin (2KB)
 
### Features

- Small & Fast
- Responsive
- Uses HTML5 Canvas
- Returns colors in #hex format

### Usage

	$('.chooseColorBtn').click(
		$('.rainbowBoxTheSizeYouWant').colorPicker({
	        saturation: 80,
	        luminosity: 65, 
	        hue: Math.random(), // Cursor start position (between 0 and 1, from left to right)

	        callback: function(hexColor) {
	        	$('.element').css('color', hexColor);
	        }
	    })
    );

Style it the way you want. There might sill be bugs present, tell me if you found one !