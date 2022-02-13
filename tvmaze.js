/** Given a query string, return array of matching shows:
 *     { id, name, summary, image, episodesUrl }
 */
async function searchShows(query) {
	const res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } });
	const defaultImg = 'https://tinyurl.com/tv-missing';
	let shows = [];
	for (let i of res.data) {
		shows.push({
			id: i.show.id,
			name: i.show.name,
			summary: i.show.summary,
			episodeURL: `${i.show.url}/episodes`,
			image: i.show.image ? i.show.image.original : defaultImg
		});
	}
	return shows;
}
/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();
	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#episodeModal">Show Episodes</button>
         </div>
       </div>
      `
		);
		$showsList.append($item);
	}
}
//Populate episodes for given show list; append to bottom of HTML page
// function populateEpisodes(episodeList) {
// 	const $episodesList = $('#episodes-list');
// 	$episodesList.html('');
// 	for (let episode of episodeList) {
// 		let $episodes = $(
// 			`<li class="col-auto">Season ${episode.season}, Episode ${episode.number}: ${episode.name}</li>`
// 		);
// 		$episodesList.append($episodes);
// 	}
// 	$('#episodes-area').show();
// }

//populate episodes for given show: pop up into modal
function populateEpisodes(episodeList) {
	$('.modal-body').html('');
	for (let episode of episodeList) {
		$('.modal-body').append(`<p>Season ${episode.season}, episode ${episode.number}: <b>${episode.name}</b></p>`);
	}
}

//button handler for listing episodes of each show
$('#shows-list').on('click', '.btn', async function(e) {
	let $id = $(e.target).parent().data('show-id');
	let arr = await getEpisodes($id);
	populateEpisodes(arr);
});
/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();
	let query = $('#search-query').val();
	if (!query) return;
	$('#episodes-area').hide();
	let shows = await searchShows(query);
	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	let episodeList = res.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number
	}));
	return episodeList;
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
}
