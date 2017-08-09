define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor(ws) {
			this.ws = ws;
			this.data = [];
		},
		get(id) {
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == id) {
					if (!this.data[i].complete) {
						var def = new Deferred();
						this.ws.getDetailedProject(id).then(lang.hitch(this, 'gotDetailedProject', def), lang.hitch(this, 'reportError', def))
						return def;
					} else {
						return this.data[i];
					}
				}
			}
		},
		query(query) {
			var def = new Deferred();
			if (query.short) {
				this.ws.getListOfProjects().then(lang.hitch(this, 'gotListOfProjects', def), lang.hitch(this, 'reportError', def))
			} else {
				this.ws.getProjects().then(lang.hitch(this, 'gotProjects', def), lang.hitch(this, 'reportError', def))
			}
			return def
		},
		gotListOfProjects(def, list) {
			this.data = []
			for (var item in list) {
				this.data.push({
					id: item,
					name: list[item],
					complete: false
				})
			}
			def.resolve(this.data)
		},
		gotProjects(def, list) {
			def.resolve(list);
		},
		gotDetailedProject(def, proj) {
			proj.complete = true;
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == proj.id) {
					this.data[i] = proj
					def.resolve(this.data[i])
				}
			}
		},
		reportError(def) {
			def.reject('not found')
		}
	})
})