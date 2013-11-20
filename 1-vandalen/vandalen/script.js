//Provat brackets för den här uppgiften, annorlunda formatering och placering av "use strict" för att få tyst på jslint

var makePerson = function (persArr) {
    "use strict";
    var personStats, names, ages, agesSum, compare, objectCheck;
    
    //Start felhantering
    //Kontrollfunktion för att ett objekt följer mönstret Object{name=string, age=number} (born=string med för att testerna ska fungera).
    objectCheck = function (element, index, array) {
        return (typeof element.name === "string" && ((typeof element.age === "number" && element.age % 1 === 0) || typeof element.born === "string"));
    };
    
    //Kontrollerar att indata är en array
    if (!Array.isArray(persArr)) {
        throw {
            name: "ArgumentException",
            message: "Du måste skicka en array till funktionen"
        };
    //Kör kontrollfunktionen för varje element i arrayen
    } else if (!persArr.every(objectCheck)) {
        throw {
            name: "ArgumentException",
            message: "Arrayen du skickar måste bestå av objekt med egenskaperna name = sträng och age = heltal."
        };
    }
    //Slut felhantering
    
    //Start huvudsaklig programkod
    names = [];
    ages = [];
    agesSum = 0;
    
    //Sortering av indata till separata arrayer, samt beräkning av summa för åldrar
    persArr.forEach(function (person) {
        names.push(person.name);
        ages.push(person.age);
        agesSum += person.age;
    });
    
    //Jämförelsefunktion; implementerad eftersom standardsorteringen inte kan hantera lokala tecken
    compare = function (a, b) {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
    };
    
    names.sort(compare);
//    ages.sort();
    
    //Beräkningar för utdata
    personStats = {
        minAge: Math.min.apply(null, ages),         //ages[0],                      //Förmodligen är sort och hämtning av första och sista värde effektivare, men här ska det provas js funktioner =)
        maxAge: Math.max.apply(null, ages),         //ages[ages.length - 1],
        averageAge: Math.round(agesSum / ages.length),
        names: names.join(", ")
    };
    
    return personStats;
};

////var data = [{name: "John Häggerud", age: 37.5}, {name: "Johan Leitet", age: 36}, {name: "Mats Loock", age: 46}];
////var data = "test";
//var data = ["namn", 9];
//try {
//    var result = makePerson(data);
//} catch (err) {
//    console.log(err.message);
//}
