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
    el: '.cards-container',
    template: _.template('<div class="card">\n' +
        '        <img src="<%= flagURL %>" alt="flag"/>\n' +
        '        <div class="info">\n' +
        '            <h3>Greece</h3>\n' +
        '            <hr/>\n' +
        '            <p><strong>Capital:</strong> <%= capital %></p>\n' +
        '            <p><strong>Subregion:</strong> <%= subregion %></p>\n' +
        '            <p><strong>Region:</strong> <%= region %></p>\n' +
        '            <p><strong>Population:</strong> <%= population %></p>\n' +
        '        </div>\n' +
        '    </div>'),
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
        this.addAll();
        return this;
    },
    addAll: function() {
        this.collection.each(this.addOne, this);
    },
    addOne: function(model) {
        this.$el.append(this.template(model.toJSON()));
    }
});

new CountriesView();