define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor(ws) {
			this.ws = ws
		},
		get(id) {
			var def = new Deferred()
			this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError', def))
			return def
		},
		query(ids) {
			this.data = []
			var def = new Deferred()
			for (var i = 0; i < ids.length; i++) {
				this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def, ids.length), lang.hitch(this, 'reportError', def))
			}
			return def
		},
		add(dev) {
			var def = new Deferred()
			this.ws.addDevelopment(dev).then(lang.hitch(this, 'devAdded', def), lang.hitch(this, 'reportError', def))
			return def
		},
		remove(projId, devId) {
			if (window.confirm('Voulez-vous vraiment supprimer ce développement ?')) {
				var def = new Deferred()
				this.ws.removeDevelopmentFromProject(projId, devId).then(lang.hitch(this, 'devDeleted', def), lang.hitch(this, 'reportError', def))
				return def
			} 
			console.log('suppression annulée')
		},
		gotDev(def, dev) {
			def.resolve(dev)
		},
		gotDevs(def, nb, dev) {
			console.log(dev.id)
			this.data.push(dev)
			if (this.data.length === nb) {
				def.resolve(this.data)
			}
		},
		devAdded(def, res) {
			def.resolve(res)
		},
		devDeleted(def, dev) {
			def.resolve(dev)
		},
		reportError(def) {
			def.reject('not found')
		}
	})
})