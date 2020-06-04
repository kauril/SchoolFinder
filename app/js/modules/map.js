////////////////////// GENERAL MAP FUNCTIONS

const MapFunctions = {

    // Function to initialize the map
    // Map-styles updated 4.6.2020 test

    init: () => {
        const newMap = L.map('mapid').setView([60.1699, 24.9384], 11);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            maxZoom: 18,
            crossOrigin: null,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1Ijoia2F1cmlzIiwiYSI6ImNqdXh4cWlsZzBiaWY0ZG5yMnBtZGttbjMifQ.jWGC5H_UMpdzSjBk_Z17aQ'
        }).addTo(newMap);

        return newMap;

    },

    // Function for setting map exlanations

    setMapExplanations: (language, mapExplanations, initialInfo) => {
        switch (language) {
            case 'finnish':
                for (let element of document.getElementsByClassName('swedishExplanation')) {
                    element.style.display = 'none';
                }
                for (let element of document.getElementsByClassName('finnishExplanation ')) {
                    element.style.display = 'block';
                }
                break;
            case 'swedish':
                for (let element of document.getElementsByClassName('finnishExplanation ')) {
                    element.style.display = 'none';
                }
                for (let element of document.getElementsByClassName('swedishExplanation')) {
                    element.style.display = 'block';
                }
                break;
        }
        mapExplanations.style.display = 'block';
        initialInfo.style.display = 'none';
    },

    ////////////////       CREATING MARKERS

    // adds markers to the map, defines onclick behaviour

    addMarkers: (map, coordinates, data, type) => {

        if (typeof(data) === 'string') {

            // Creating red marker for users location

            const redIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });


            const marker = L.marker(coordinates, {
                icon: redIcon
            });

            marker.on('mouseover', (e) => {
                marker.bindPopup(data, {
                    closeButton: false
                }).openPopup();
            });

            marker.on('mouseout', (e) => {
                marker.closePopup();
            });

            markers.push(marker);

        	markersLayer.addLayer(marker);

        	markersLayer.addTo(map);

            
        } else {

            var marker;

            const yellowIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const greenIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });



            if (type === 'local') {

            	//Green icon for local school
                marker = L.marker(coordinates, {
                    icon: greenIcon
                });

                languagesToStudy.innerHTML = '';

                // Search and print languages that can be studied in selected school

                for (let id of data.ontologytree_ids) {
                   Functions.httpGetAsync('http://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/' + id, Functions.processOntologyWords);
                }

                marker.on('mouseover', (e) => {
                    marker.bindPopup('<b>Your local school: </b><br>' + data.name_fi, {
                        closeButton: false
                    }).openPopup();
                });


                localSchoolFound = true;

                //Cliking marker show details of selectedd school

                marker.on('click', (e) => {

                	// Showing routes to school

                    to.lat = data.latitude;
                    to.lon = data.longitude;
                    ReittiOpas.searchingRoutes(data);



                    // show localschool lander
                    localSchool.innerHTML = '<p>Your local school:</p>';
                    localSchool.style.display = 'block';

                    //Remowing old reittiopas polylines from the map 

                    for (polyline of polylines) {
                        map.removeLayer(polyline);
                    }

                    polylines = [];

                    // Print school detail (number of students)
                    Functions.printSchoolDetails(data);

                    $("#amountOfStudents").collapse('hide');
                    $("#languagesToStudy").collapse('hide');

                    languagesToStudy.innerHTML = '';

                    // Search and print languages that can be studied in selected school

                    for (let id of data.ontologytree_ids) {
                        Functions.httpGetAsync('http://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/' + id, Functions.processOntologyWords);
                    }


                });

            } else if (type === 'finnish') {
                // Creating blue marker for finnish school

                marker = L.marker(coordinates);

                marker.on('mouseover', (e) => {
                    marker.bindPopup(data.name_fi, {
                        closeButton: false
                    }).openPopup();
                });

                marker.on('click', (e) => {

                    to.lat = data.latitude;
                    to.lon = data.longitude;

                    // Showing routes to school

                    ReittiOpas.searchingRoutes(data);

                    $('.collapse').collapse("hide");



                    // Hide localschool lander
                    localSchool.style.display = 'none';
                    

                    //Remowing old reittiopas polylines from the map 

                    for (polyline of polylines) {
                        console.log('remooowwiniwniw')
                        map.removeLayer(polyline);
                    }

                    polylines = [];

                    // Print school detail (amount of students)
                    Functions.printSchoolDetails(data);

                    $("#amountOfStudents").collapse('hide');
                    $("#languagesToStudy").collapse('hide');

                    languagesToStudy.innerHTML = '';

                    // Search and print languages that can be studied in selected school


                    for (let id of data.ontologytree_ids) {
                        Functions.httpGetAsync('http://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/' + id, Functions.processOntologyWords);
                    }
                });

            } else {



                // Creating yellow marker for swedish school

                // works same wat that the else if part above
                marker = L.marker(coordinates, {
                    icon: yellowIcon
                });

                marker.on('mouseover', (e) => {
                    marker.bindPopup(data.name_fi, {
                        closeButton: false
                    }).openPopup();
                });

                marker.on('click', (e) => {

                    to.lat = data.latitude;
                    to.lon = data.longitude;
                    ReittiOpas.searchingRoutes(data);

                    $('.collapse').collapse("hide");



                    // Hide localschool lander
                    localSchool.style.display = 'none';
                    //explanationElement.style.display = 'none';



                    for (polyline of polylines) {
                        map.removeLayer(polyline);
                    }

                    polylines = [];

                    // Print school detail (amount of students)
                    Functions.printSchoolDetails(data);

                    $("#amountOfStudents").collapse('hide');
                    $("#languagesToStudy").collapse('hide');

                    languagesToStudy.innerHTML = '';


                    for (let id of data.ontologytree_ids) {
                        Functions.httpGetAsync('http://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/' + id, Functions.processOntologyWords);
                    }
                });
            }


            marker.on('mouseout', (e) => {
                marker.closePopup();
            });

            // Marker is added to array for possibility to remove them later from the map

            markers.push(marker);

            markersLayer.addLayer(marker);
        }
    }


};