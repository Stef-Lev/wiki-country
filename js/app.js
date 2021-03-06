// Generated by CoffeeScript 2.6.1
(function() {
  var Countries, CountriesView, Country;

  Country = Backbone.Model.extend({
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

  Countries = Backbone.Collection.extend({
    url: 'https://restcountries.com/v2/all',
    model: Country,
    parse: function(response) {
      var self;
      self = this;
      _.each(response, function(item, index) {
        var country;
        country = new (self.model)();
        country.set('_id', index);
        country.set('name', item.name);
        country.set('capital', item.capital);
        country.set('subregion', item.subregion);
        country.set('region', item.region);
        country.set('population', item.population);
        country.set('flagURL', item.flags.svg);
        return self.push(country);
      });
      return this.models;
    }
  });

  CountriesView = Backbone.View.extend({
    el: '.content',
    template: _.template('<div class="card">\n' + '        <div class="img-container">\n' + '           <img src="<%= flagURL %>" alt="flag"/>\n' + '        </div>\n' + '        <div class="info">\n' + '            <h3><%= name %></h3>\n' + '            <hr/>\n' + '            <p><strong>Capital:</strong> <%= capital %></p>\n' + '            <p><strong>Subregion:</strong> <%= subregion %></p>\n' + '            <p><strong>Region:</strong> <%= region %></p>\n' + '            <p><strong>Population:</strong> <%= population %></p>\n' + '        </div>\n' + '    </div>'),
    model: new Country(),
    events: {
      "click .default_option": "openDropdown",
      "click .select_ul li": "applyFilter",
      "click #top-arrow": "scrollTop",
      "click #go": "searchFor",
      "input #search": "clearSearch"
    },
    initialize: function() {
      _.bindAll(this, 'render');
      this.collection = new Countries();
      this.model.view = this;
      return this.collection.fetch({
        success: this.render
      });
    },
    render: function() {
      $('.cards-container').empty();
      this.addAll();
      return this;
    },
    addAll: function() {
      console.log('THIS COLLECTION', this.collection);
      return this.collection.each(this.addOne, this);
    },
    addOne: function(model) {
      return $('.cards-container').append(this.template(model.toJSON()));
    },
    openDropdown: function(e) {
      return $(e.currentTarget).parent().toggleClass("active");
    },
    applyFilter: function(e) {
      var currentEl, filteredCountries, innerValue, selectInput, self;
      self = this;
      currentEl = $(e.currentTarget).html();
      selectInput = ".default_option li";
      $(selectInput).html(currentEl);
      innerValue = $.trim($(selectInput).text());
      $(e.currentTarget).parents(".select_wrap").removeClass("active");
      filteredCountries = self.collection.filter(function(item) {
        if (innerValue === 'World') {
          return item.get('region') !== innerValue;
        } else {
          return item.get('region') === innerValue;
        }
      });
      $('.cards-container').empty();
      console.log(filteredCountries);
      return _.each(filteredCountries, (function(model) {
        return $('.cards-container').append(self.template(model.toJSON()));
      }), self);
    },
    searchFor: function() {
      var inputVal, searchedCountries, self;
      inputVal = $('#search').val();
      self = this;
      searchedCountries = self.collection.filter(function(item) {
        var countryName;
        countryName = item.get("name").toLowerCase();
        return countryName.indexOf(inputVal.toLowerCase()) !== -1;
      });
      $('.cards-container').empty();
      return _.each(searchedCountries, (function(model) {
        return $('.cards-container').append(self.template(model.toJSON()));
      }), self);
    },
    clearSearch: function(e) {
      if (e.target.value === '') {
        return window.location.reload();
      }
    },
    scrollTop: function() {
      return $(window).scrollTop(0);
    }
  });

  new CountriesView();

}).call(this);
