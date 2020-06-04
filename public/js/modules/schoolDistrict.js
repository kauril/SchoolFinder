 ////////////////////// FUNCTIONS RELATED TO SCHOOLDISTRICT AREAS


 // Function done for all the filtered school district polygons
 // School district onclick, mouseover etc... stuff is defined here
 const onEachFeature = (feature, layer) => {

     //Coordinates of geoJson polygon are added in a form of a marker into markers array to fit map include the whole school district area

     for (unit of feature.geometry.coordinates[0]) {
         unit.splice(-1, 1);
         const coordinates = unit.reverse();
         const marker = L.marker(coordinates);
         markers.push(marker)
     }

     localSchoolName = '';



     if (feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_ALA-ASTE_SUOMI' || feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_YLAASTE_SUOMI') {

     	//Finnish schooldistricts are handled here
         const popupContent = "<p>Your Finnish school based on your address is:</p><b>" + feature.properties.NIMI + '</b>';

         //localSchoolName variable is assigned with school name from district

         localSchoolName = feature.properties.NIMI;

         layer.setStyle(SchoolDistrict.defaultFinnishSchoolStyle);
         
         // District onclick events
         // when clicked district background color changes
         layer.on('click', (e) => {

             if (schoolDistrictClicked) {
                 layer.setStyle(SchoolDistrict.defaultFinnishSchoolStyle);
                 schoolDistrictClicked = false;

             } else {
                 layer.setStyle(SchoolDistrict.highlightFinnishSchoolStyle);
                 schoolDistrictClicked = true;
             }


         });

         //Information of localschool is showed to the user

         localSchool.innerHTML = `<p>Your local Finnish school is:</p>`;
         localSchool.style.display = 'block';
     } else {

     	//Saem thing as above if sentence for swedish schools
         const popupContent = "<p>Your local Swedish school is:</p><b>" + feature.properties.NIMI_SE + '</b>';

         localSchoolName = feature.properties.NIMI_SE;

         layer.setStyle(SchoolDistrict.defaultSwedishSchoolStyle);
         //layer.bindPopup(popupContent);
         layer.on('click', (e) => {
             layer.setStyle(SchoolDistrict.highlightSwedishSchoolStyle);
             if (schoolDistrictClicked) {
                 layer.setStyle(SchoolDistrict.defaultSwedishSchoolStyle);
                 schoolDistrictClicked = false;

             } else {
                 layer.setStyle(SchoolDistrict.highlightSwedishSchoolStyle);
                 schoolDistrictClicked = true;
             }
         });


         localSchool.innerHTML = `<p>Your local Swedish school is:</p>`;
         localSchool.style.display = 'block';
     }
 }

 const SchoolDistrict = {

     //School district polygon styles

     defaultFinnishSchoolStyle: {
         color: '#18447E',
         weight: 3,
         opacity: 0.6,
         fillOpacity: 0,
         fillColor: '#18447E'
     },

     highlightFinnishSchoolStyle: {
         color: '#18447E',
         weight: 3,
         opacity: 0.6,
         fillOpacity: 0.6,
         fillColor: '#18447E'
     },

     defaultSwedishSchoolStyle: {
         color: '#FFCC00',
         weight: 3,
         opacity: 0.6,
         fillOpacity: 0,
         fillColor: '#FFCC00'
     },

     highlightSwedishSchoolStyle: {
         color: '#FFCC00',
         weight: 3,
         opacity: 0.6,
         fillOpacity: 0.6,
         fillColor: '#FFCC00'
     },



     //Creating geoJSON layer but not adding anything yet. All the added geojson layers go through this 
     // and are then put through onEachFeature function


     geoJsonLayer: L.geoJson(false, {
         onEachFeature: onEachFeature
     }),

     //Function that checks if coordinates are inside the polygon

     isCoordinatesInsidePolygon: (lat, lng, poly) => {

         var polyPoints = '';

         //Here might be the core of the problem I talked about with Harri
         // When earlier used schooldistrict comes here again getLatLngs() reverse lat and long opposite and if earlier used district is forced to be drawn on map again it appears somewhere near saudiarabia

         polyPoints = poly.getLatLngs()[0];

         var x = lat,
             y = lng;

         var intersect;

         var inside = false;
         for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
             var xi = polyPoints[i].lat,
                 yi = polyPoints[i].lng;
             var xj = polyPoints[j].lat,
                 yj = polyPoints[j].lng;

             intersect = ((yi > y) != (yj > y)) &&
                 (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
             if (intersect) inside = !inside;
         }

         // Return true if coordinates are inside the polygon
         return inside;
     },

     findSchoolDistrict: (filteringObject, map, lat, lng) => {

         //Storing schooldistrict geoJSON file (found in data/oppilaaksiOttoAlueet.js)
         // into leaflet geoJSON file
         const gjLayer = L.geoJson(geojson);

         //Iterating through schooldistrict layers

         for (key of Object.keys(gjLayer._layers)) {

             // filtering district layers within which address intersects
             const isIntersecting = SchoolDistrict.isCoordinatesInsidePolygon(lat, lng, gjLayer._layers[key])

             if (isIntersecting) {

             	//If schooldistrict matching coordinates is found filtering variables are checked
                 if (filteringObject.language === 'finnish') {
                     if (filteringObject.schoolLevel === 'primary') {
                         if (gjLayer._layers[key].feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_ALA-ASTE_SUOMI') {
                         	// Here schooldistrict layer is added to geoJsonLayer and from there its properties are defined in onEachFeature function on top of this file
                         	// same thing in other inmost if sentences below
                             SchoolDistrict.geoJsonLayer.addData(gjLayer._layers[key].feature)
                         }
                     }
                     if (filteringObject.schoolLevel === 'secondary') {
                         if (gjLayer._layers[key].feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_YLAASTE_SUOMI') {
                             SchoolDistrict.geoJsonLayer.addData(gjLayer._layers[key].feature)
                         }
                     }
                 } else {
                     if (filteringObject.schoolLevel === 'primary') {
                         if (gjLayer._layers[key].feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_ALA-ASTE_RUOTSI') {
                             SchoolDistrict.geoJsonLayer.addData(gjLayer._layers[key].feature)
                         }
                     }
                     if (filteringObject.schoolLevel === 'secondary') {
                         if (gjLayer._layers[key].feature.properties.ALUEJAKO === 'OPEV_OOA_2015-2016_YLAASTE_RUOTSI') {
                             SchoolDistrict.geoJsonLayer.addData(gjLayer._layers[key].feature)
                         }
                     }
                 }
             }
         }
         //adding result district polygon to the map
         SchoolDistrict.geoJsonLayer.addTo(map);

     }
 }