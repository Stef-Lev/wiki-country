const Country = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        id: '',
        name: '',
        subregion: '',
        region: '',
        population: '',
        flagURL: ''
    }
});

const Countries = Backbone.Collection.extend({
    url: 'https://restcountries.com/v2/all',
    model: Country,
    parse: function(response) {
        let self = this;
        _.each(response, function(item, index){
            let country = new self.model();
            country.set('_id', index);
            country.set('name', item.name);
            country.set('capital', item.capital);
            country.set('subregion', item.subregion);
            country.set('region', item.region);
            country.set('population', item.population);
            country.set('flagURL', item.flags.svg);
            self.push(country)
        })
        return this.models;
    }
});

const CountriesView = Backbone.View.extend({
    el: '#container',
    model: new Country(),
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection = new Countries();
        this.model.view = this;
        this.collection.fetch({
            success: this.render
        });
    },
    render: function() {
        this.$el.empty();
        return this;
    }
});

new CountriesView();