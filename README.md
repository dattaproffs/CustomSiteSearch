CustomSiteSearch with google cse
==

Introduction
--
CustomSiteSearch is a drop in custom site search javascript for your website. It uses Google cse so the results you will receive is google results.
see example here: [https://customsitesearch.azurewebsites.net](https://customsitesearch.azurewebsites.net)

Prerequisite
--
1. A Custom search engine from [Google](https://cse.google.com/cse/) 
2. Create a [API projekt](https://console.developers.google.com/iam-admin/projects)
3. Enable [Custom Search API](https://console.developers.google.com/apis/api/customsearch/overview)
4. Create [Credentials](https://console.developers.google.com/apis/credentials) create an API Key of type browser key


Usage
--
Add the the css file to your page

    <link rel="stylesheet" href="css/customsitesearch.css">
If you wan't to use the animated version you need to add Daniel Edens [animate.css](https://github.com/daneden/animate.css/)
    
    <link rel="stylesheet" href="css/animate.css">


Add the following before your `</body>` tag

    <script src="customesitesearch.js"></script>
    <script>
        customSiteSearch.init({
        apiKey: 'AIzaSyAGo4_uNuY5GO0dQrOotb4y_WbRtIMpLqQ', //Required
        searchEngineId:'009217477393466868233:i5scrqug9fy', //Required
		button: 'open-css', //optional
		placeholder: 'Search site', //optional
		background: '#f6f6f6;', //optional
		backgroundOpacity: '100', //optional
		animate: { open: 'slideInDown', close: 'slideOutUp' } //Optional butRequires animate.css https://github.com/daneden/animate.css
        });
    </script>
        
Then you create a element with the id of `open-css` or an existing element and insert the id in the button property in settings object.

Or if you wan't you can just call `customSiteSearch.open();` wherever you wan't.

TODO
==

1. Fix the formatting on the search results.
2. Fix paging of results
     


 