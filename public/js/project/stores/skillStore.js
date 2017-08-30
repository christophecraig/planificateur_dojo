define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
    return declare(Store, {
      constructor(ws) {
        this.ws = ws
        this.data = null
      },
      query() {
        var def = new Deferred()
        this.ws.getSkills().then(lang.hitch(this, 'gotSkills', def), lang.hitch(this, 'reportError'))
        return def
      },
      put() {
        var def = new Deferred()
        this.ws.editCustomer().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
        return def
      },
      add(id, data) {
        var def = new Deferred()
        this.ws.addSkill({
          id: id,
          name: data.name,
          parentSkillId: data.parentSkillId
        }).then(lang.hitch(this, 'skillAdded'), lang.hitch(this, 'reportError'))
        return def
      },
      gotSkills(def, res) {
        def.resolve(res)
      },
      modifiedSkill(def, res) {
        def.resolve(res)
      },
      skillAdded(def, res) {
        def.resolve(res)
      },
      reportError(def) {
        def.reject('not found')
      }
    })
  })