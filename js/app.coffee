Country = Backbone.Model.extend(
  idAttribute: '_id'
  defaults:
    id: ''
    name: ''
    subregion: ''
    region: ''
    population: ''
    flagURL: ''
)
Countries = Backbone.Collection.extend(
  url: 'https://restcountries.com/v2/all'
  model: Country
  parse: (response) ->
    self = this
    _.each response, (item, index) ->
      country = new (self.model)
      country.set '_id', index
      country.set 'name', item.name
      country.set 'capital', item.capital
      country.set 'subregion', item.subregion
      country.set 'region', item.region
      country.set 'population', item.population
      country.set 'flagURL', item.flags.svg
      self.push country
    @models
)
CountriesView = Backbone.View.extend(
  el: '.content'
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
    '    </div>')
  model: new Country
  events:
    "click .default_option": "openDropdown"
    "click .select_ul li": "applyFilter"
    "click #top-arrow": "scrollTop"
    "click #go": "searchFor"
    "input #search": "clearSearch"
  initialize: () ->
    _.bindAll @, 'render'
    @collection = new Countries
    @model.view = @
    @collection.fetch(
      success: @render
    )
  render: () ->
    $('.cards-container').empty()
    @addAll()
    @
  addAll: () ->
    console.log 'THIS COLLECTION', @collection
    @collection.each @addOne, @
  addOne: (model) ->
    $('.cards-container').append @template(model.toJSON())
  openDropdown: (e) ->
    $(e.currentTarget).parent().toggleClass "active"
  applyFilter: (e) ->
    self = this;
    currentEl = $(e.currentTarget).html()
    selectInput = ".default_option li"
    $(selectInput).html currentEl
    innerValue = $.trim($(selectInput).text())
    $(e.currentTarget).parents(".select_wrap").removeClass "active"
    filteredCountries = self.collection.filter((item) ->
      if innerValue == 'World'
        item.get('region') != innerValue
      else
        item.get('region') == innerValue
    )
    $('.cards-container').empty();
    console.log(filteredCountries)
    _.each filteredCountries, ((model) ->
      $('.cards-container').append self.template(model.toJSON())
    ), self
  searchFor: () ->
    inputVal = $('#search').val()
    self = this
    searchedCountries = self.collection.filter((item) ->
      countryName = item.get("name").toLowerCase()
      countryName.indexOf(inputVal.toLowerCase()) != -1
    )
    $('.cards-container').empty();
    _.each searchedCountries, ((model) ->
      $('.cards-container').append self.template(model.toJSON())
      ), self
  clearSearch: (e) ->
    if e.target.value == ''
      window.location.reload()
  scrollTop: () ->
    $(window).scrollTop 0
)
new CountriesView


