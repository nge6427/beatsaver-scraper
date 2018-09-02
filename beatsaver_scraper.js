var db = {};
var newScrape = !Object.keys(db).length;

function sortToTsv(obj) {
	var arr = [];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			arr.push([key, obj[key]]);

	sortable.sort((a, b) => {
		return a[1].toLowerCase() < b[1].toLowerCase() ? -1 : 1;
	});

	var string = "id\tname\n";
	arr.forEach((song) => {
		string += song[0] + "\t" + song[1] + "\thttps://beatsaver.com/index.php/download/" + song[0] + "\n";
	})

	return string;
}

function downloadTsv(string) {
	var a = document.createElement('a');
	var file = new Blob([string.toString()], { type: 'text/tab-separated-values' });
	a.href = URL.createObjectURL(file);
	a.download = 'songs.tsv';
	a.click();
}

function scrape(offset) {
	if(!offset) offset = 0;
	$.get("https://beatsaver.com/browse/newest/" + offset, (data) => {
		var dbSize = Object.keys(db).length;
		var entries = $(data).find("a").has("h2").length;
		if(entries) {
			$(data).find("a").has("h2").each((index) => {
				db[$(this).attr("href").replace(/^.*\//,"")] = $(this).text();
			});
			var newSize = Object.keys(db).length
			console.log(newSize);
			offset += entries;

			if(newScrape || newSize == dbSize + entries) {
				scrape(offset);
			}
		}
	});
	newScrape = false;
}

downloadTsv(sortToTsv(scrape()));
