///////////////// GENERAL FUNCTIONS (INCLUDES AJAX FUNCTIONS)

const Functions = {

    ////////////////       INITIALIZING FILTERING VARIABLES

    filteringCriterias: () => {

        // Checking wheter user search for primary or secondary schools

        var filteringObject = {
            schoolLevel: '',
            language: ''
        };

        //Based on user input the schoollevel criteria is stored into an object
        for (let schoolLevel of document.getElementsByName('schoolLevel')) {
            if (schoolLevel.checked) {
                switch (schoolLevel.value) {
                    case 'primary':
                        filteringObject.schoolLevel = 'primary';
                        break;
                    case 'secondary':
                        filteringObject.schoolLevel = 'secondary';
                        break;
                }
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        //Based on user input the language criteria is stored into an object
        for (let language of document.getElementsByName('language')) {
            if (language.checked) {
                switch (language.value) {
                    case 'finnish':
                        filteringObject.language = 'finnish';
                        break;
                    case 'swedish':
                        filteringObject.language = 'swedish';
                        break;
                }
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        return filteringObject;
    },

    /////////////////		Function used to print number of students in a primaryschool

    printPrimarySchool: (school, nos) => {

        console.log(nos)

        schoolName.innerHTML = '';
        schoolName.innerHTML += `<h3><a target="_blank" href="${school.www_fi}">${school.name_fi}</a></h3>`;

        //Dummy buttons to sosialmedi are added
        schoolName.innerHTML += `<a href="#" class="fa fa-facebook"></a>
<a href="#" class="fa fa-instagram"></a><a href="#" class="fa fa-twitter"></a>`;

        amountOfStudents.innerHTML = '';
        amountOfStudents.innerHTML += `<p>1. class: ${nos["1"]} students</p>`;
        amountOfStudents.innerHTML += `<p>2. class: ${nos["2"]} students</p>`;
        amountOfStudents.innerHTML += `<p>3. class: ${nos["3"]} students</p>`;
        amountOfStudents.innerHTML += `<p>4. class: ${nos["4"]} students</p>`;
        amountOfStudents.innerHTML += `<p>5. class: ${nos["5"]} students</p>`;
        amountOfStudents.innerHTML += `<p>6. class: ${nos["6"]} students</p>`;

        
        schoolName.innerHTML += `<p>Total number of students: <b>${nos["1-6 yhteensä"]}</b> (2016)</p>`;
        

        //Link to schools homepage is added

        homepageButton.addEventListener('click', () => {

            window.location = school.www_fi;
        });

        //Result is shown to the user

        selectedSchool.style.display = "block";
        document.getElementById('toggleButton1').style.display = 'block';
    },


    /////////////////		Function used to print number of students in a secondaryschool

    printSecondarySchool: (school, nos) => {

        schoolName.innerHTML = '';
        schoolName.innerHTML += `<h3>${school.name_fi}</h3>`;

        //Dummy buttons to sosialmedi are added
        schoolName.innerHTML += `<a href="#" class="fa fa-facebook"></a>
<a href="#" class="fa fa-instagram"></a><a href="#" class="fa fa-twitter"></a>`;

        amountOfStudents.innerHTML = '';
        amountOfStudents.innerHTML += `<p>7. class: ${nos["7"]} students</p>`;
        amountOfStudents.innerHTML += `<p>8. class: ${nos["8"]} students</p>`;
        amountOfStudents.innerHTML += `<p>9. class: ${nos["9"]} students</p>`;
        schoolName.innerHTML += `<p>Total number of students: <b>${nos["7-9 yhteensä"]}</b> (2016)</p>`;

        //Link to schools homepage is added

        homepageButton.addEventListener('click', () => {

            window.location = school.www_fi;
        });

        //Result is shown to the user
        selectedSchool.style.display = "block";
        document.getElementById('toggleButton1').style.display = 'block';
    },

    //Prints number of students in school to index.html

    printSchoolDetails: (school) => {

        // variable to handle situation where amount of studets is not found
        var schoolNotFound = true;

        //All the schoolname comparisons are made in uppercase to make sure that student number data is found if similar exists

        if (filteringObject.language === 'finnish') {
            for (let i = 0; i < numberOfStudents.length; i++) {
                if (filteringObject.schoolLevel === 'primary') {
                    if (school.name_fi.toUpperCase() === numberOfStudents[i].Oppilaitos.toUpperCase()) {
                        Functions.printPrimarySchool(school, numberOfStudents[i])
                        schoolNotFound = false;
                    }
                } else {
                    if (school.name_fi.toUpperCase() === numberOfStudents[i].Oppilaitos.toUpperCase()) {
                        Functions.printSecondarySchool(school, numberOfStudents[i])
                        schoolNotFound = false;
                    }
                }
            }
        }


        if (filteringObject.language === 'swedish') {
            for (let i = 0; i < numberOfSwedishStudents.length; i++) {
                if (filteringObject.schoolLevel === 'primary') {
                    if (school.name_fi.toUpperCase() === numberOfSwedishStudents[i].Oppilaitos.toUpperCase()) {
                        Functions.printPrimarySchool(school, numberOfSwedishStudents[i])
                        schoolNotFound = false;
                    }
                } else {
                    if (school.name_fi.toUpperCase() === numberOfSwedishStudents[i].Oppilaitos.toUpperCase()) {
                        Functions.printSecondarySchool(school, numberOfSwedishStudents[i])
                        schoolNotFound = false;
                    }
                }
            }
        }

        //User is informed if matching school is not found and toggglebutton is hidden
        if (schoolNotFound) {
            schoolName.innerHTML = '';
            schoolName.innerHTML += `<h3>${school.name_fi}</h3>`;
            schoolName.innerHTML += `<p>Number of students not available</p>`;
            document.getElementById('toggleButton1').style.display = 'none';
            selectedSchool.style.display = "block";
        }
    },

    //All the schools that fit into filtering criterias go through this function

    schoolFound: (schoolObj, language) => {

    	//coordinates of the school are stored

        const longitude = schoolObj.longitude;
        const latitude = schoolObj.latitude;

        coordinates = [
            latitude,
            longitude
        ];

        //first function checks if the school is localschool by comparing it to 
        //localSchoolName variables which is defined earlier based on schooldistrict

        if (schoolObj.name_fi === localSchoolName) {

        	//if school is local green marker is made to represent it on map
            MapFunctions.addMarkers(map, coordinates, schoolObj, 'local');

            //found school is send towards detail printing
            Functions.printSchoolDetails(schoolObj)

            //schools coordinates are stored for the reittiopas destination
            to.lat = schoolObj.latitude;
            to.lon = schoolObj.longitude;

            //routes to school are fetceh from reittiopas API
            ReittiOpas.searchingRoutes(schoolObj);
        } else {
        	//Blue or yellow markers are made to other school based on language
            MapFunctions.addMarkers(map, coordinates, schoolObj, language);
        }

    },

    ////////////////       AJAX


    httpGetAsync: (theUrl, callback) => {

        const xmlHttp = new XMLHttpRequest();


        xmlHttp.onreadystatechange = () => {

            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

            	//If request is succesfull callback method is invoked
                callback(xmlHttp.responseText);
            }
        }

        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    },


    ////////////////       PROCESSING AJAX RESULTS

    //Callback method for fetching schools from servicemap API

    processResult: (response) => {

    	//Ajax result is stored into a variable
        const results = JSON.parse(response);

        //If school matches the given criterias it is sent to schoolFound() method above
        // ontologytree_ids values is used to catch schools from all the services

        for (let i = 0; i < results.length; i++) {

            if (filteringObject.language === 'finnish') {
                if (filteringObject.schoolLevel === 'primary') {
                    if (results[i].ontologytree_ids.includes(1100)) {
                        Functions.schoolFound(results[i], filteringObject.language)
                    }
                } else {
                    if (results[i].ontologytree_ids.includes(1110)) {
                        Functions.schoolFound(results[i], filteringObject.language)
                    }
                }
            }

            if (filteringObject.language === 'swedish') {
                if (filteringObject.schoolLevel === 'primary') {
                    if (results[i].ontologytree_ids.includes(1189)) {
                        Functions.schoolFound(results[i], filteringObject.language)
                    }
                } else {
                    if (results[i].ontologytree_ids.includes(1191)) {
                        Functions.schoolFound(results[i], filteringObject.language)
                    }
                }
            }
        }

        // As result is iterated markers are added to the map

        markersLayer.addTo(map);

        //variable is made to eventually fit map boundaries to markers

        const group = new L.featureGroup(markers);

        //If localschool is not found on first round new fetch to servicemap API is done by searching the localschool based on schoolname which is from schooldistrict
        //(In same cases local school might be further than 1 km away and if user set range to 1km local shool wont be found)

        if (!localSchoolFound) {
            const url = 'http://www.hel.fi/palvelukarttaws/rest/v4/unit/?search=' + localSchoolName;
            if (localSchoolNotFound) {

            	//Second round stops here. If school is still not found user will be informed
                if (!localSchoolFound) {
                    localSchool.innerHTML = `<h3>Your local school not found :/ (${localSchoolName} is the name of your localschool)</h3>`;
                    $("#routes").hide();
                    $("#homeAndApplyButton").hide();
                } else {
                    $("#routes").show();
                    $("#homeAndApplyButton").show();
                }
            } else {

            	// here starts retry to find local school and localSchoolNotFound variable is assigned with true value
            	//to avoid eternal loop if the local school is not found on a second round either
                Functions.httpGetAsync(url, Functions.processResult);
                localSchoolNotFound = true;
            }

        } else {

        	//If localschool is found on a first round result will be shown to the user 

            $("#routes").show();
            $("#homeAndApplyButton").show();
        }

        //Map boundaries are fitted to markers
        map.fitBounds(group.getBounds());
    },

    //Another callback function used print languages that can be studied in a selected school

    processOntologyWords: (response) => {

    	//Languages have parent_id values 1120 and 1193

        if (JSON.parse(response).parent_id === 1120 || JSON.parse(response).parent_id === 1193) {

            languagesToStudy.innerHTML += `<p>${JSON.parse(response).name_en}</p>`;
        }
    }
}