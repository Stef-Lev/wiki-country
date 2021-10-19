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
    el: '.content',
    template: _.template('<div class="card">\n' +
        '        <div class="img-container">\n' +
        '           <img src="<%= flagURL %>" alt="flag"/>\n' +
        '        </div>\n' +
        '        <div class="info">\n' +
        '            <h3><%= name %></h3>\n' +
        '            <hr/>\n' +
        '            <p><strong>Capital:</strong> <%= capital %></p>\n' +
        '            <p><strong>Subregion:</strong> <%= subregion %></p>\n' +
        '            <p><strong>Region:</strong> <%= region %></p>\n' +
        '            <p><strong>Population:</strong> <%= population %></p>\n' +
        '        </div>\n' +
        '    </div>'),
    model: new Country(),
    events: {
        "click .default_option": "openDropdown",
        "click .select_ul li": "applyFilter",
        "click #top-arrow": "scrollTop"
    },
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection = new Countries();
        this.model.view = this;
        this.collection.fetch({
            success: this.render
        });
    },
    render: function() {
        $('.cards-container').empty();
        this.addAll();
        return this;
    },
    addAll: function() {
        console.log('THIS COLLECTION', this.collection)
        this.collection.each(this.addOne, this);
    },
    addOne: function(model) {
        $('.cards-container').append(this.template(model.toJSON()));
    },
    openDropdown: function(e) {
        $(e.currentTarget).parent().toggleClass("active")
    },
    applyFilter: function(e) {
        let self = this;
        let currentEl = $(e.currentTarget).html();
        $(".default_option li").html(currentEl);
        let innerValue = $.trim($(".default_option li").text())
        $(e.currentTarget).parents(".select_wrap").removeClass("active");
        let filteredCountries = this.collection.filter(function (item) {
            return item.get("region") === innerValue;
        });
        $('.cards-container').empty();
        _.each(filteredCountries, function(model){
            $('.cards-container').append(self.template(model.toJSON()));
        }, self);
    },
    scrollTop: function() {
        console.log('TOP')
        console.log(window);
        $(window).scrollTop(0);
    }
});

new CountriesView();