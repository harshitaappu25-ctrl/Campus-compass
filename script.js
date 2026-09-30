// ==========================================
// CAMPUS COMPASS - MAIN SCRIPT
// ==========================================

let collegeData = null;
let recognition = null;

// ------------------------------------------
// LOAD COLLEGE DATA
// ------------------------------------------

async function loadCollegeData() {
    try {
        const response = await fetch("collegeData.json");

        if (!response.ok) {
            throw new Error("Could not load collegeData.json");
        }

        collegeData = await response.json();

        console.log("College data loaded successfully.");
    } catch (error) {
        console.error("Error loading college data:", error);

        alert(
            "Campus Compass could not load the college information. " +
            "Please make sure you are running the project using a local server."
        );
    }
}


// ------------------------------------------
// SCREEN NAVIGATION
// ------------------------------------------

function showScreen(screenId) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const selectedScreen = document.getElementById(screenId);

    if (selectedScreen) {
        selectedScreen.classList.add("active");
    }
}


// ------------------------------------------
// MICROPHONE
// ------------------------------------------

let microphoneAllowed = false;

function requestMicrophone() {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        document.getElementById("permissionMessage").textContent =
            "Microphone access is not supported by this browser. You can continue using text.";

        return;
    }

    navigator.mediaDevices.getUserMedia({
        audio: true
    })

    .then(function(stream) {

        microphoneAllowed = true;

        stream.getTracks().forEach(track => {
            track.stop();
        });

        showScreen("askScreen");
    })

    .catch(function(error) {

        console.log("Microphone permission error:", error);

        document.getElementById("permissionMessage").textContent =
            "Microphone access was not allowed. You can continue with text.";
    });
}


function continueWithoutMicrophone() {
    showScreen("askScreen");
}


// ------------------------------------------
// SPEECH RECOGNITION
// ------------------------------------------

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {

        document.getElementById("listeningStatus").textContent =
            "🎤 Listening... Please speak.";
    };


    recognition.onresult = function(event) {

    const spokenText =
        event.results[event.resultIndex][0].transcript;

    document.getElementById("questionText").textContent =
        spokenText;

    processQuestion(spokenText);
};


    recognition.onerror = function(event) {

        console.log(
            "Speech recognition error:",
            event.error
        );

        document.getElementById("listeningStatus").textContent =
            "Unable to understand the voice. Please try again or type your question.";
    };


    recognition.onend = function() {

        document.getElementById("listeningStatus").textContent =
            "Ready for your question.";
    };
}
// ------------------------------------------
// START LISTENING
// ------------------------------------------

function startListening() {
    speechSynthesis.cancel();

    if (!recognition) {

        document.getElementById("listeningStatus").textContent =
            "Voice recognition is not supported here. Please type your question.";

        return;
    }

    try {

        recognition.start();

    } catch (error) {

        console.log(error);
    }
}


// ------------------------------------------
// TYPED QUESTION
// ------------------------------------------

function submitTypedQuestion() {

    const input =
        document.getElementById("textQuestion");

    const question =
        input.value.trim();

    if (question === "") {
        return;
    }

    document.getElementById("questionText").textContent =
        question;

    processQuestion(question);
}


// ------------------------------------------
// NORMALIZE QUESTION
// ------------------------------------------

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[?!.,'"]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


// ------------------------------------------
// CHECK IF QUESTION CONTAINS WORD
// ------------------------------------------

function containsAny(text, words) {

    return words.some(word => text.includes(word));
}


// ------------------------------------------
// PROCESS QUESTION
// ------------------------------------------

function processQuestion(question) {

    if (!collegeData) {

        displayAnswer(
            "I’m sorry, but the college information is not available right now. Please try again.",
            null,
            null
        );

        return;
    }
    

    const q = normalizeText(question);

    console.log("Question:", q);
if (
    q === "thank you" ||
    q === "thanks" ||
    q === "thank you so much" ||
    q === "thanks a lot"
) {
    displayAnswer("You're most welcome! 😊 Is there anything else I can help you with?");
    return;
}

if (
q==    "hi"||
q==    "hello"||
q==    "hey"||
q==    "good morning"||
q==    "good afternoon"||
 q==   "good evening"||
q==    "good night"
) {
    displayAnswer("Hello! Welcome to Campus Compass. How can I help you today?");
    return;
}
    
// ----------------------------------------
// PROJECT TEAM / PROJECT INFORMATION
// ----------------------------------------

if (
    containsAny(q, [
        "project by",
        "who made this project",
        "who developed this project",
        "who created this project",
        "who made campus compass",
        "who developed campus compass",
        "who created campus compass",
        "who are the team members",
        "who is in the team",
        "project team",
        "team members",
        "which year are you studying",
        "which semester are you in",
        "which sem are you in",
        "which course are you studying",
        "what course are you studying",
        "who did this project"
    ])
) {
    displayAnswer(
        "Campus Compass was developed by Harshitha TV, Suma, Meghana,rime paul and prathiksha. We are BCA students of second year, third semester."
    );

    return;
}

    // ----------------------------------------
// LIFT LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is the lift",
        "lift",
        "where is lift",
        "where is the elevator",
        "where can i find the lift",
        "how do i get to the lift",
        "which block is the lift in",
        "lift location",
        "elevator location"
    ])
) {
    displayAnswer(
        "The lift is located in ______ block.",
        "images/lift.jpg"
    );

    return;
}

// ----------------------------------------
// CANTEEN LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "canteen",
        "where is the canteen",
        "where is canteen",
        "canteen location",
        "where can i find the canteen",
        "how do i get to the canteen",
        "canteen located",
        "canteen"
    ])
) {
    displayAnswer(
        "The canteen is located in the basement of the college campus.",
        "images/canteen.jpg.jpeg"
    );

    return;
}
// ----------------------------------------
// COLLEGE OVERVIEW LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "college overview",
        "college view",
        "college building",
        "show me the college",
        "show college",
        "college campus view",
        "drone view",
        "aerial view of college"
    ])
) {
    displayAnswer(
        "Here is an overview of CB Bhandari Jain College campus.",
        "images/college-overview.jpg.jpeg"
    );

    return;
}

// ----------------------------------------
// QUADRANGLE LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is the quadrangle",
        "quadrangle",
        "where is quadrangle",
        "quadrangle location",
        "where can i find the quadrangle",
        "how do i get to the quadrangle",
        "quadrangle located"
    ])
) {
    displayAnswer(
        "The Quadrangle is located inside the college campus.",
        "images/quadrangle-2.jpg.jpeg"
    );

    return;
}

// ----------------------------------------
// STAFF ROOM LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is the staff room",
        "staff room",
        "where is staff room",
        "staff room location",
        "where can i find the staff room",
        "how do i get to the staff room",
        "staff room located"
    ])
) {
    displayAnswer(
        "The Staff Room is located inside the college building.",
        "images/staff-room.jpg.jpeg"
    );

    return;
}


// ----------------------------------------
// COLLEGE ENTRANCE LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is the entrance",
        "entrance",
        "where is the college entrance",
        "where is main entrance",
        "where is the main entrance",
        "college entrance location",
        "main entrance location"
    ])
) {
    displayAnswer(
        "The main entrance of the college is at the front entrance of the campus.",
        "images/college-entrance.jpg.jpeg"
    );

    return;
}

// ----------------------------------------
// MARKETING DEPARTMENT LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is the marketing department",
        "marketing department",
        "where is marketing department",
        "marketing department location",
        "where can i find the marketing department",
        "how do i get to the marketing department",
        "marketing department located"
    ])
) {
    displayAnswer(
        "The Marketing Department is on the ground floor, next to the lift.",
        "images/marketing-department.jpg.jpeg"
    );

    return;
}


 if (
    containsAny(q, [
        "library timing",
        "library timings",
        "library hours",
        "library working hours",
        "when is the library open",
        "when does the library open",
        "when does the library close",
        "library open",
        "library closing time"
    ])
) {
    displayAnswer(
        `The library is open from ${collegeData.timings.library}.`
    );
    return;
}
    if (
    containsAny(q, [
        "what services are available",
        "student services",
        "services for students",
        "what services do students get",
        "services provided to students",
        "student facilities and services",
        "what services does the college provide",
        "college services"
    ])
) {
    const serviceList = collegeData.services.join(", ");

    displayAnswer(
        `The college provides the following student services: ${serviceList}.`
    );
    return;
}
    if (
    containsAny(q, [
        "canteen timing",
        "canteen timings",
        "canteen hours",
        "when is canteen open",
        "when does the canteen open",
        "when does canteen open",
        "canteen open",
        "canteen working hours"
    ])
) {
    displayAnswer(
        `The canteen is open from ${collegeData.timings.canteen}.`
    );
    return;
}
    if (
    containsAny(q, [
        "where is reception",
        "reception",
        "reception location",
        "reception room",
        "where can i find reception",
        "where is the reception"
    ])
) {
    displayAnswer(
        "The reception is on the ground floor near the main entrance and waiting area."
    );
    return;
}
 

 //bba classroom//
    if (
    q.includes("bba") &&
    (
        q.includes("classroom") ||
        q.includes("class room") ||
        q.includes("where") ||
        q.includes("floor")
    )
) {
    displayAnswer(
        "The BBA classrooms are on the third floor."
    );
    return;
}
//bcom classroom//
    if (
    (q.includes("bcom") || q.includes("b com")) &&
    (
        q.includes("classroom") ||
        q.includes("class room") ||
        q.includes("where") ||
        q.includes("floor")
    )
) {
    displayAnswer(
        "The B.Com classrooms are on the third floor."
    );
    return;
}
//bcs classroom//
    if (
    q.includes("bca") &&
    (
        q.includes("classroom") ||
        q.includes("class room") ||
        q.includes("where") ||
        q.includes("floor") ||
        q.includes("Duration")
    )
) {
    displayAnswer(
        "The BCA first-year, second-year and third-year classrooms are on the second floor."
    );
    return;
}
//mba related//
    if (
    q.includes("mba")
) {
    if (
        q.includes("semester") ||
        q.includes("how many sem")
    ) {
        displayAnswer(
            "MBA is a 2-year program with 4 semesters."
        );
        return;
    }
//questions//
    if (
        q.includes("floor") ||
        q.includes("classroom") ||
        q.includes("where") ||
        q.includes("location")
    ) {
        displayAnswer(
            "The MBA block and MBA classrooms are on the fourth floor."
        );
        return;
    }
//fees//
    if (
        q.includes("fee") ||
        q.includes("fees")
    ) {
        displayAnswer(
            "The current MBA fee is not listed in Campus Compass. Please contact the college for the current fee details."
        );
        return;
    }

    displayAnswer(
        "The college offers an MBA program. It is a 2-year program with 4 semesters."
    );
    return;
}
//bba info//
if (
    q.includes("bba") &&
    (
        q.includes("semester") ||
        q.includes("how many sem") ||
        q.includes("duration of BBA") ||
        q.includes("years")
    )
) {
    displayAnswer(
        "BBA is a 3-year program with 6 semesters."
    );
    return;
}
//bcom info//
    if (
    (q.includes("bcom") || q.includes("b com")) &&
    (
        q.includes("semester") ||
        q.includes("how many sem") ||
        q.includes("duration of bcom") ||
        q.includes("years")
    )
) {
    displayAnswer(
        "B.Com is a 3-year program with 6 semesters."
    );
    return;
}
//bca info//
    if (
    q.includes("bca") &&
    (
        q.includes("semester") ||
        q.includes("how many sem") ||
        q.includes("duration of bca") ||
        q.includes("years")
    )
) {
    displayAnswer(
        "BCA is a 3-year program with 6 semesters."
    );
    return;
}
//course rerlated questions//
if (
    containsAny(q, [
        "what courses are available",
        "courses available",
        "available courses",
        "what programs are available",
        "programs available",
        "courses offered",
        "programs offered",
        "what are the courses",
        "what courses does the college offer",
        "which courses does this college have",
        "courses"
    ])
) {
    const courseList = collegeData.programs
        .map(course => course.name)
        .join(", ");

    displayAnswer(
        `The college offers the following programs: ${courseList}.`
    );
    return;
}
//PE related//
    if (
    containsAny(q, [
        "physical education",
        "physical education department",
        "physical education teacher",
        "physical education staff",
        "pe teacher",
        "pe staff"
    ])
) {
    displayAnswer(
        `The Physical Education staff member is ${collegeData.leadership.physicalEducation}.`
    );
    return;
}
//motto related//
    if (
    containsAny(q, [
        "motto",
        "college motto",
        "motto of the college",
        "what is the motto",
        "what is college motto"
    ])
) {
    displayAnswer(
        `The college motto is "${collegeData.college.motto}".`,
        "images/cllg-logo.jpg.jpeg"
    );
    return;
}

    // Managed by//
    if (
    containsAny(q, [
        "who manages the college",
        "who is managing the college",
        "college managed by",
        "who runs the college",
        "management of the college",
        "who manages this college",
        "managed by"
    ])
) {
    displayAnswer(
        `The college is managed by ${collegeData.college.managedBy}.`
    );
    return;
}

//Contact number//
    if (
    containsAny(q, [
        "college contact",
        "contact number",
        "college contact number",
        "phone number",
        "college phone number",
        "telephone number",
        "contact details"
    ])
) {
    displayAnswer(
        `The college contact numbers are ${collegeData.contact.phone.join(" and ")}.`
    );
    return;
}
//Email//   
if (
    containsAny(q, [
        "college email",
        "email of the college",
        "college mail",
        "email address",
        "college email address"
    ])
) {
    displayAnswer(
        `The college email address is ${collegeData.college.email}.`
    );
    return;
}
//Website//
if (
    containsAny(q, [
        "college website",
        "website of the college",
        "college web site",
        "website",
        "web site",
        "college official website"
    ])
) {
    displayAnswer(
        `The college website is ${collegeData.college.website}.`
    );
    return;
}
//Website//

    if (
    containsAny(q, [
        "college website",
        "website of the college",
        "college web site",
        "website",
        "web site"
    ])
) {
    displayAnswer(
        `The college website is ${collegeData.college.website}.`
    );
    return;
}

//Short name//
    if (
    containsAny(q, [
        "short name",
        "college short name",
        "short name of the college",
        "abbreviation of the college",
        "college abbreviation"
    ])
) {
    displayAnswer(
        `The short name of the college is ${collegeData.college.shortName}.`,
         "images/cllg pic.jpg.jpeg"
    );
    return;
}
//BBA HOD//
    if (
    containsAny(q, [
        "who is the bba hod",
        "bba hod",
        "hod of bba",
        "bba head of department",
        "name of bba hod",
        "Name of the HOD of BBA",
        "Who is the HOD of BBA"
    ])
) {
    displayAnswer(
        `The BBA HOD is ${collegeData.hods.bba}.`
    );
    return;
}

//B.COM HOD//
    if (
    containsAny(q, [
        "who is the bcom hod",
        "bcom hod",
        "hod of bcom",
        "bcom head of department",
        "name of bcom hod",
        "Who is the HOD of Bcom",
        "Name of the HOD of Bcom",
         "Who is the HOD of Bcom"
    ])
) {
    displayAnswer(
        `The Bcom HOD is ${collegeData.hods.bcom}.`
    );
    return;
}

// --------------------------------------
// BCA HOD
// --------------------------------------

if (
    containsAny(q, [
        "who is the bca hod",
        "bca hod",
        "hod of bca",
        "bca head of department",
        "head of bca department",
        "name of bca hod",
         "Name of the HOD of bca",
         "Who is the HOD of bca"
    ])
) {
    displayAnswer(
        `The BCA HOD is ${collegeData.hods.bca}.`
    );
    return;
}    
    // --------------------------------------
// COLLEGE NAME
// --------------------------------------

if (
    containsAny(q, [
        "what is the college name",
        "college name",
        "name of the college",
        "which college is this",
        "what college is this",
        "What is the name of the college",
        "What is our college name",
        "what is the name of our college"
    ])
) {
    displayAnswer(
        `The name of the college is ${collegeData.college.name}.`,
         "images/cllg pic.jpg.jpeg"
    );
    return;
}

    // --------------------------------------
// LEADERSHIP
// --------------------------------------

if (
    containsAny(q, [
        "who is the vice president",
        "vice president of the college",
        "college vice president",
        "name of the vice president",
        "who is vice president",
       "what is the name of the vice president",
"name of vice president",
"vice president name"
    ])
) {
    displayAnswer(
        `The Vice President is ${collegeData.leadership.vicePresident}, an office bearer of Shri Mahavir Jain Shikshan Sangh.`,
        "images/vice president.jpg.jpeg"
    );
    return;
}



    
if (!q.includes("vice pressident") &&
    containsAny(q, [
        "who is the president",
        "president of the college",
        "college president",
        "name of the president"
        
    ])
) {
    displayAnswer(
        `The President is ${collegeData.leadership.president}, an office bearer of Shri Mahavir Jain Shikshan Sangh.`,
        "images/president.jpg.jpeg"
    );
    return;
}



if (
    containsAny(q, [
        "who is the secretary",
        "secretary of the college",
        "college secretary",
        "name of the secretary",
        "who is secretary",
"who is the secretary",
"what is the name of the secretary",
"name of secretary",
"secretary name",
"secretary"
    ])
) {
    displayAnswer(
        `The Secretary is ${collegeData.leadership.secretary}, an office bearer of Shri Mahavir Jain Shikshan Sangh.`,
        "images/secretary.jpg.jpeg"
    );
    return;
}


if (
    containsAny(q, [
        "who is the principal",
        "principal name",
        "name of principal",
        "name of the principal",
        "who is college principal"
        
    ])
) {
    displayAnswer(
        `The Principal of the college is ${collegeData.leadership.principal}.`,
        "images/principal.jpg.jpeg"
        
    );

    return;
}


if (
    containsAny(q, [
        "who is the vice principal",
        "vice principal name",
        "name of vice principal",
        "name of the vice principal",
        "vice principal"
    ])
) {
    displayAnswer(
        `The Vice Principal is ${collegeData.leadership.vicePrincipal}.`
    );
    return;
}

    // --------------------------------------
    // COLLEGE INFORMATION
    // --------------------------------------

    if (
        containsAny(q, [
            "about the college",
            "tell me about the college",
            "about college",
            "what is this college",
            "college information",
            "information about college",
           
        ])
    ) {

        displayAnswer(
            `${collegeData.college.shortName} was established in ${collegeData.college.established}. It is affiliated to ${collegeData.college.affiliatedTo} and is located at ${collegeData.college.address}.`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // ESTABLISHED
    // --------------------------------------

    if (
        containsAny(q, [
            "when was the college established",
            "when was college established",
            "when did the college start",
            "college established",
            "year college started"
        ])
    ) {

        displayAnswer(
            `The college was established in ${collegeData.college.established}.`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // ADDRESS / LOCATION
    // --------------------------------------

    if (
        containsAny(q, [
            "where is the college",
            "where is this college",
            "college location",
            "college address",
            "where is the college located",
            "how do i reach the college"
        ])
    ) {

        displayAnswer(
            `The college is located at ${collegeData.college.address}.`,
            null,
            null
        );

        return;
    }
    // --------------------------------------
    // PRINCIPAL
    // --------------------------------------

    if (
        containsAny(q, [
            "who is the principal",
            "principal name",
            "name of principal",
            "who is principal"
            
        ])
    ) {

        displayAnswer(
            `The Principal of the college is ${collegeData.leadership.principal}.`,
           "images/principal.jpg.jpeg"
        );

        return;
    }


    // --------------------------------------
    // VICE PRINCIPAL
    // --------------------------------------

    if (
        containsAny(q, [
            "who is the vice principal",
            "vice principal name",
            "name of vice principal"
        ])
    ) {

        displayAnswer(
            `The Vice Principal of the college is ${collegeData.leadership.vicePrincipal}.`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // PRESIDENT
    // --------------------------------------

    if (!q.includes("vice pressident") &&
        containsAny(q, [
            "who is the president",
            "president name",
            "name of president",
            "president"
        ])
    ) {

        displayAnswer(
            `The President of the college is ${collegeData.leadership.president}.`,
           "images/president.jpg.jpeg"
        );

        return;
    }


    // --------------------------------------
    // BCA
    // --------------------------------------

    if (
        containsAny(q, [
            "does the college have bca",
            "does college have bca",
            "bca course",
            "bca program",
            "bachelor of computer applications"
        ])
    ) {

        displayAnswer(
            "Yes. The college offers BCA, Bachelor of Computer Applications. The program is 3 years with 6 semesters.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // BCA FEE
    // --------------------------------------

    if (
        containsAny(q, [
            "bca fee",
            "bca fees",
            "fee for bca",
            "how much is bca",
            "bca course fee"
        ])
    ) {

        displayAnswer(
            "The fee for BCA is ₹80,000.",
            null,
            null
        );

        return;
    }
    
    // BCA AI/ML
    // 
    
    if (
        containsAny(q, [
            "bca ai",
            "bca artificial intelligence",
            "bca machine learning",
            "ai ml course",
            "artificial intelligence and machine learning"
        ])
    ) {

        displayAnswer(
            "The college offers BCA in Artificial Intelligence and Machine Learning. The program is 3 years with 6 semesters, and the fee is ₹1,10,000.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // BCA HOD
    // --------------------------------------

    if (
        containsAny(q, [
            "who is bca hod",
            "bca hod",
            "head of bca",
            "bca head of department"
        ])
    ) {

        displayAnswer(
            `The BCA HOD is ${collegeData.hods.bca}.`,
            null,
            "second-floor"
        );

        return;
    }

    // --------------------------------------
// B.COM HOD
// --------------------------------------

if (
    containsAny(q, [
        "who is bcom hod",
        "bcom hod",
        "who is the bcom hod",
        "head of bcom",
        "bcom head of department",
        "who heads bcom"
    ])
) {

    displayAnswer(
        `The B.Com HOD is ${collegeData.hods.bcom}.`,
        null,
        "third-floor"
    );

    return;
}


// --------------------------------------
// BBA HOD
// --------------------------------------

if (
    containsAny(q, [
        "who is bba hod",
        "bba hod",
        "who is the bba hod",
        "head of bba",
        "bba head of department",
        "who heads bba"
    ])
) {

    displayAnswer(
        `The BBA HOD is ${collegeData.hods.bba}.`,
        null,
        "third-floor"
    );

    return;
}

    // --------------------------------------
    // BCOM
    // --------------------------------------

    if (
        containsAny(q, [
            "bcom course",
            "bcom program",
            "courses in bcom"
        ])
    ) {

        displayAnswer(
            "The college offers B.Com in Business Data Analytics and B.Com in Accounting and Finance. Both programs are 3 years with 6 semesters.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // BCOM FEE
    // --------------------------------------

    if (
        containsAny(q, [
            "bcom fee",
            "bcom fees",
            "fee for bcom"
        ])
    ) {

        displayAnswer(
            "The B.Com fee is ₹60,000.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // BBA
    // --------------------------------------

    if (
        containsAny(q, [
            "bba course",
            "bba program",
            "does college have bba"
        ])
    ) {

        displayAnswer(
            "The college offers BBA in Entrepreneurship and Business Management. The program is 3 years with 6 semesters.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // BBA FEE
    // --------------------------------------

    if (
        containsAny(q, [
            "bba fee",
            "bba fees",
            "fee for bba"
        ])
    ) {

        displayAnswer(
            "The BBA fee is ₹80,000.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // LANGUAGES
    // --------------------------------------

    if (
        containsAny(q, [
            "which languages",
            "what languages",
            "language options",
            "second language",
            "languages offered"
        ])
    ) {

        displayAnswer(
            "English is compulsory. Students can choose one additional language from Kannada, Hindi, or Sanskrit.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // COLLEGE TIMING
    // --------------------------------------

    if (
        containsAny(q, [
            "college timing",
            "college timings",
            "when does college start",
            "what time does college start",
            "college starts at"
        ])
    ) {

        displayAnswer(
            `Regular college hours are ${collegeData.timings.regularCollege}. Students should be in college by ${collegeData.timings.arrival}`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // SATURDAY
    // --------------------------------------

    if (
        containsAny(q, [
            "saturday timing",
            "what about saturday",
            "college on saturday",
            "saturday college"
        ])
    ) {

        displayAnswer(
            collegeData.timings.saturday,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // SUNDAY
    // --------------------------------------

    if (
        containsAny(q, [
            "is sunday holiday",
            "sunday college",
            "college on sunday"
        ])
    ) {

        displayAnswer(
            "Sunday is a holiday.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // LIBRARY LOCATION
    // --------------------------------------

    if (
        containsAny(q, [
            "where is the library",
            "wheres the library",
            "library location",
            "where can i find the library",
            "where is library",
            "how do i get to the library",
            "library located",
            "library"
        ])
    ) {

        const location =
            collegeData.specialLocations.library;

        displayAnswer(
            `The library is on the ${location.floor.toLowerCase()}, on the left side when entering the floor. It is open from ${collegeData.timings.library}.`,
            "images/library.jpg.jpeg",
            location.map
        );

        return;
    }


    // --------------------------------------
    // COMPUTER LAB
    // --------------------------------------

    if (
        containsAny(q, [
            "where is the computer lab",
            "wheres the computer lab",
            "computer lab location",
            "where can i find the computer lab",
            "where is computer lab",
            "how do i get to the computer lab",
            "computer lab"
        ])
    ) {

        const location =
            collegeData.specialLocations.computerLab;

        displayAnswer(
            location.description,
             "images/computer-lab.jpg.jpeg",
            location.map
        );

        return;
    }
    
    // PRINCIPAL OFFICE LOCATION
    // --------------------------------------

    if (
        containsAny(q, [
            "where is the principal office",
            "where is principal room",
            "where is the principal",
            "principal office location",
            "principal office"
        ])
    ) {

        const location =
            collegeData.specialLocations.principal;

        displayAnswer(
            location.description,
            null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // ADMISSION OFFICE
    // --------------------------------------

    if (
        containsAny(q, [
            "where is admission office",
            "where is the admission office",
            "where can i apply",
            "admission office location",
            "where is inquiry office",
            "admission office"
        ])
    ) {

        const location =
            collegeData.specialLocations.admissionOffice;

        displayAnswer(
            location.description,
            null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // FEE OFFICE
    // --------------------------------------

    if (
        containsAny(q, [
            "where do i pay fees",
            "where is fee office",
            "where can i pay fees",
            "fee payment office",
            "fee office location",
            "fee office"
        ])
    ) {

        const location =
            collegeData.specialLocations.feeOffice;

        displayAnswer(
            location.description,
            null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // CANTEEN
    // --------------------------------------

    if (
        containsAny(q, [
            "where is the canteen",
            "wheres the canteen",
            "canteen location",
            "where can i find the canteen",
            "how do i get to the canteen",
            "canteen"
        ])
    ) {

        const location =
            collegeData.specialLocations.canteen;

        displayAnswer(
            location.description,
            null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // PARKING
    // --------------------------------------

    if (
        containsAny(q, [
            "where is parking",
            "where is the parking",
            "student parking",
            "parking location",
            "where can i park",
            "parking"
        ])
    ) {

        const location =
            collegeData.specialLocations.parking;

        displayAnswer(
            location.description,
            null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // AUDITORIUM
    // --------------------------------------

    if (
        containsAny(q, [
            "where is auditorium",
            "where is the auditorium",
            "auditorium location",
            "where can i find auditorium",
            "auditorium"
        ])
    ) {

        const location =
            collegeData.specialLocations.auditorium;

        displayAnswer(
            location.description,
            location.image || null,
            location.map
        );

        return;
    }


    // --------------------------------------
    // MBA
    // --------------------------------------

    // ----------------------------------------
// MBA LOCATION
// ----------------------------------------

if (
    containsAny(q, [
        "where is mba",
        "where is the mba",
        "mba location",
        "where is the mba classroom",
        "where is mba classroom",
        "mba classroom location",
        "where is the mba block",
        "where is mba block",
        "mba block location",
        "where can i find mba",
        "where can i find the mba",
        "where can i find mba classroom",
        "where can i find the mba block",
        "how do i get to mba",
        "how do i get to the mba classroom",
        "how do i get to the mba block",
        "where is mba department",
        "where is the mba department",
        "mba department location",
        "mba"
    ])
) {
    displayAnswer(
        "The MBA classrooms and MBA block are located in the MBA section of the college.",
        "images/mba.jpg.jpeg"
    );

    return;
}


    // --------------------------------------
    // FACILITIES
    // --------------------------------------

    if (
        containsAny(q, [
            "what facilities",
            "college facilities",
            "facilities available",
            "what does the college have",
            "facilities"
        ])
    ) {

        displayAnswer(
            `The college has ${collegeData.facilities.join(", ")}.`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // HOSTEL
    // --------------------------------------

    if (
        containsAny(q, [
            "does college have hostel",
            "college hostel",
            "is there hostel",
            "hostel available"
        ])
    ) {

        displayAnswer(
            "The college does not have a college hostel.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // TRANSPORT
    // --------------------------------------

    if (
        containsAny(q, [
            "college bus",
            "college transport",
            "transport facility",
            "does college have transport"
        ])
    ) {

        displayAnswer(
            "The degree college does not have college transport buses. School transport is available separately.",
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // CLUBS / ACTIVITIES
    // --------------------------------------

    if (
        containsAny(q, [
            "clubs",
            "college clubs",
            "activities",
            "student activities",
            "what activities are there"
        ])
    ) {

        displayAnswer(
            `Students can participate in activities such as ${collegeData.clubsAndActivities.join(", ")}.`,
            null,
            null
        );

        return;
    }


    // --------------------------------------
    // UNKNOWN QUESTION
    // --------------------------------------

    const unknownAnswer =
        "I’m sorry, but I’m currently trained to answer only questions related to the information available in Campus Compass. For updated or additional information, please visit the official college website or contact the college directly using the official phone number or email address. I’ll be able to assist you once my information is updated. Do you have any other questions?";

    displayAnswer(
        unknownAnswer,
        null,
        null
    );
}


// ------------------------------------------
// DISPLAY ANSWER
// ------------------------------------------

function displayAnswer(answer, imagePath, mapContent) {

    const answerArea =
        document.getElementById("answerArea");

    const answerText =
        document.getElementById("answerText");

    answerText.textContent = answer;

    answerArea.classList.remove("hidden");


    // --------------------------------------
    // IMAGE
    // --------------------------------------

    const imageContainer =
        document.getElementById("answerImageContainer");

    const answerImage =
        document.getElementById("answerImage");

    if (imagePath) {

        answerImage.src = imagePath;

        imageContainer.classList.remove("hidden");

    } else {

        imageContainer.classList.add("hidden");
}
// --------------------------------------
    // MAP / FLOOR INFORMATION
    // --------------------------------------

    const mapContainer =
        document.getElementById("mapContainer");

    const mapContentElement =
        document.getElementById("mapContent");

    if (mapContent) {

        mapContentElement.innerHTML =
            createMapDisplay(mapContent);

        mapContainer.classList.remove("hidden");

    } else {

        mapContainer.classList.add("hidden");
    }


    // --------------------------------------
    // SPEAK SAME ANSWER
    // --------------------------------------

    speakAnswer();
}


// ------------------------------------------
// CREATE SIMPLE FLOOR MAP DISPLAY
// ------------------------------------------

function createMapDisplay(floor) {

    const floorNames = {

        "basement": "Basement",
        "ground-floor": "Ground Floor",
        "first-floor": "First Floor",
        "second-floor": "Second Floor",
        "third-floor": "Third Floor",
        "fourth-floor": "Fourth Floor",
        "fifth-floor": "Fifth Floor"
    };

    const floorName =
        floorNames[floor] || floor;

    return `
        <div style="
            padding: 25px;
            border-radius: 15px;
            background: #eef4ff;
            text-align: center;
        ">
            <div style="font-size: 45px;">📍</div>

            <h3>${floorName}</h3>

            <p>
                This location is on the
                <strong>${floorName}</strong>.
            </p>

            <div style="
                margin-top: 15px;
                padding: 15px;
                border: 2px dashed #172b4d;
                border-radius: 12px;
            ">
                Campus Compass Location
            </div>
        </div>
    `;
}


// ------------------------------------------
// TEXT-TO-SPEECH
// ------------------------------------------

function speakAnswer() {

    if (!("speechSynthesis" in window)) {

        console.log(
            "Speech synthesis is not supported."
        );

        return;
    }

    const answer =
        document.getElementById("answerText").textContent;

    if (!answer) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(answer);

    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}


// ------------------------------------------
// ASK ANOTHER QUESTION
// ------------------------------------------

function askAnotherQuestion() {

    // Stop the previous answer immediately
    speechSynthesis.cancel();

    // Hide the previous answer
    document.getElementById("answerArea").classList.add("hidden");

    // Clear the previous question
    document.getElementById("questionText").textContent =
        "Listening for your next question...";

    // Clear typed question
    document.getElementById("textQuestion").value = "";

    // Start listening for the new question
    startListening();
}


// ------------------------------------------
// START PROJECT
// ------------------------------------------

loadCollegeData();
