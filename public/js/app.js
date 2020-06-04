/////////////// GLOBAL VARIABLES

// Global DOM variables 


const addressInput = document.getElementById('address');
const searchButton = document.getElementById('searchButton');
const newSearchButton = document.getElementById('newSearchButton');
const homepageButton = document.getElementById('homepageButton');

const searchElement = document.getElementById('search');
const resultElement = document.getElementById('result');

const localschool = document.getElementById('localSchool');

const explanationElement = document.getElementById('explanation');
const initialInfo = document.getElementById('initialInfo');
const mapExplanations = document.getElementById('mapExplanations');

const selectedSchool = document.getElementById('selectedSchool');
const schoolName = document.getElementById('schoolName');
const amountOfStudents = document.getElementById('amountOfStudents');
const languagesToStudy = document.getElementById('languagesToStudy');

const routeInformation = document.getElementById('routeInformation');



////////////////       INITIALIZING MARKER VARIABLES

// this is used to fit the map to markers
// this alone can't remove old markers when new search is done

var markers = [];

// and this one to remove old markers when new search is done
// this also clusters markers if them are in same location

var markersLayer = new L.markerClusterGroup({
    maxClusterRadius: (zoom) => {
        return (zoom <= 1) ? 80 : 1; // radius in pixels
    }
});

//Reittiopas polylines are stored here

var polylines = [];

// Object to store filtering choises

var filteringObject = {};

// variable used to match local school based on schooldistricts to schools fetched from servicemap API

var localSchoolName;

// variabled used to check if localschool is not found

var localSchoolFound = false;
var localSchoolNotFound = false;

// coordinates for searched address are stored here

var address;

// coordinates for reittiopas destination

var to = {
    lat: '',
    lon: ''
};



// varible used to handle if schooldistrict is clicked or not (clicking changes district polygons background)

var schoolDistrictClicked = false;




////////////////////// GENERAL INITIALIZATION

//Disable search if user has not typed at least one letter (conflicts with chrome autofill atleast)

if (searchButton.value.length >= 1) {
    searchButton.classList.add('btn-primary');
    searchButton.disabled = false;
} else {
    searchButton.disabled = true;
}

// Focus on address input on pageload (not working all the time)

document.getElementById("address")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("searchButton").click();
        }
    });

////////////////       RANGE SLIDER INITILIZATION

const slider = new Slider('#ex6', {
    tooltip: 'hide'
});

slider.on("slide", (sliderValue) => {
    document.getElementById("ex6SliderVal").textContent = sliderValue + ' km';
});


// enable/disable search button based on length of the typed characters

$('#address').on('keyup', function() {

    if (this.value.length >= 1) {
        searchButton.classList.add('btn-primary');
        searchButton.disabled = false;
    } else {
        searchButton.classList.remove('btn-primary');
        searchButton.disabled = true;
    }
});


// Toggle buttons showing number of students and languages that can be studied in a school

$("#toggleButton1").click(function() {
    $("#amountOfStudents").collapse('toggle');
});

$("#toggleButton2").click(function() {
    $("#languagesToStudy").collapse('toggle');
});

// changing the icon of the toggle button when clicked

$("#amountOfStudents").on("hide.bs.collapse", function() {
    $("#toggleButton1").html('<span class="glyphicon glyphicon-chevron-down"></span> Classes (2016)');
});
$("#amountOfStudents").on("show.bs.collapse", function() {
    $("#toggleButton1").html('<span class="glyphicon glyphicon-chevron-up"></span> Classes (2016)');
});

$("#languagesToStudy").on("hide.bs.collapse", function() {
    $("#toggleButton2").html('<span class="glyphicon glyphicon-chevron-down"></span> Languages');
});
$("#languagesToStudy").on("show.bs.collapse", function() {
    $("#toggleButton2").html('<span class="glyphicon glyphicon-chevron-up"></span> Languages');
});

////////////////       INITIALIZING MAP VARIABLE, USED IN MANY FUNCTIONS

const map = MapFunctions.init();

////////////////       GEOCODING

geocodeAddress = () => {

    const openStreetMapGeocoder = GeocoderJS.createGeocoder('openstreetmap');

    openStreetMapGeocoder.geocode(addressInput.value, (result) => {

        //lat and lng are stored into variables

        const lat = result[0].latitude;
        const lon = result[0].longitude;

        //Assigning address with geocoding results

        address = {
            lat,
            lon
        };

        // Adding red marker for user address location

        MapFunctions.addMarkers(map, [result[0].latitude, result[0].longitude], addressInput.value, 'address');

        //Centering the to new address location

        map.setView([result[0].latitude, result[0].longitude], map.getZoom());

        // Searching schooldistrict based on given address

        SchoolDistrict.findSchoolDistrict(filteringObject, map, result[0].latitude, result[0].longitude);

        //range value is stored into a variable

        const range = slider.getValue();
        const url = 'https://www.hel.fi/palvelukarttaws/rest/v4/unit/?lat=' + result[0].latitude + '&lon=' + result[0].longitude + '&distance=' + range * 1000;

        //Ajax call is made to servicemap API with URL including desired range and coordinates of user input
        Functions.httpGetAsync(url, Functions.processResult);
    });
}



////////////////       BUTTON CLICK LISTENERS

searchButton.onclick = () => {

    //checking filtering variables

    filteringObject = Functions.filteringCriterias();

    //Setting map explanations

    MapFunctions.setMapExplanations(filteringObject.language, mapExplanations, initialInfo);

    //formatting variables and markers

    schoolDistrictClicked = false;
    localSchoolFound = false;
    localSchoolNotFound = false;
    markers = [];
    markersLayer.clearLayers();

    //geocoding given address

    geocodeAddress();

    //Hiding search form and showing result element

    searchElement.style.display = 'none';
    selectedSchool.style.display = 'none';
    localSchool.style.display = 'none';
    resultElement.style.display = 'block';
}



//Eventlistener for new search button

newSearchButton.onclick = () => {

    //Clears markers from the map
    markersLayer.clearLayers();

    //Clears schooldistrict polygons from the map
    SchoolDistrict.geoJsonLayer.clearLayers();

    // formatting filtering object for new search
    filteringObject = {};

    // removes reittiopas route polylines from the map
    for (polyline of polylines) {
        map.removeLayer(polyline);
    }

    //formatting polyline array so that old routes won't stay there
    polylines = [];

    //collapsing all collapse buttons if any of the has left open
    $('.collapse').collapse("hide");

    //showing search element and hiding result element

    searchElement.style.display = 'block';
    resultElement.style.display = 'none';
    $("#routes").hide();
    $("#homeAndApplyButton").hide();

    //Showing user instructions instead of map explanations

    initialInfo.style.display = 'block';
    mapExplanations.style.display = 'none';

    //setting focus to address input so that the user can start typing right away(not working)
    addressInput.select().focus();

}
