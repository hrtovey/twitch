var t,
TwitchList = {
	settings: {
		twitchOnline: document.getElementById("twitch-online"),
		twitchOffline: document.getElementById("twitch-offline"),
		showAll: document.getElementById("show-all"),
		showOnline: document.getElementById("show-online"),
		showOffline: document.getElementById("show-offline"),
		onlineList: document.getElementById("online-list"),
		offlineList: document.getElementById("offline-list"),
		twitchUsers: {
			'freecodecamp': {},
			'geekandsundry': {},
			'brunofin': {},
			'comster404': {},
			'femfreq': {},
			'automaticjak': {},
			'feliciaday': {},
			'fatbosstv': {},
			'terakilobyte': {}
		}
	},

	init: function() {
		t = TwitchList.settings;
		TwitchList.bindUIActions();
		TwitchList.createList(t.twitchUsers);



		t.animationEvent = TwitchList.whichAnimationEvent();
		t.onlineList.addEventListener(t.animationEvent, TwitchList.removeFading);

		t.animationEvent = TwitchList.whichAnimationEvent();
		t.offlineList.addEventListener(t.animationEvent, TwitchList.removeFading);
	},

	bindUIActions: function() {

		t.showAll.addEventListener("click", function() {
			TwitchList.showAll();
		})

		t.showOnline.onclick = function() {
			TwitchList.showOnline(t.showOnline);
		};

		t.showOffline.onclick = function() {
			TwitchList.showOffline(t.showOffline);
		};
	},

	createList: function(userList) {
		for (user in userList) {
			TwitchList.requestData(user);
		}
		
	},

	requestData: function(user) {
		var request = new XMLHttpRequest();
		request.open('GET', 'https://api.twitch.tv/kraken/streams/' + user, true);
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		   	var data = JSON.parse(request.responseText);
		   	TwitchList.addStreamInfo(data, user);
		} else {
				var twitchUser = t.twitchUsers[user];
		   		twitchUser.status = "This username does not exist.";
		   		twitchUser.logo = "img/dead_glitch.png";
				twitchUser.display_name = user;
				twitchUser.url = "http://twitch.tv";
		   		TwitchList.appendData(twitchUser);
		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		};

		request.send();
		
	},

	requestChannelData: function(user) {
		var request = new XMLHttpRequest();
		request.open('GET', 'https://api.twitch.tv/kraken/channels/' + user, true);
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		   	var data = JSON.parse(request.responseText);
		   	TwitchList.addChannelInfo(data, user);
		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		};

		request.send();
		
	},

	addStreamInfo: function(data, user) {
		var twitchUser = t.twitchUsers[user];
		if (data.stream === null) {
			twitchUser.status = "Not currently streaming...";
			TwitchList.requestChannelData(user);
		} else {
			twitchUser.logo = TwitchList.doesLogoExist(data.stream.channel.logo);
			twitchUser.display_name = data.stream.channel.display_name;
			twitchUser.url = data.stream.channel.url;
			twitchUser.status = data.stream.channel.status;
			TwitchList.appendData(twitchUser);
		}
	},

	addChannelInfo: function(data, user) {
		var twitchUser = t.twitchUsers[user];
		twitchUser.logo = TwitchList.doesLogoExist(data.logo);
		twitchUser.display_name = data.display_name;
		twitchUser.url = data.url;


		TwitchList.appendData(twitchUser);
	},

	doesLogoExist: function(logo) {
		var twitchLogo;
		if (logo !== null) {
			twitchLogo = logo;
		} else {
			twitchLogo = "img/twitch.png";
		}

		return twitchLogo;
	},

	appendData: function(user) {
		var item = document.createElement('li');
		item.innerHTML = "<a class='status-link' href=" + user.url + "><div class='user-container waves-light waves-effect btn'><img class='user-img' alt='Avatar of " + user.display_name + "' src=" + user.logo + "><h2 class='username'>" + user.display_name + "</h2><p class='status'>" + user.status + "</p></div></a>";
		item.className += "twitch-user animated fadeInUp";
		

		if (user.status === "Not currently streaming...") {
			t.twitchOffline.insertBefore(item, t.twitchOffline.firstChild);
		} else if (user.status === "This username does not exist.") {
			t.twitchOffline.appendChild(item);
		} else {
			t.twitchOnline.appendChild(item);
		}
	},

	addClass: function(element, addedClass) {
		if (element.classList) {
		  element.classList.add(addedClass);
		}
		else {
		  element.className += ' ' + addedClass;
		}
	},

	removeClass: function(element, removedClass) {
		if (element.classList) {
		  element.classList.remove(removedClass);
		}
		else {
		  element.className = element.className.replace(new RegExp('(^|\\b)' + removedClass.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	showAll: function() {

		TwitchList.addClass(t.onlineList, "fadeInUp");
		TwitchList.addClass(t.offlineList, "fadeInUp");

		TwitchList.removeClass(t.onlineList, "hide");
		TwitchList.removeClass(t.offlineList, "hide");

		t.animationEvent = TwitchList.whichAnimationEvent();
		t.onlineList.addEventListener(t.animationEvent, TwitchList.removeFading);

		t.animationEvent = TwitchList.whichAnimationEvent();
		t.offlineList.addEventListener(t.animationEvent, TwitchList.removeFading);
		
	},

	showOnline: function() {
		TwitchList.addClass(t.onlineList, "fadeInUp");

		TwitchList.removeClass(t.offlineList, "fadeInUp");

		TwitchList.removeClass(t.onlineList, "hide");
		TwitchList.addClass(t.offlineList, "hide");

		t.animationEvent = TwitchList.whichAnimationEvent();
		t.onlineList.addEventListener(t.animationEvent, TwitchList.removeFading);
	},

	showOffline: function() {
		TwitchList.addClass(t.offlineList, "fadeInUp");

		TwitchList.removeClass(t.onlineList, "fadeInUp");

		TwitchList.removeClass(t.offlineList, "hide");
		TwitchList.addClass(t.onlineList, "hide");

		t.animationEvent = TwitchList.whichAnimationEvent();
		t.offlineList.addEventListener(t.animationEvent, TwitchList.removeFading);

	},

	whichAnimationEvent: function() {
	    var t;
	    var el = document.createElement('fakeelement');
	    var animations = {
	      'animation':'animationend',
	      'OAnimation':'oAnimationEnd',
	      'MozAnimation':'animationend',
	      'WebkitAnimation':'webkitAnimationEnd'
	    }

	    for(t in animations){
	        if( el.style[t] !== undefined ){
	            return animations[t];
	        }
	    }

	},

	removeFading: function() {
		this.removeEventListener(t.animationEvent, TwitchList.removeFading);
		TwitchList.removeClass(this, "fadeInUp");
	}


}



function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(TwitchList.init);