const pokeurl = "https://pokeapi.co/";
const pokemons = "https://pokeapi.co/api/v2/pokemon/"
const spriteurl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

printGetButtons(); //calls function on load
printPokemons(1, 100); //calls function on load with parameters that fit the first number of pokemons we want to see
function printPokemons(lowerNum, upperNum) {
    $.ajax(
    {
        method: "GET",
        dataType: "JSON",
        url: pokemons
    }
    )
    .done(function(pokemonsJSON) {
        $("#pokemons").html(""); //clears div
        $.each(pokemonsJSON.results, function(i, pokemon) {
            //variables
            let url = pokemon.url;
            let urlarray = url.split('/'); //splits url into array using slash as a seperator
            let pokemonid = urlarray[urlarray.length-2]; //finds id of pokemon in array created from url-split
            let fullspriteurl = spriteurl + pokemonid + ".png"; //gets correct img by combining url and correct pokemon id
            let name = pokemon.name;
            let thisPokemonCount = i + 1;
            
            
            if(thisPokemonCount >= lowerNum && thisPokemonCount <= upperNum) {
                $("#pokemons").append(
                    `
                        <article class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2">
                        <div class="card h-100">
                            <img src="${fullspriteurl}" class="pt-3 mx-auto d-block img-fluid" /> 
                            <div class="card-body">
                                <h5 class="text-capitalize card-title"><b>${pokemonid}.</b> ${name} </h6>
                                <div class="pokeid${pokemonid}">
                                </div>
                            </div>
                        </div>
                        </article>
                    `
                );
                getPokemonData(pokemonid); //calls function getPokemonData that prints additional info about pokemons

                //if image of pokemon does not excist, the image switches to a default picture of a pokeball
                $(".img-fluid").on("error", function(){
                    $(this).attr('src', './img/pokeball.jpg');
                });
            }
        })

    }) //end done
    .fail(function(){
        alert("Pokemons could not be found.");
    }) //end fail

}//end printPokemons()


function getPokemonData(pokemonid) {
    let newurl = pokemons + pokemonid + "/"; //variable for url we want to use
    $.ajax(
        {
            method: "GET",
            dataType: "JSON",
            url: newurl
        }
    )
    .done(function(pokemonDataJSON) {
        //variables
        var pokeWeight = pokemonDataJSON.weight;
        var pokeType1; //empty variable
        var pokeType2; //empty variable

        //each function sets pokemon types from json-list to right variable
        $.each(pokemonDataJSON.types, function(i, pokeData) {
            if(pokeData.slot == "1") {
                pokeType1 = pokeData.type.name;
            } else {
                pokeType2 = pokeData.type.name;
            }
        })

        //calls function getColor for each type and stores the result in new variables
        var newClassType1 = getColor(pokeType1);
        var newClassType2 = getColor(pokeType2);

        //variables
        var pokemonDiv = ".pokeid" + pokemonid; //variable classname of div we want to get
        var addHtml = 
        `
            <p>Weight: ${pokeWeight}</p>
            <ul class="list-group">
                <li class="list-group-item ${newClassType1}">${pokeType1}</li>
        `;

        //checks to see if the pokemon has a second type
        if(pokeType2 != null) {
            addHtml += `<li class="list-group-item ${newClassType2}">${pokeType2}</li>`
        }
        addHtml += `</ul>`;

        $(pokemonDiv).append(addHtml); //appends our rendered html to our selected div
        
    }) //end done
    .fail(function(){
        alert("Pokemon data could not be printed.");
    }) //end fail
}

//function that returns the name of css classes we want to use based on the parameter, which is pokemon type
function getColor(type) {
    switch(type) {
        case "grass":
            return "bg-success text-white"
            break;
        case "electric":
            return "bg-warning"
            break;
        case "fire":
            return "bg-danger text-white"
            break;
        case "flying":
            return "bg-info text-white"
            break;
        case "ground":
            return "bg-secondary text-white"
            break;
        case "water":
            return "bg-primary text-white"
            break;
        case "poison":
            return "bg-dark text-white"
            break;
        case "ghost":
            return "bg-dark text-white"
            break;
        case "dark":
            return "bg-dark text-white"
            break;
        case "rock":
            return "bg-secondary text-white"
            break;
        case "fighting":
            return "bg-danger text-white"
            break;
        case "steel":
            return "bg-secondary text-white"
            break;
        case "ice":
            return "bg-info text-white"
            break;
        case "dragon":
            return "bg-danger text-white"
            break;
        default:
            return "bg-light"
    }
}


//function prints buttons that can be used to print what number of pokemons you want to see
function printGetButtons() {
    $.ajax(
    {
        method: "GET",
        dataType: "JSON",
        url: pokemons
    }
    )
    .done(function(pokemonsJSON) {
        //Creates empty array with id and numberString as keys
        let numbersArrayJSON = {
            numberList: [
                {id: null, numberString: null, lowerNum: null, upperNum: null}
            ]
        };

        //variables
        let pokemonCount = pokemonsJSON.count; //Amount of pokemons the AJAX function got
        let buttonsCont = $('#navbuttons');
        var idNumber = 1; 

        //for every 100th pokemon, set arraylist item with id and a string with which pokemons it will
        for(i = 0; i <= pokemonCount; i += 100) {
            var firstNumber = parseInt([i]) + 1; //sets the first number
            var secondNumber = parseInt([i]) + 100; //gets the first number and adds 100
            var fullNumberString;

            //if statement to see if the amount of remaining pokemons is more than the actual amount of pokemons, if it surpasses the max amount, the string will use the full count as the second number. 
            if(secondNumber < pokemonCount) {
                fullNumberString = firstNumber + " - " + secondNumber;
            } else {
                fullNumberString = firstNumber + " - " + pokemonCount;
            }

            //pushes the id with the numberString to the JSON list
            numbersArrayJSON.numberList.push({"id": idNumber, "numberString": fullNumberString, "lowerNum": firstNumber, "upperNum": secondNumber});
            idNumber++; //increments the idNumber
        }

        //print buttons for each array item
        $.each(numbersArrayJSON.numberList, function(i, numbers) {
            let idX = numbers.id;
            let labelName = numbers.numberString;
            let lowerNumber = numbers.lowerNum;
            let upperNumber = numbers.upperNum;
            if(idX != null && labelName != null) {
                buttonsCont.append(`<button class="getpokemons btn btn-dark mr-2" data="${idX}" onclick="printPokemons(${lowerNumber}, ${upperNumber})">${labelName}</button>`)
            }
        });

    }) //end done
    .fail(function(){
        alert("Buttons could not be printed.");
    }) //end fail

}//end printgetButtons()