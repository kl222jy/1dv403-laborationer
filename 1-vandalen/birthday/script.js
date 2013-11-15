"use strict";

window.onload = function(){

	
	var birthday = function(date){
        
        //kontrollera att inmatat värde är åååå-mm-dd
        var datePattern = new RegExp("[19|20][0-9][0-9]-[0|1][0-9]-[0-3][0-9]");
        console.log(date);
        if(date.match(datePattern))
            {        
            var birthday = new Date(date);
            var today = new Date();
            birthday.setFullYear(today.getFullYear());
            
            //har användaren redan fyllt år?
            if(birthday.getTime() < today.getTime())
            {
                birthday.setFullYear(today.getFullYear() + 1);
            }
            
            //skottår? ska inte heller vara något problem  eftersom javascript hanterar även det.
            
            //tid på dagen? borde fungera som det ska iom math.floor
            
            return Math.floor((birthday.getTime()-today.getTime())/(1000*60*60*24));
        }
        else
        {
            throw {
                name: "System error",
                message: "Inmatat värde är inte ett giltigt datum."
            };
        }
        
	};
	// ------------------------------------------------------------------------------


	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#string");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		p.classList.remove( "error");

		try {
			var answer = birthday(input.value); // Läser in texten från textrutan och skickar till funktionen "convertString"
			var message;
			switch (answer){
				case 0: message = "Grattis på födelsedagen!";
					break;
				case 1: message = "Du fyller år imorgon!";
					break;
				default: message = "Du fyller år om " + answer + " dagar";
					break;
			}

			p.innerHTML = message;
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};