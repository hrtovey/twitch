var t,
TwitchList = {
	settings: {
		twitchList: document.getElementById("twitch-list"),
		twitchUsers: ['freecodecamp', 'geekandsundry', 'brunofin', 'comster404', 'femfreq', 'automaticjak', 'feliciaday', 'fatbosstv', 'terakilobyte'],
		currentList: []
	},

	init: function() {
		t = TwitchList.settings;
		TwitchList.bindUIActions();
		TwitchList.createList();
	},

	bindUIActions: function() {

	},

	createList: function() {
		for (user in t.twitchUsers) {
			var twitchUser = t.twitchUsers[user];
			var index = t.currentList.indexOf(t.twitchUsers[user]);

			if (index > -1) {
				TwitchList.requestData(twitchUser, 'update');
			} else {
				TwitchList.requestData(twitchUser, 'append');
			}
			
		}
		
	},

	requestData: function(user, process) {
		var request = new XMLHttpRequest();
		request.open('GET', 'https://api.twitch.tv/kraken/channels/' + user, true);
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		   	var data = JSON.parse(request.responseText);
		   	if (process === 'append') {
		   		TwitchList.appendData(data, user);
		   		console.log(data);
		   	} else if (process === 'update') {
		   		TwitchList.updateData(data);
		   	}
		   	
		  } else {
		  	if (process === 'append') {
		   		TwitchList.appendData("404", user);
		   	} else if (process === 'update') {
		   		TwitchList.updateData("404");
		   	}

		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		};

		request.send();
		
	},

	appendData: function(data, user) {
		t.currentList.push(user);
		var logo;
		var status;
		var url;

		if (data.logo !== null && data.logo !== undefined) {
			logo = data.logo;
		} else if (data.logo === undefined) {
			logo = "img/dead_glitch.png";
		} else {
			logo = "img/twitch.png";
		}

		if (data.status !== null && data.status !== undefined) {
			status = data.status;
		} else {
			status = "Currently not streaming.";
		}

		if (data.url !== null && data.url !== undefined) {
			url = data.url;
		} else {
			url = "http://twitch.tv";
		}

		if (data !== "404") {
			var item = document.createElement("li");
			item.innerHTML = "<div><img class='user-img' src=" + logo + "><h2><a href=" + url + ">" + data.display_name + "</h2></a><p class='status'>" + status + "</p></div>";
			item.className += "twitch-user";
			t.twitchList.appendChild(item);
		} else {
			var item = document.createElement("li");
			item.innerHTML = "<div><img class='user-img' src=" + logo + "><h2>" + user + "</h2></a><p>This user does not exist.</p></div>";
			item.className += "twitch-user";
			t.twitchList.appendChild(item);
		}
		

	},

	updateData: function(data) {
		console.log(data, 'update');
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