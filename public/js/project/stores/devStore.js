define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor(ws) {
			this.ws = ws
			console.log(this.data)
		},
		get(id) {
			var def = new Deferred()
			this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError', def))
			return def
		},
		query(ids) {
			console.log('this is the devStore', this)
			this.data = []
			var def = new Deferred()

			for (var i = 0; i < ids.length; i++) {
				// var parentProject === proj ? proj : null
				this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def, ids.length), lang.hitch(this, 'reportError', def))
			}

			return def
		},
		add(dev) {
			console.log(dev)
			var def = new Deferred()
			this.ws.addDevelopment(dev).then(lang.hitch(this, 'devAdded', def), lang.hitch(this, 'reportError', def))
			return def
		},
		remove(projId, devId) {
			console.log(projId, devId)
			if (window.confirm('Voulez-vous vraiment supprimer ce développement ?')) {
				var def = new Deferred()
				this.ws.removeDevelopmentFromProject(projId, devId).then(lang.hitch(this, 'devDeleted', def), lang.hitch(this, 'reportError', def))
				return def
			}
		},
		gotDev(def, dev) {
			def.resolve(dev)
		},
		gotDevs(def, nb, dev) {
			this.data.push(dev)
			if (this.data.length === nb) {
				def.resolve(this.data)
			}
		},
		devAdded(def, res) {
			console.log(def.resolve(res))
			def.resolve(res)
		},
		devDeleted(def, dev) {
			console.log('Suppression du développement ', dev)
			def.resolve(dev)
		},
		reportError(def) {
			def.reject('not found')
		}
	})
})