define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function(declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function(ws) {
      this.ws = ws;
      this.data = [];
    },
    get: function(id) {
      for(var i = 0; i < this.data.length; i++) {
        if(this.data[i].id == id) {
          if (!this.data[i].complete) {
            var def = new Deferred();
            this.ws.getDetailedProject(id).then(lang.hitch(this, 'gotDetailedProject', def), lang.hitch(this, 'reportError'))
            return def;
          } else {
            return this.data[i];
          }
        }
      }
    },
    query: function(query) {
      var def = new Deferred();
      if (query.short) {
        this.ws.getListOfProjects().then(lang.hitch(this, 'gotListOfProjects', def), lang.hitch(this, 'reportError'))
      } else {
        this.ws.getProjects().then(lang.hitch(this, 'gotProjects', def), lang.hitch(this, 'reportError'))
      }
      return def
    },
    gotListOfProjects: function(def, list) {
      this.data = []
      for (var item in list) {
        this.data.push({id: item, name: list[item], complete: false})
      }
      def.resolve(this.data)
    },
    gotProjects: function(def, list) {
      this.data = [];
      for (var item in list) {
        list.item.complete = true
        this.data.push(list.item)
      }
      def.resolve(this.data);
    },
    gotDetailedProject: function(def, proj) {
      proj.complete = true;
      for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].id == proj.id) {
          this.data[i] = proj
          def.resolve(this.data[i])
        } 
      }
      def.reject('not found')
    },
    reportError(err) {
      console.log(err)
    }
  })
})