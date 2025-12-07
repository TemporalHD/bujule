// Function to validate user input and generate a sandwich order summary
function generateText() { // Get the values form the user's inputs
	var name = document.getElementById('name').value; // Get the user's name from the input field
	var phone = document.getElementById('phone').value; // Get the user's phone number from the input field
	var vegetables = document.getElementsByName('vegetables'); // Get all vegetable checkbox elements
	var cheese = document.getElementsByName('cheese'); // Get all cheese radio button elements
	var bread = document.getElementsByName('bread'); // Get all bread radio button elements
	var amount = document.getElementsByName('amount')[0].value; // Get the selected amount value from the <select> element named 'amount' we access it using [0].
	var note = document.getElementById('notes').value; // get the notes from the user
	var checkVeg = [];   // Array to store selected vegetables
	var checkCheese = '';
	var checkBread = '';
	var alertMsg = "";   // String to for the error messages
	var orderDate = document.getElementById('orderDate').value; // Get the date and time values
	var orderTime = document.getElementById('orderTime').value; // Get the date and time values
	var letters = /^[a-zA-Zא-ת\s]+$/; // Letters only (including Hebrew letters and spaces)
	var numbers = /^[0-9]+$/; // Numbers only
	var trimmedName = trim(name);
	//checking if the name that was entered meets the requirements
	if (trimmedName === '' || trimmedName === "הכנס את שמך") {
    alertMsg += "\nאנא צרף את שמך.";
	} 
	else if (letters.test(trimmedName)==false) {
    alertMsg += "\nהשם צריך להכיל רק אותיות.";
	}
	function trim (str){
     return str.replace (/^\s+|\s+$/g, '');
	}
	if (numbers.test(phone) == false) { // Make sure the phone number was entered correctly 
		alertMsg = alertMsg + "\nמספר הטלפון צריך להכיל רק ספרות."; // adding the error to the string that will be displayed to the user if needed
	}
	if (orderDate == '') { // Check if date was selected
		alertMsg = alertMsg + "\nאנא בחר תאריך."; // adding the error to the string that will be displayed to the user if needed
	}
	if (orderTime=='') { // Check if time was selected
		alertMsg = alertMsg + "\nאנא בחר שעה."; // adding the error to the string that will be displayed to the user if needed
	  }
	for (var i = 0; i < vegetables.length; i++) { // Loop through vegetables and store the checked ones
		if (vegetables[i].checked) {
		  checkVeg.push(vegetables[i].value);
		}
	}
	if (checkVeg.length == 0) { // check if at least one vegetable is added
		alertMsg = alertMsg + "\nאנא בחר ירק."; // adding the error to the string that will be displayed to the user if needed
	}
	for (var i = 0; i < cheese.length; i++) { // Loop through cheese options and get the selected one
		if (cheese[i].checked) {
			checkCheese = cheese[i].value;
			break;
		}
	}
	if (checkCheese == '') {
		alertMsg = alertMsg + "\nאנא בחר גבינה."; // adding the error to the string that will be displayed to the user if needed
	}
	for (var i = 0; i < bread.length; i++) { // Loop through bread options and get the selected one
		if (bread[i].checked) { 
			checkBread = bread[i].value; // Store the selected bread
			break; // break after finding one, since only one bread is allowed
		}
	}
	if (checkBread == '') {
		alertMsg =alertMsg + "\nאנא בחר לחם."; // adding the error to the string that will be displayed to the user if needed
	}
	if (amount == '0') { // If the amount is 0, add an error message 
		alertMsg = alertMsg + "\n הכמות לא יכולה להיות אפס."; // adding the error to the string that will be displayed to the user if needed
	}
	if (alertMsg == "") { // If there were no validation errors and the alertMsg is an empty string build the order summary
		var textForDisplay = "הזמנת הכריך שלך: &#127791<br>"; //we use &#127791 to add a sandwich emoji when we display the order
		textForDisplay += "תאריך: " + orderDate + "<br>";
		textForDisplay += "שעה: " + orderTime + "<br>";
		textForDisplay += "ירקות: ";      
		textForDisplay += checkVeg.join(", ") + "."; // Add the selected vegetables to the summary
		textForDisplay += "<br>לחם: " + checkBread + ".<br>";
		textForDisplay += "גבינה: " + checkCheese  + ".<br>";
		textForDisplay += "כמות: " + amount + ".<br>";
		textForDisplay += "הערות: " + note + ".";
		document.getElementById('preview').innerHTML = textForDisplay; // Show the summary on the page
		document.getElementById('sandwichForm').reset(); // Reset the form after successful submission
		processInfo(name, phone, orderTime, orderDate, checkVeg.join(", "), checkBread, checkCheese, amount, note);
		sendOrderToWhatsApp(`הזמנה חדשה מהמעדנייה:\nשם: ${name}\nטלפון: ${phone}\nתאריך: ${orderDate}\nשעה: ${orderTime}\nירקות: ${checkVeg.join(", ")}\nלחם: ${checkBread}\nגבינה: ${checkCheese}\nכמות: ${amount}\nהערות: ${note}`);
	}
	else { // If there were validation errors, clear preview and show the alert messages
		document.getElementById('preview').innerHTML = '';
		alert(alertMsg);
	}  
}

function resetForm() { // Function to reset the form and clear the preview
	document.getElementById('sandwichForm').reset();
	document.getElementById('preview').innerHTML = '';
}

// Function to display all saved sandwich orders
function getAllOrders() {
	var orderTable = getOrdersDb(); // Retrieve saved orders from database
	var textPrint = ''; // Initialize display text
	// Loop through each order and build display string
	for (var i = 0; i < orderTable.length; i++) {
		var order = orderTable[i];
		textPrint += 'הזמנה על שם- ' + order[1] + ', ';
		textPrint += 'נייד- ' + order[2] + ', ';
		textPrint += 'שעה- ' + order[3] + ', ';
		textPrint += 'תאריך- ' + order[4] + '<br>';
		textPrint += 'ירקות- ' + order[5] + '. ';
		textPrint += 'לחם- ' + order[6] + ', ';
		textPrint += 'גבינה- ' + order[7] + '<br>';
		textPrint += 'כמות סנדוויצ’ים- ' + order[8] + ', ';
		textPrint += 'הערות- ' + order[9] + '<br><br>';
	}
	document.getElementById('textToPrint').innerHTML = textPrint;
}
function sendOrderToWhatsApp(orderMessage) {
    const phone = "972545299512"; 
    const encoded = encodeURIComponent(orderMessage);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank"); // open new whatapp window
}
// Stores order information in localStorage under a given ID
function processInfo(id, name, phone, orderTime, orderDate, vegetables, bread, cheese, amount, note) {
	var dbString = stringify(id, name, phone, orderTime, orderDate, vegetables, bread, cheese, amount, note); // Convert data to a single string
	localStorage.setItem(id, dbString); // Save the string in localStorage using the ID as the key
}

// Converts all order parameters into a single formatted string
function stringify(id, name, phone, orderTime, orderDate, vegetables, bread, cheese, amount, note) {
	var nameStr = 'name: ' + name; // Create name field
	var phoneStr = 'phone: ' + phone; // Create phone field
	var timeStr = 'time: ' + orderTime; // Create order time field
	var dateStr = 'date: ' + orderDate; // Create order date field
	var vegetableStr = 'vegetables: ' + vegetables; // Create vegetables field
	var breadStr = 'bread: ' + bread; // Create bread field
	var cheeseStr = 'cheese: ' + cheese; // Create cheese field
	var amountStr = 'amount: ' + amount; // Create amount field
	var notesStr = 'notes: ' + note; // Create notes field
	var dbStr = '{' + nameStr + ',' + phoneStr + ',' + timeStr + ',' + dateStr + ',' + vegetableStr + ',' + breadStr + ',' + cheeseStr + ',' + amountStr + ',' + notesStr + '}'; // Combine all fields into one string
	return dbStr;	// Return the final string
}
