//////////////////////// REITTIOPAS FUNCTIONS

const ReittiOpas = {

    //Function to show route explanations to user

    createRouteExplanation: (index, leg, school, isLast) => {
        var colour = '';

        //train colour missing
        switch (leg.mode) {
            case 'WALK':
                colour = '#6BA3AF';
                break;
            case 'BUS':
                colour = '#0000bf';
                break;
            case 'SUBWAY':
                colour = '#fd4f00';
                break;
            case 'TRAM':
                colour = '#009246';
                break;
            case 'FERRY':
                colour = '#f5a3c7';
                break;
            default:
                colour = '#0000bf';
                break;
        }




        if (isLast) {
            if (leg.mode === 'WALK') {

                // explanation is last the destination is named by the school were the route is heading to
                document.getElementById('route' + index).innerHTML += `<div class="row" style="height: 50px;">
                                                                            <div class="col-md-8">
                                                                                <p>${leg.mode} ${Math.round(leg.distance)} m (${moment.duration(leg.duration * 1000).minutes()} min)</p>
                                                                                <p>to ${school.name_fi}</p>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <svg height="100%" width="100%" ><line stroke-dasharray="5, 5" x1="50%" x2="50%" y1="0" y2="100%" style="stroke: ${colour};stroke-width:5" /></svg>
                                                                            </div>
                                                                       </div>
                                                                       <hr>`;
            } else {
                document.getElementById('route' + index).innerHTML += `<div class="row" style="height: 50px;">
                                                                            <div class="col-md-8">
                                                                                <p>${leg.mode} <b>${leg.trip.pattern.route.shortName}</b> ${Math.round(leg.distance)} m (${moment.duration(leg.duration * 1000).minutes()} min)</p>
                                                                                <p>to ${school.name_fi}</p>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <svg height="100%" width="100%" ><line x1="50%" x2="50%" y1="0" y2="100%" style="stroke: ${colour};stroke-width:5" /></svg>
                                                                            </div>
                                                                       </div>
                                                                       <hr>`;
            }
        } else {

            if (leg.mode === 'WALK') {
                document.getElementById('route' + index).innerHTML += `<div class="row" style="height: 128px;">
                                                                            <div class="col-md-8">
                                                                                <p>${leg.mode} ${Math.round(leg.distance)} m (${moment.duration(leg.duration * 1000).minutes()} min)</p>
                                                                                <p>to ${leg.to.name}</p>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <svg height="100%" width="100%" ><line stroke-dasharray="5, 5" x1="50%" x2="50%" y1="0" y2="100%" style="stroke: ${colour};stroke-width:5" /></svg>
                                                                            </div>
                                                                       </div>
                                                                       <hr>`;
            } else {
                document.getElementById('route' + index).innerHTML += `<div class="row" style="height: 128px;">
                                                                            <div class="col-md-8">
                                                                                <p>${leg.mode} <b>${leg.trip.pattern.route.shortName}</b> ${Math.round(leg.distance)} m (${moment.duration(leg.duration * 1000).minutes()} min)</p>
                                                                                <p>to ${leg.to.name}</p>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <svg height="100%" width="100%" ><line x1="50%" x2="50%" y1="0" y2="100%" style="stroke: ${colour};stroke-width:5" /></svg>
                                                                            </div>
                                                                       </div>
                                                                       <hr>`;
            }
        }
    },

    //function to search routes from reittiopas API

    searchingRoutes: (school) => {

        $(".routeButtons").hide();

        //Request headers are set
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open("POST", "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql/");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");


        xhr.onload = () => {

            // wen result is fetched this part invokes
            // Usually reittiopas provides three routes which are iterated here

            for (let [index, route] of xhr.response.data.plan.itineraries.entries()) {

                const duration = route.duration * 1000;

                document.getElementById('routeButton' + index).innerHTML = '';

                // route duration and total walking distance is showed to the user

                if (moment.duration(duration).hours() === 1) {
                    document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>  ' + (moment.duration(route.duration * 1000).minutes() + 60) + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                } else {
                    document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>  ' + moment.duration(route.duration * 1000).minutes() + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                }

                $("#routeButton" + index).show();

                // Check button to show route as polylines to user is added

                document.getElementById('route' + index).innerHTML = '';
                document.getElementById('route' + index).innerHTML += '<input id="showRoute' + index + '" type="checkbox" name="showRoute" class="showRouteCheckbox"><label for="showRoute' + index + '"> Show route to destination </label>';

                for (let [i, leg] of route.legs.entries()) {

                    // Route consist of legs. Each leg represesnts one part of the route (like walk, bus, subway etc..)

                    if (i === route.legs.length - 1) {

                        ReittiOpas.createRouteExplanation(index, leg, school, true);
                    } else {
                        ReittiOpas.createRouteExplanation(index, leg, school, false);
                    }

                }
                // Arrow icon is changed when route toggle button is pressed


                $("#route" + index).on("hide.bs.collapse", function() {

                    if (moment.duration(duration).hours() === 1) {
                        document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>  ' + (moment.duration(route.duration * 1000).minutes() + 60) + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                    } else {
                        document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>  ' + moment.duration(route.duration * 1000).minutes() + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                    }
  

                });
                $("#route" + index).on("show.bs.collapse", function() {

                    if (moment.duration(duration).hours() === 1) {
                        document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-up"></span>  ' + (moment.duration(route.duration * 1000).minutes() + 60) + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                    } else {
                        document.getElementById('routeButton' + index).innerHTML = '<span class="glyphicon glyphicon-chevron-up"></span>  ' + moment.duration(route.duration * 1000).minutes() + ' min  Walk: <b>' + Math.round(route.walkDistance) + '</b> m';
                    }
                    
                    
                });

                // This part handles showroute checkbox
                // when clicked route is shown in form of polylines on a map

                const showRoute = document.getElementById('showRoute' + index);

                showRoute.addEventListener('change', () => {
                    if (showRoute.checked) {
                        // Checkbox is checked..

                        //Old polylines are removed 

                        for (polyline of polylines) {
                            map.removeLayer(polyline);
                        }

                        polylines = [];


                        // Uncheckin other route checkboxes
                        for (let checkBox of document.getElementsByClassName('showRouteCheckbox')) {
                            
                            if (checkBox != showRoute) {
                                checkBox.checked = false;
                            }
                        }



                        for (encodedPolyline of route.legs) {

                            //route polylines are encoded suitable for leaflet with plugin

                            const polyline = L.Polyline.fromEncoded(encodedPolyline.legGeometry.points);

                            //Colours of polylines are defined by leg mode (walk is dashed)
                            if (encodedPolyline.mode === 'WALK') {

                                polyline.setStyle({
                                    color: '#6BA3AF',
                                    dashArray: '5'
                                });
                            } else if (encodedPolyline.mode === 'SUBWAY') {
                                polyline.setStyle({
                                    color: '#fd4f00'
                                });
                            } else if (encodedPolyline.mode === 'BUS') {
                                polyline.setStyle({
                                    color: '#0000bf'
                                });
                            } else if (encodedPolyline.mode === 'TRAM') {
                                polyline.setStyle({
                                    color: '#009246'
                                });
                            } else if (encodedPolyline.mode === 'FERRY') {
                                polyline.setStyle({
                                    color: '#f5a3c7'
                                });
                            }

                            //Polylines are added to the and to array for future removing

                            polyline.addTo(map)
                            polylines.push(polyline);

                            const group = new L.featureGroup(polylines);

                            //Map boundaries are fitted to polylines
                            map.fitBounds(group.getBounds());
                            
                        }
                    } else {
                        //If checkbox is unchecked route polylines are removed from the map

                        // Checkbox is not checked..
                        for (polyline of polylines) {
                            map.removeLayer(polyline);
                        }
                        polylines = [];
                    }
                });
            }
        }

        // Reittiopas API query string is defined here
        // Queries are placed in a form of graphQL 

        var query = `query {
  plan(
    from: {lat: ${address.lat}, lon: ${address.lon}},
    to: {lat: ${to.lat}, lon: ${to.lon}},
    modes: "BUS,TRAM,RAIL,SUBWAY,FERRY,WALK",
    walkReluctance: 2.1,
    walkBoardCost: 600,
    minTransferTime: 180,
    walkSpeed: 1.2,
  ) {
    itineraries{
      walkDistance,
      duration,
      legs {
        duration
        mode
        startTime
        endTime
        trip {
          pattern {
            headsign
            name 
            route {
              shortName
              longName
              type
              mode
              desc
            }
          }
        }
        from {
          lat
          lon
          name
          stop {
            code
            name
          }
        },
        to {
          lat
          lon
          name
          stop {
            name
          }
        },
        agency {
          id
        },
        distance
        legGeometry {
          length
          points
        }
      }
    }
  }
}`;

        xhr.send(JSON.stringify({
            query: query
        }));
    }
}