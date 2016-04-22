var t,
TwitchList = {
	settings: {
		twitchList: document.getElementById("twitch-list"),
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
	},

	bindUIActions: function() {

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
		item.innerHTML = "<div><img class='user-img' src=" + user.logo + "><h2><a href=" + user.url + ">" + user.display_name + "</h2></a><p class='status'>" + user.status + "</p></div>";
		item.className += "twitch-user";
		t.twitchList.appendChild(item);

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