"use strict";

window.onload = function(){

	
	var birthday = function(date){
        
        //kontrollera att inmatat värde är åååå-mm-dd
        var datePattern = new RegExp("[19|20][0-9][0-9]-[0|1][0-9]-[0-3][0-9]");
        var isLeapDay = new RegExp("[19|20][0-9][0-9]-[0][2]-[29]");            //Kontroll för skottdag, eftersom date funktionen returnerar detta datum som 1/3
        
        var leapYear = function(year) {
            return !(year % 4) && (year % 100) || !(year % 400);     //true: 0 och (!0 eller 0)
        };
        
        if(date.match(datePattern))
            {        
            var birthday = new Date(date);
            birthday.setHours(23);
            var today = new Date();
            today.setHours(0);                          //fulfix? - tiden är ointressant för denna kod, birthday sätts alltid till 01:00 varför det fungerar alla tider på dygnet såhär
            birthday.setFullYear(today.getFullYear());
            
            //har användaren redan fyllt år?
            if(birthday.getTime() < today.getTime())
            {
                var y = today.getFullYear();
                birthday.setFullYear(today.getFullYear() + 1);
            }

            //Om 29/2, räkna dagar tills nästa gång datumet inträffar, egentligen är kanske det normala värdet är bättre då användaren förmodligen firar sin födelsedag då. Men eftersom det här gav lite intressantare kod är det väl såhär det är tänkt.
            if(date.match(isLeapDay))
            {
                if(!leapYear(birthday.getFullYear())) {
                    var nextLeap = birthday.getFullYear()
                    while(!leapYear(nextLeap))
                    {
                        nextLeap +=1;
                    }
                    var leapDate = birthday;
                    leapDate.setFullYear(nextLeap);
                    return Math.floor((leapDate.getTime()-today.getTime())/(1000*60*60*24));
                }
            }
            
            
            //tid på dagen? satt timmarnas värden så att det inte borde kunna gå fel. Borde gå att lösa lite elegantare, men jag har hjärnsläpp just nu och det är snart dags att redovisa.          
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