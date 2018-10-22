
export function requireWaypointImgs(walkName) {

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