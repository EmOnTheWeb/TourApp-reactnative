
export function requireWaypointImgs(walkName) {

	if(walkName === "kentish_town") {

		return {
			waypoint_1: {
				img_src:'waypoint_1.png',
				title:'Regents Canal' 
			},
			waypoint_2: {
				img_src:'waypoint_2.png',
				title:'Under Quinn\'s Public House' 
			},
			waypoint_3: {
				img_src:'waypoint_3.png',
				title:'South Kentish Town Tube Station' 
			},
			waypoint_4: {
				img_src:'waypoint_4.png',
				title:'The Abbey Tavern'
			},
			waypoint_5: {
				img_src:'waypoint_5.png',
				title:'Anglers Lane'
			},
			waypoint_6: {
				img_src:'waypoint_6.png',
				title:'Public Bath House'
			},
			waypoint_7: {
				img_src:'waypoint_7.png',
				title:'Bath House Signage'
			},
			waypoint_8: {
				img_src:'waypoint_8.png',
				title:'Queen\'s Crescent Market'
			},
			waypoint_9: {
				img_src:'waypoint_9.png',
				title:'The Roundhouse'
			},
			waypoint_10: {
				img_src:'waypoint_10.png',
				title:'Primrose Hill'
			}
		}
	}




	if(walkName === "st_johns_wood") {

		return {
			waypoint_1: {
				img_src: require('../assets/imgs/Central-London.png'), 
				title: 'The Thames' 
			}
		}

	}
}


export function requireWaypointAudio(walkName) {

	if(walkName === "st_johns_wood") {
		let waypoint_1 = require('../assets/central_london/audio/waypoint_1.mp3'); 
		let waypoint_2 = require('../assets/central_london/audio/waypoint_1.mp3'); 

		return {
			waypoint_1, 
			waypoint_2
		}
	}	
}