// This script connects to the newsapi.org API, pulls articles from each specified news source, then displays an article list on the Feedr Readr.

// newsapi.org credentials
var newsAPIEndpoint = 'https://newsapi.org/v1/articles';
var newsAPIKey = '&apiKey=1408a019950b41b08b15fbaf6f273de8';

// create array of news sources
var newsSourceArray = [];

// create news source object
var newsSourceObj =  function (newsSourceTitle, newsSource) {
	this.newsSourceTitle = newsSourceTitle;
	this.newsSource = newsSource;
	newsSourceArray.push(this);
};

// news source #1 - Tech Crunch
var newsSource1 = new newsSourceObj ('tech crunch', '?source=techcrunch');

// news source #2 - The Verge
var newsSource2 = new newsSourceObj ('the verge', '?source=the-verge');

// news source #3 - The Next Web
var newsSource3 = new newsSourceObj ('the next web', '?source=the-next-web');

//populate News Sources drop-down menu from news sources array
$(function() {
	for (k = 0; k < newsSourceArray.length; k++) {
		var newsSourceLi = $('<li class="newsSource">');
		var newsSourceA = $('<a>');
		$(newsSourceLi).append(newsSourceA);
		$(newsSourceA).text(newsSourceArray[k].newsSourceTitle);
		$("#newsSourcesMenu").append(newsSourceLi);
	}
});

// set the articles list when a news source in the drop-down menu is clicked on
$(document).on("click", ".newsSource", function() {
	var newsSourceIndex = $(".newsSource").index(this);
	getNewsAPIData (newsSourceIndex);
});

// get articles from the news sources via the newsapi.org API
function getNewsAPIData (newsSourceIndex) {

	// clear #recent_articles
	$("#recent_articles").empty();

	// set the number of news sources
	if (newsSourceIndex == undefined) {
		numberNewsSources = newsSourceArray.length;
	} else {
		numberNewsSources = 1;
	}

	// run this loop for each news source
	for (var i = 0; i < numberNewsSources; i++) {

		// construct API endpoint
		if (newsSourceIndex == undefined) {
			var newsAPIUrl = newsAPIEndpoint + newsSourceArray[i].newsSource + newsAPIKey;
			getArticles(i);
		} else {
			var newsAPIUrl = newsAPIEndpoint + newsSourceArray[newsSourceIndex].newsSource + newsAPIKey;
			getArticles(newsSourceIndex);
		}

		function getArticles(outerCount){

			// API call
			$.get(newsAPIUrl, function (newsResults) {

				// Check the data back from the API
				console.log(newsResults);

				// number of articles per source
				var articleCount = 2;

				// get 2 articles, add them as objects to the news article array and build them in the DOM
				for (j = 0; j < articleCount; j++) {

					console.log(outerCount);

					// current article in the article array
					var currentArticle = newsResults.articles[j];

					var domArticle = $(

						'   <div class="col-sm-4 article-snippet" id="' + outerCount + "_" + j + '">' +
						'	   <h6>' + newsSourceArray[outerCount].newsSourceTitle + '</h6>' +
						'	   <img class="img-responsive" src="' + currentArticle.urlToImage +'" alt="' + currentArticle.description + '">' +
						'	   <h3>' + currentArticle.title + '</h3>' +
						'	   <p>' + currentArticle.description + '</p>' +
						'	   <button type="button" class="btn btn-primary btn-modal" data-toggle="modal" data-target="#articleModal">Read more</button>' +
						'	   <a class="btn btn-primary btn-modal fullArticle" href="' + currentArticle.url + '" target="_blank">Full article</a>' +
						'   </div>'
					);

					$("#recent_articles").append(domArticle);
				}
			}); 
		}
	}
};

// initialize page with all news sources
getNewsAPIData ();

// open article info modal when "Read more" button is clicked
function articleModal (selector) {

	var articleModalLabel = $(selector).parent().find('h3').clone();
	var articleImage = $(selector).parent().find('img').clone();
	var articleDescription = $(selector).parent().find('p').clone();
	var articleFullButton = $(selector).parent().find('button').clone();

	// updated these lines to use '.html' instead or '.replaceWith' - when I did replace, I lost the ids I was targeting!
	$( "#articleModalLabel" ).html(articleModalLabel);
	$( "#articleImage" ).html(articleImage);
	$( "#articleDescription" ).html(articleDescription);
	$( "#fullArticle" ).html(articleFullButton);
}

$(document).on("click", ".btn-modal", function() {

	articleModal(this);
	console.log('Button clicked.');
});