const app = new Vue({
	el:'#app',
	data: {
		search:'',
		searching:false,
		results:null,
		start:1,
		showPrevious: false, 
		showNext: false
	},
	created() {
		let params = new URLSearchParams(window.location.search);
		let passedInSearch = params.get('search');
		if(passedInSearch) {
			this.search = passedInSearch;
			this.doSearch();
		}
	},
	methods: {
		async doSearch() {
			if(this.search === '') return;
			this.searching = true;
			this.results = null;
			this.showPrevious = false;
			this.showNext = false;
			let resp = await fetch(`/.netlify/functions/search?query=${encodeURIComponent(this.search)}&start=${this.start}`);
			let data = await resp.json();

			this.searching = false;
			this.results = data.items;
			// pagination:
			if(this.start > 10) {
				this.showPrevious = true;
			}
			if(data.info.totalResults > this.start + 10 && (this.start + 10 <= 91)) {
				this.showNext = true;
			}
		},
		doPrevious() {
			this.start -= 10;
			this.doSearch();
		}, 
		doNext() {
			this.start += 10;
			this.doSearch();
		}
	}
});