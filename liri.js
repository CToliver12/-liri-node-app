//variables calling information from the keys.js file which stores the twitter info
var keys = require("./keys.js");
var twitterKeys = keys.twitterkeys; 

//variables for all the diff things required to properly run node app 
var fs = require("fs");
var inquirer = require('inquirer');
var request = require("request");
var Twitter = require('twitter'); 
var spotify = require ("spotify");

//takes in the user input for spotify & movie options 
var userSelection = '';

// takes in the user input that calls the option you want 
var userInput = ''; 

//================================================================

console.log("Hello, I'm Liri."); 

	inquirer.prompt([
					
		{
			type: "input", 
			name: "name", 
			message: "what do I call you?"
		}, 

		{
			type: "list",
			name: "userPrompt",
			message: "What would you like me to do for you?", 
			choices: ["song info", "movie info", "my tweets", "surprise me"]
		}
	
		]).then(function(user)
					
		{

		//if user enters my tweets will run the myTwitter function 		
			if(user.userPrompt === 'my tweets'){
			 		myTwitter();
		}

		// if user enters song info it will prompt you and ask for song and run mySpotify function based on those results.
		else if(user.userPrompt === "song info"){

			inquirer.prompt([
		{
			type: "input",
			name: "song", 
			message: "What song interest you?"

		}
		
		]).then(function(userSelection)

		{
		// after user Selects song mySpotify function runs 
			if(userSelection.song ===  ""){
			}

				mySpotify(userSelection); 
			});
		}
		
	//If the user selects movie it will prompt the user to state what movie they want  
		else if(user.userPrompt === "movie info"){

			inquirer.prompt([
		{
			type: "input",
				name: "movie",
					message: "What movie interest you?"
		}
		//after movie typed fun the movie function 
		 ]).then(function(userSelection)
		 {
		 
		 if(userSelection.movie === ""){
		 }
		 	myMovies(userSelection);
		 });
		 //when surprise me is chosen run the doWhatItSays function 
		 } else if(user.userPrompt === "surprise me"){
		 	doWhatItSays();
		 };


 	function myTwitter(){

			//Passes Twitter keys into the call to Twitter API. 
			var client = new Twitter(keys.twitterKeys); 
	 
			//Search parameters includes my tweets up to the last 20 tweets; 
	  		var params = {
	 			q: 'codinglady', 
				count: '20'
	  				};


			 //Shows up to last 20 tweets when created in terminal.
			client.get('statuses/user_timeline', params, function(error, data, response){
			if(!error) {
	  		console.log(' ');
       		console.log('================ My Tweets ================');
         	data.forEach(function(obj) {
       	 	console.log('--------------------------');
         	console.log('Time: ' + obj.created_at);
         	console.log('Tweet: ' + obj.text);
         	console.log('--------------------------');
         	console.log(' ');
        	});

        	console.log('===========================================');
        	console.log(' ');
        	}else{console.log("Twitter User Not Found or No Tweets to show")}

        	//fs.appendFile('log.txt', 'Time:' + obj.created_at);
        	//fs.appendFile('log.txt', 'Tweet:' + obj.text); 

     		});

 		};


//================================================================================================== 
	function mySpotify(userSelection){

		//starts the search w/in spotify for the track and query based on userselection  
			spotify.search({ 
				type: 'track', 
				query: userSelection.song,  
			}, function(err,data) {
				if (err) {
			console.log('Error occured: ' + err);
			return;
		}

		var artistsArray = data.tracks.items[0].album.artists;

		//Array to hold artist names, when more than one artist exists for a song.
		var artistsNames = [];  

		//Pushes artists for track to array. 
		for (var i = 0; i < artistsArray.length ; i++){
			artistsNames.push(artistsArray[i].name);
		}

		// Converts artists array to a string
		var artists = artistsNames.join(", "); 

		// Prints the artist(s), track name, preview url, and album name.
		console.log("Artist(s): " + artists);
		console.log("Song : " + data.tracks.items[0].name);
		console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url)
		console.log("Album Name: " + data.tracks.items[0].album.name);

		fs.appendFile ('log.txt', "Artist(s): " + artist);
					
				});
			};
		})

//============================================================================================
	function myMovies(){

 	var movieTitle; 
	

		var queryURL = 'http://www.omdbapi.com/?t='+ movieTitle + '&y=&plot=short&tomatoes=true&r=json'; 
		request(queryURL, function (error, response, body){
	

		if(!error && response.statusCode === 200) {

		//Parses the body of the side and recovers movie info.
		var movie = JSON.parse(body); 
		console.log(movie);

		//Prints out movie info. 
		console.log("Movie Title: " + movie.Title);
		console.log("Release Year: " + movie.Year);
		console.log("IMDB Rating: " + movie.imdbRating);
		console.log("Country Produced In: " + movie.Country);
		console.log("Language: " + movie.Language);
		console.log("Plot: " + movie.Plot);
		console.log("Actors: " + movie.Actors);
		console.log("Rotten Tomatoes URL:" + movie.tomatoURL);


		}
	});
};

//====================================================================================================

//Final option aka surprise 
function doWhatItSays(){
	//reads the infomation from the random.txt file to get the information needed 
	fs.readFile("random.txt", "utf-8", function(err,random_txt){

	//splits the data by comma so first part can be accessed 
	var ran_txt = random_txt.split(',');
	var func = ran_txt[0];
	var param= ran_txt[1]; 

	console.log ("Param:", param); 

	switch (func) {
		case 	"my tweets": 
				myTwitter();
		break;

		case "song info": 
			mySpotify(param);
		break;

		case "movie info": 
			myMovies(param);
		break;

		
	}
	});
 	}