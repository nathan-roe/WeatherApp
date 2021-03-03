$(document).ready(() => {
    $("header").on("click", "#toggleOn", () => {
        $("#cssLink").attr("href", "css/light_styles.css");
        $("#toggleOn").replaceWith(`<svg id='toggleOff' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16">
            <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
        </svg>`);

        initMap();
    });
    $("header").on("click", "#toggleOff", () => {
        $("#cssLink").attr("href", "css/dark_styles.css");
        $("#toggleOff").replaceWith(`<svg id='toggleOn' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-toggle-on" viewBox="0 0 16 16">
            <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
        </svg>`);
        let styleArr = [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ];
        let graphColor = {"border": 'rgb(213,149,99)',"background":'rgba(64,78,103, 1)'}
        initMap(styleArr, graphColor);
    });
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
          detect_on: "canvas",
          events: {
            onclick: { enable: true, mode: "repulse" },
            onhover: {
              enable: true,
              mode: "bubble",
              parallax: { enable: false, force: 2, smooth: 10 }
            },
            resize: true
          },
          modes: {
            bubble: { distance: 200, duration: 2, opacity: 0, size: 0, speed: 3 },
            grab: { distance: 400, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
            repulse: { distance: 400, duration: 0.4 }
          }
        },
        particles: {
          color: { value: "#ffffff" },
          line_linked: {
            color: "#ffffff",
            distance: 150,
            enable: false,
            opacity: 0.4,
            width: 1
          },
          move: {
            attract: { enable: false, rotateX: 600, rotateY: 600 },
            bounce: false,
            direction: "none",
            enable: true,
            out_mode: "out",
            random: true,
            speed: 0.3,
            straight: false
          },
          number: { density: { enable: true, value_area: 800 }, value: 600 },
          opacity: {
            anim: { enable: true, opacity_min: 0.3, speed: 5, sync: false },
            random: {
              enable: true,
              minimumValue: 0.3
            },
            value: 0.6
          },
          shape: {
            type: "circle"
          },
          size: {
            anim: { enable: false, size_min: 0.3, speed: 4, sync: false },
            random: false,
            value: 1
          }
        },
        retina_detect: true
      });
});
// initialize map and make api requests on click of map/autocomplete
function initMap(styles=[], graphColor={"border":'rgb(255,198,145)', "background":'rgb(120,169,204)'}) {
    $(".data") != undefined ? $(".data").remove() : ''; 
    let map;
    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
    };
    const styleArr = styles
        
    const input = document.getElementById("input");
    const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name"],
        origin: center,
        strictBounds: false,
        types: ["establishment"],
    };
    // autocomplete for input and listener
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        var place = autocomplete.getPlace();
        if(place.geometry !== undefined){
            $("#address") != undefined ? $("#address").remove() : '';
            $("header").prepend(`<span id='addressWrapper'><h2 id='address'>${$("input").val()}</h2></span>`);
            $.ajax({
                url: `http://www.7timer.info/bin/api.pl?lon=${place.geometry.location.lng()}&lat=${place.geometry.location.lat()}&product=civillight&output=json`,
                type: "get",
                beforeSend: () => {
                    let svg = `
                        <svg id='load' version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" height="10vh" width="10vw">
                        <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
                        c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
                            <animateTransform 
                                attributeName="transform" 
                                attributeType="XML" 
                                type="rotate"
                                dur="2s" 
                                from="0 50 50"
                                to="360 50 50" 
                                repeatCount="indefinite" />
                        </path>
                        <path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
                        c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
                            <animateTransform 
                                attributeName="transform" 
                                attributeType="XML" 
                                type="rotate"
                                dur="1s" 
                                from="0 50 50"
                                to="-360 50 50" 
                                repeatCount="indefinite" />
                        </path>
                        <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
                        L82,35.7z">
                            <animateTransform 
                                attributeName="transform" 
                                attributeType="XML" 
                                type="rotate"
                                dur="2s" 
                                from="0 50 50"
                                to="360 50 50" 
                                repeatCount="indefinite" />
                        </path>
                        </svg>`;
                    $("body").append(svg);
                    window.scroll({
                        top: 0, 
                        left: 0, 
                        behavior: 'smooth' 
                    });
                    const center = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                    map.panTo(center);
                },
                success: res => {
                    $.ajax({
                        url: `http://www.7timer.info/bin/api.pl?lon=${place.geometry.location.lng()}&lat=${place.geometry.location.lat()}&product=civil&output=json`,
                        type: 'get',
                        success: civilRes => {
                            // timepoint is hours ahead of init -> timepoint[i] + 3 == timepoint[i+1]
                            let resObj = JSON.parse(civilRes);
                            let civilArr = [];
                            let today = new Date();
                            let hourNow = today.getHours(); // returns 0-23
                            let count = 0;
                            let i = 0;
                            // sets count to however many timepoints are left today
                            while(hourNow + resObj.dataseries[i].timepoint < 23){
                                count++;
                                i++;
                            }
                            for(let i=count;i<resObj.dataseries.length-1;i++){
                                if(civilArr.length <= 55){
                                    civilArr.push(resObj.dataseries[i]);
                                }
                                else{
                                    break;
                                }
                            }
                            handleSuccess(res, civilArr, graphColor);
                        }
                    });
                }
            });
        }
        else{
            $("#address") != undefined ? $("#address").remove() : ''
            $("body").append(`
                <div id='inputError'>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-outlet" viewBox="0 0 16 16">
                    <path d="M3.34 2.994c.275-.338.68-.494 1.074-.494h7.172c.393 0 .798.156 1.074.494.578.708 1.84 2.534 1.84 5.006 0 2.472-1.262 4.297-1.84 5.006-.276.338-.68.494-1.074.494H4.414c-.394 0-.799-.156-1.074-.494C2.762 12.297 1.5 10.472 1.5 8c0-2.472 1.262-4.297 1.84-5.006zm1.074.506a.376.376 0 0 0-.299.126C3.599 4.259 2.5 5.863 2.5 8c0 2.137 1.099 3.74 1.615 4.374.06.073.163.126.3.126h7.17c.137 0 .24-.053.3-.126.516-.633 1.615-2.237 1.615-4.374 0-2.137-1.099-3.74-1.615-4.374a.376.376 0 0 0-.3-.126h-7.17z"/>
                <path d="M6 5.5a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM7 10v1h2v-1a1 1 0 0 0-2 0z"/>
                </svg>
                    <p>Sorry, I don't know that one...</p>
                    <p>Try using the map!</p>
                </div>
            `);
            setTimeout(function(){
                $('#inputError').remove();
            }, 3000);
        }
    });
    const myLatlng = { lat: -25.363, lng: 131.044 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: myLatlng,
        styles: styleArr,
        gestureHandling: 'greedy',
        draggable: true
    });
    // event listener for map click
    map.addListener("click", (mapsMouseEvent) => {
        let latLng = mapsMouseEvent.latLng.toJSON();
        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng['lat']},${latLng['lng']}&key=AIzaSyACnNLB8jnPQN60eyqrr5fF39gmNIijpu8`,
            type: 'get',
            success: res => {
                console.log(res);
                console.log(res.results[0].formatted_address);
                if(res.results[0].formatted_address !== undefined){
                    $("#address") != undefined ? $("#address").remove() : ''
                    $("header").prepend(`<span id='addressWrapper'><h2 id='address'>${res.results[0].formatted_address}</h2></span>`);
                }
            },
            error: err=> {
                console.log(err);
            }
        })
        $.ajax({
            url: `http://www.7timer.info/bin/api.pl?lon=${latLng['lng']}&lat=${latLng['lat']}&product=civillight&output=json`,
            type: "get",
            beforeSend: () => {
                let svg = `
                    <svg id='load' version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" height="10vh" width="10vw">
                    <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
                    c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
                        <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="2s" 
                            from="0 50 50"
                            to="360 50 50" 
                            repeatCount="indefinite" />
                    </path>
                    <path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
                    c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
                        <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="1s" 
                            from="0 50 50"
                            to="-360 50 50" 
                            repeatCount="indefinite" />
                    </path>
                    <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
                    L82,35.7z">
                        <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="2s" 
                            from="0 50 50"
                            to="360 50 50" 
                            repeatCount="indefinite" />
                    </path>
                    </svg>`;
                // pan to clicked location
                const center = new google.maps.LatLng(latLng['lat'], latLng['lng']);
                map.panTo(center);

                $("body").append(svg);
            },
            success: res => {
                $.ajax({
                    url: `http://www.7timer.info/bin/api.pl?lon=${latLng['lng']}&lat=${latLng['lat']}&product=civil&output=json`,
                    type: 'get',
                    success: civilRes => {
                        // timepoint is hours ahead of init -> timepoint[i] + 3 == timepoint[i+1]
                        let resObj = JSON.parse(civilRes);
                        let civilArr = [];
                        let today = new Date();
                        let hourNow = today.getHours(); // returns 0-23
                        let count = 0;
                        let i = 0;
                        // sets count to however many timepoints are left today
                        while(hourNow + resObj.dataseries[i].timepoint < 23){
                            count++;
                            i++;
                        }
                        for(let i=count;i<resObj.dataseries.length-1;i++){
                            if(civilArr.length <= 55){
                                civilArr.push(resObj.dataseries[i]);
                            }
                            else{
                                break;
                            }
                        }
                        handleSuccess(res, civilArr, graphColor);
                    }
                });
            }
        });
    });
}
// given the weather str from api return object with svg and full name
const alterWeather = str => {
    const rain = () => {
        $("#weather") !== undefined ? $(".weatherWrapper").remove() : '';
        $(".data").append("<div class='weatherWrapper'><div id='weather'></div></div>");
        tsParticles.load("weather", {
            detectRetina: true,
            fpsLimit: 60,
            interactivity: {
            detectsOn: "canvas",
            events: {
                onClick: {
                enable: false,
                mode: "repulse"
                },
                onDiv: {
                elementId: "repulse-div",
                enable: false,
                mode: "repulse"
                },
                onHover: {
                enable: false,
                mode: "repulse",
                parallax: {
                    enable: false,
                    force: 60,
                    smooth: 10
                }
                },
                resize: true
            },
            modes: {
                bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
                speed: 3
                },
                connect: {
                distance: 80,
                lineLinked: {
                    opacity: 0.5
                },
                radius: 60
                },
                grab: {
                distance: 400,
                lineLinked: {
                    opacity: 1
                }
                },
                push: {
                quantity: 4
                },
                remove: {
                quantity: 2
                },
                repulse: {
                distance: 200,
                duration: 0.4
                }
            }
            },
            particles: {
            color: {
                value: "#ffffff"
            },
            lineLinked: {
                blink: false,
                color: "#000",
                consent: false,
                distance: 150,
                enable: false,
                opacity: 0,
                width: 0
            },
            rotate: {
                value: 0,
                random: false,
                direction: "clockwise",
                animation: {
                enable: false,
                speed: 5,
                sync: false
                }
            },
            move: {
                attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
                },
                bounce: false,
                direction: "bottom",
                enable: true,
                outMode: "out",
                random: true,
                speed: 30,
                straight: true
            },
            number: {
                density: {
                enable: true,
                area: 800
                },
                limit: 0,
                value: 200
            },
            opacity: {
                animation: {
                enable: false,
                minimumValue: 0.1,
                speed: 1,
                sync: false
                },
                random: false,
                value: 0.5
            },
            shape: {
                character: {
                fill: false,
                font: "Verdana",
                style: "",
                value: "*",
                weight: "400"
                },
                image: [],
                polygon: {
                nb_sides: 5
                },
                stroke: {
                color: "#efefefee",
                width: 1
                },
                type: "line"
            },
            size: {
                animation: {
                enable: false,
                minimumValue: 0.1,
                speed: 40,
                sync: false
                },
                random: false,
                value: 5
            }
            },
            polygon: {
            draw: {
                enable: false,
                lineColor: "#ffffff",
                lineWidth: 0.5
            },
            move: {
                radius: 10
            },
            scale: 1,
            type: "none",
            url: ""
            }
        });
    }
    const snow = () => {
        $("#weather") !== undefined ? $(".weatherWrapper").remove() : '';
        $(".data").append("<div class='weatherWrapper'><div id='weather'></div></div>");
        $(".weatherWrapper").append("<div id='weather'></div>");
        
        tsParticles.load("weather", {
            fps_limit: 60,
            interactivity: {
            detect_on: "canvas",
            events: {
                
            },
            modes: {
                bubble: { distance: 400, duration: 0.3, opacity: 1, size: 1, speed: 3 },
                grab: { distance: 400, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
                repulse: { distance: 200, duration: 0.4 }
            }
            },
            particles: {
            color: { value: "#fff" },
            line_linked: {
                color: "#ffffff",
                distance: 500,
                enable: false,
                opacity: 0.4,
                width: 1
            },
            move: {
                attract: { enable: false, rotateX: 600, rotateY: 1200 },
                bounce: false,
                direction: "bottom",
                enable: true,
                out_mode: "out",
                random: false,
                size: true,
                speed: 3,
                straight: false
            },
            number: { density: { enable: true, value_area: 800 }, value: 200 },
            opacity: {
                anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
                random: true,
                value: 0.5
            },
            shape: {
                character: {
                fill: false,
                font: "Verdana",
                style: "",
                value: "*",
                weight: "400"
                },
                image: {
                height: 100,
                replace_color: true,
                src: "images/github.svg",
                width: 100
                },
                polygon: { nb_sides: 5 },
                stroke: { color: "#000000", width: 0 },
                type: "circle"
            },
            size: {
                anim: { enable: false, size_min: 0.1, speed: 40, sync: false },
                random: true,
                value: 10
            }
            },
            polygon: {
            draw: { enable: false, lineColor: "#ffffff", lineWidth: 0.5 },
            move: { radius: 10 },
            scale: 1,
            type: "none",
            },
            retina_detect: true
        });
    }
    switch(str){
        case 'clear':
            return {'name': "Clear Skies", 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>`};
            break;
        case 'pcloudy':
            return {'name': 'Partly Cloudy', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-sun-fill" viewBox="0 0 16 16">
                <path d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"/>
                <path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
            </svg>`}
            break;
        case 'mcloudy':
        case'cloudy':
            return {'name': "Cloudy", 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloudy-fill" viewBox="0 0 16 16">
                <path d="M13.405 7.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 13H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`};
            break;
        case 'lightrain':
            rain();
            return {'name': "Light Rain", 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-drizzle-fill" viewBox="0 0 16 16">
                <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`};
            break;
        case 'rain':
            rain();
            return {'name': 'Rain', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-rain-heavy-fill" viewBox="0 0 16 16">
                <path d="M4.176 11.032a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm.229-7.005a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`};
            break;
        case 'oshower':
            rain();
            return {'name': 'Rain', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-umbrella-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394A3.166 3.166 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.484 3.484 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a2.958 2.958 0 0 1-.298 1.102 2.257 2.257 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.255 2.255 0 0 1-.763-.88 2.958 2.958 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a1.958 1.958 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a1.958 1.958 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.482 3.482 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5c-.149 0-.352-.145-.352-.145l-.004-.004a3.482 3.482 0 0 0-.58-.417A3.166 3.166 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.482 3.482 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0z"/>
            </svg>`};

        case 'ishower':
            snow();
            return {'name': 'Snow and Rain', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-snow-fill" viewBox="0 0 16 16">
                <path d="M2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 1 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-.22-7.223a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`}
        case 'snow':
            snow();
            return {'name': 'Snow', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-snow-fill" viewBox="0 0 16 16">
                <path d="M2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 1 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-.22-7.223a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`}
        case 'humid':
            return {'name': 'Humid', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-moisture" viewBox="0 0 16 16">
                <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-2zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a28.458 28.458 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a28.458 28.458 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001L7 1.5zm0 0l-.364-.343L7 1.5zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267z"/>
            </svg>`}
        case 'lightsnow':
            snow();
            return {'name': 'Light Snow', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-snow" viewBox="0 0 16 16">
                <path d="M13.405 4.277a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973zM8.5 1.25a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1.25zM2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25z"/>
            </svg>`}
        case 'ts':
            return {'name': 'Thunder Storm', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-lightning-fill" viewBox="0 0 16 16">
                <path d="M7.053 11.276A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2zm6.352-7.249a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`}
        case 'tsrain':
            rain();
            return {'name': 'Thunder and Rain', 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-cloud-lightning-rain-fill" viewBox="0 0 16 16">
                <path d="M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.105-1.25A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2zm6.352-7.249a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973z"/>
            </svg>`}
        default:
            return {'name': "Unknown", 'svg': `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-emoji-dizzy-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            </svg>`};
            break;
    }
}
// change date format from input type: 20210327 to 03/27/2021
const alterDate = num => {
    let arr = num.toString().split("");
    arr.splice(6, 0, '/');
    arr.splice(arr.length, 0, '/');
    let date = [ ...arr.splice(4,6), ...arr.splice(6), ...arr.splice(0, 4)].join("").toString();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let parts = date.split('/');
    let day = new Date(parts[2], parts[0] - 1, parts[1]);
    return {'date': date, 'day': days[day.getDay()]};
}
// append second part of page and display api information (civil & civillight)
const handleSuccess = (res, civilArr, graphColor) => {
    let next7Days = [];
    var resObj = JSON.parse(res);
    let j = 0;

    // append new page and remove input value and load svg
    $(".data") !== undefined ? $(".data").remove() : '';
    $("#input").val(''); 
    $("body").append(`<div class="data"></div>`);
    $(document).scrollTop($(document).height());
    $('#load').remove();
    $(".data").append("<content id='forecastWrapper'><div class='forecast'></div></content>");

    // Create date/weather cards
    for(let i=0;i<resObj.dataseries.length;i++){
        next7Days.push({
            "day":alterDate(resObj.dataseries[i].date).day, 
            "avgTemp": (((resObj.dataseries[i].temp2m.max * 9/5) + 32) + ((resObj.dataseries[i].temp2m.min* 9/5) + 32))/2
        });
        $(".forecast").append(`
            <div class='day'>
                <div id='dayHeader'>
                    <h3>${alterDate(resObj.dataseries[i].date).day}</h3>
                    <span>${alterWeather(resObj.dataseries[i].weather).svg}</span>
                </div>
                <div id='dayMain'>
                    <p>${alterWeather(resObj.dataseries[i].weather).name}</p>
                    <p>${((resObj.dataseries[i].temp2m.max * 9/5) + 32).toFixed(1)}°F / ${((resObj.dataseries[i].temp2m.min * 9/5) + 32).toFixed(1)}°F</p>
                    <p>
                        wind: ${resObj.dataseries[i].wind10m_max}mph ${civilArr[j].wind10m.direction}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wind" viewBox="0 0 16 16">
                            <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z"/>
                        </svg> 
                    </p>
                    <p id='dayDate'>${alterDate(resObj.dataseries[i].date).date}</p>
                </div>
            </div>
        `);
        j += 8;
    }
    // Create graph based on civil api data
    $(".data").append(`<content id="chartWrapper"><canvas id="myChart"></canvas></content>`);
    $(".data").append(`<div id='chartLabels'></div>`);
    for(let i=0;i<next7Days.length;i++){
        $("#chartLabels").append(`<span>${next7Days[i].day}</span>`);
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...civilArr.map(val => '')],
            datasets: [{
                label: "The Coming Week's Average Temperatures",
                data: [...civilArr.map(val => (val.temp2m* 9/5) + 32)],
                backgroundColor: [...civilArr.map(val => graphColor.background)],
                borderColor: [...civilArr.map(val => graphColor.border)],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontColor: "white"
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }]
                
            }
        }
    });
}