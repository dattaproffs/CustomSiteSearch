var customSiteSearch = (function () {

	var _backdropEl, _searchField, _resultsUl, _loader;
	var _currentSearch = {};
	var firstTime = true;
	var _settings = {
        apiKey: 'AIzaSyAGo4_uNuY5GO0dQrOotb4y_WbRtIMpLqQ', //Required
        searchEngineId:'009217477393466868233:i5scrqug9fy', //Required
		button: 'open-css',
		placeholder: 'Search site',
		background: '#f6f6f6;',
		backgroundOpacity: '100',
		animate: { open: 'slideInDown', close: 'slideOutUp' }, //Requires animate.css https://github.com/daneden/animate.css
		searchUrl: 'https://www.googleapis.com/customsearch/v1?key=[[apiKey]]&cx=[[searchEngineId]]&q='
	};


	//*************************************
	//         PRIVATE METHODS
	//*************************************

	//init
	function init(options) {
		extend(_settings, _settings, options);
		console.log(_settings.searchUrl);
		_settings.searchUrl =  _settings.searchUrl.replace('[[apiKey]]', _settings.apiKey).replace('[[searchEngineId]]', _settings.searchEngineId);
		console.log(_settings.searchUrl);
		bindOpenEvent();
	}

	function bindOpenEvent() {
		var btn = document.getElementById(_settings.button);
		btn.addEventListener('click', openSearch);
	}


	function openSearch(e) {
		e.preventDefault();
		if (_backdropEl instanceof Element) {
			if (_settings.animate.open && _settings.animate.close) {
				_backdropEl.className = _backdropEl.className.replace(_settings.animate.close, _settings.animate.open);
			} else {
				document.body.style.overflowY = 'hidden';
				_backdropEl.style.overflowY = 'scroll';
				_backdropEl.style.display = 'block';
			}
		} else {
			_backdropEl = createBackdrop();
			var search = createSearch();
			_backdropEl.appendChild(search);

			document.body.appendChild(_backdropEl);
		}
	}

	function closeSearch() {
		_searchField.value = '';

		if (_settings.animate.open && _settings.animate.close) {
			_backdropEl.className = _backdropEl.className.replace(_settings.animate.open, _settings.animate.close);
		} else {
			document.body.style.overflowY = 'scroll';
			_backdropEl.style.overflowY = 'hidden';
			_backdropEl.style.display = 'none';
		}
		hideLoader();
	}

	function makeSearch(searchString, userSearch) {
		clearPreviusResults();
		showLoader();
		console.log(_settings.searchUrl + searchString);
		var request = new XMLHttpRequest();
		request.open('GET', _settings.searchUrl + searchString, true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				_currentSearch = JSON.parse(request.responseText);
				console.log(_currentSearch);
				renderSearchResults(_currentSearch, searchString, userSearch);
			} else {
				alert('Sorry an error occured, status: ', request.status);
			}
		};

		request.onerror = function () {
			alert('Sorry an error occured, try again.');
		};

		request.send();

	}

	function clearPreviusResults() {
		while (_resultsUl.hasChildNodes()) {
			_resultsUl.removeChild(_resultsUl.lastChild);
		}
	}

	function showLoader() {
		_loader.style.display = 'block';
	}
	function hideLoader() {
		_loader.style.display = 'none';
	}

	function renderSearchResults(searchData, searchString) {
		hideLoader();

		var results = searchData.items;

		for (var i = 0; i < results.length; i++) {

			var liToAdd = document.createElement('li'),
                header = document.createElement('h3'),
				headerLink = document.createElement('a'),
                text = document.createElement('p'),
                current = results[i];

			liToAdd.className = 'css-result-item';

			headerLink.href = current.link;
			headerLink.innerText = unescape(current.title);
			header.appendChild(headerLink);
			text.innerText = unescape(current.snippet);

			liToAdd.appendChild(header);
			liToAdd.appendChild(text);

			_resultsUl.appendChild(liToAdd);
		}
	}


	//*************************************
	//         CREATE ELEMENTS
	//*************************************

	//Create backdrop
	function createBackdrop() {
		var drop = document.createElement('div'),
			loader = document.createElement('div'),
			loaderItem1 = document.createElement('div'),
			loaderItem2 = document.createElement('div'),
			loaderItem3 = document.createElement('div'),
			closebutton = document.createElement('div');
		var bg = convertHex(_settings.background, _settings.backgroundOpacity);
		drop.className = 'css-backdrop';
		drop.id = 'css-backdrop';
		drop.style.background = bg;
		//Loader
		loader.className = 'loader';
		loaderItem1.className = 'loader-item-1';
		loaderItem2.className = 'loader-item-2';
		loaderItem3.className = 'loader-item-3';
		loader.appendChild(loaderItem1);
		loader.appendChild(loaderItem2);
		loader.appendChild(loaderItem3);
        _loader = loader;


		closebutton.className = 'css-close';
		closebutton.addEventListener('click', closeSearch);
        drop.appendChild(closebutton);
		drop.appendChild(loader);
		_backdropEl = drop;
		//Requires animate.css https://github.com/daneden/animate.css
		if (_settings.animate.open && _settings.animate.close) {
			drop.className += ' animated ' + _settings.animate.open;
			//Callback on animationend only if animation is active
			PrefixedEvent(drop, 'animationend', function (e) {
				if (e.animationName === _settings.animate.open) {
					//Runs when open animation is done
				} else if (e.animationName === _settings.animate.close) {
                    //Runs when close animation is done
				}

			});
			//Callback on animationstart only if animation is active
			PrefixedEvent(drop, 'animationstart', function (e) {
				if (e.animationName === _settings.animate.close) {
                    //Runs when open animation is started
					document.body.style.overflowY = 'scroll';
					_backdropEl.style.overflowY = 'hidden';
				} else if (e.animationName === _settings.animate.open) {
                    //Runs when close animation is started
					document.body.style.overflowY = 'hidden';
					_backdropEl.style.overflowY = 'scroll';
				}

			});
		} else {
			drop.style.display = 'block';
		}

		return drop;
	}
	//Create search
	function createSearch() {
		
		var sinput = document.createElement('input');
		sinput.autofocus = true;
		sinput.type = 'text';
		sinput.placeholder = _settings.placeholder;
		sinput.addEventListener('keypress', function (e) {
			var key = e.which || e.key;
			if (key === 13) {
				makeSearch(sinput.value);
			}
		});
		_searchField = sinput;

		var ul = document.createElement('ul');
		ul.id = 'css-results';
		_resultsUl = ul;
		

		var swrapper = document.createElement('div');
		swrapper.className = 'css-search-wrapper';
		swrapper.appendChild(sinput);
        swrapper.appendChild(ul);

		return swrapper;
	}




	//*************************************
	//               UTILS
	//*************************************
	function convertHex(hex, opacity) {
		hex = hex.replace('#', '');
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);

		return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
	}

	var pfx = ["webkit", "moz", "MS", "o", ""];
	function PrefixedEvent(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.addEventListener(pfx[p] + type, callback, false);
		}
	}

	function shortenBody(bodyStr) {
		return bodyStr.substring(0, secondApperance(bodyStr, '</p>')).replace(/<[^>]+>/ig, '');
	}

	function secondApperance(str, delimiter) {
		return str.indexOf(delimiter, str.indexOf(delimiter) + 1);
	}

	//Extend settings
	function extend() {
		for (var i = 1; i < arguments.length; i++)
			for (var key in arguments[i])
				if (arguments[i].hasOwnProperty(key) && key !== 'url')
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	}


	//*************************************
	// PUBLIC POINTERS TO PRIVATE METHODS
	//*************************************
	return {
		init: init,
		open: openSearch
	};


})();