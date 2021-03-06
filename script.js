
    $(document).ready(function() {

      
        var applicationID = 'BK7ZL22IDB';
        var apiKey = '8013722c2c8496548323eb41d04d39e3';
        var indexName = 'dev_RESTAURANTS';
        var client = algoliasearch(applicationID, apiKey);
        var helper = algoliasearchHelper(client, indexName, {facets: ["food_type", "stars_count", "payment_options", ],hitsPerPage: 5, maxValuesPerFacet: 4, aroundPrecision: 100, aroundLatLngViaIP: true});
        var currentPageHits = 5;
        var $box = $("#search-box");
        var $facets = $('#facet-list');
        var $showMore = $('#loadMore');


        // display something on response
        helper.on('result', function(content) {
          console.log(content);
          renderFacetList($facets, content);
          renderHits(content);
        });

        $facets.on('click', handleFacetClick);
        $('.stargroup').on('click', handleRatingClick);

        function renderHits(content) {
          $('#container').html(function() {
            return $.map(content.hits, function(hit) {

              return `<div class="row">
                        <div class="col l2 s12 img-wrap">
                          <img class="responsive-img" src="${hit.image_url}"/>
                        </div>
                        <div class="col s12 l8">
                          <h5>${hit._highlightResult.name.value}</h5>
                          <div>
                            <span class="stars">${hit.stars_count}</span>
                            <div class="star-ratings-sprite">
                              <span style="width: ${(hit.stars_count/5 * 100)}%" class="star-ratings-sprite-rating"></span>
                            </div>
                            <span class="light-gray-text"> (${hit.reviews_count} reviews)</span>
                          </div>
                        <div> ${hit.food_type} | ${hit.neighborhood} | ${hit.price_range}</div>`;
            });
          });

          $("#resultstat").html(function(){
            var seconds = content.processingTimeMS / 1000;
            return `<h5>${content.nbHits} results found <span class="light-gray-text">in ${seconds} seconds</span></h5>`;
          });
        }


        function renderFacetList($facets, content) {
          var facets = content.facets.map(function(facet){
            var displayNames = {food_type: "Cuisine/ Food Type", stars_count: 'Star Rating', payment_options: "Payment Options"};
            var name = facet.name;
            var header = `<h5>${displayNames[name]}</h5`;
            var facetValues = content.getFacetValues(name);
            var facetvaluesList = $.map(facetValues, function(oneFacet){
              var fvClass = oneFacet.isRefined ? 'active' : '';
              var fvItem = `<a data-attribute="${name}" data-value="${oneFacet.name}" href="#">${oneFacet.name}<span class="facet-count">${oneFacet.count}</span> </a>`;
              return `<div class="item ${fvClass}">${fvItem}</div>`;
            });
            return `${header}<div>${facetvaluesList.join('')}</div>`;
          });
          $facets.html(facets.join(''));
        }

        function handleFacetClick(e) {
          e.preventDefault();
          var target = e.target;
          var attribute = target.dataset.attribute;
          console.log(target);
          console.log(attribute);
          var value = target.dataset.value;
          if(!attribute || !value) return;
          helper.toggleRefine(attribute, value).search();
        }

        function handleRatingClick(e) {
          e.preventDefault();
          var target = e.target;
          var attribute = target.dataset.attribute;
          console.log(target);
          console.log(attribute);
          var upperBound = target.dataset.upperBound;
          var lowerBound = target.dataset.lowerBound;

          helper.addNumericRefinement(attribute,">=", lowerBound).addNumericRefinement(attribute, '<=', upperBound).search();
        }

        // search when something is typed
        $box.on('keyup',function() {
          helper.setQuery($(this).val())
                .search();
        });
        // add 5 more results on show more click 
        $showMore.on('click', function(){
          currentPageHits += 5;
          helper.setQueryParameter('hitsPerPage', currentPageHits).search();
        });
        // initial search to render page 
        helper.search();
    });
