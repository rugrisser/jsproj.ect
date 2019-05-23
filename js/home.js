'use strict';

function getCookie(name) {

    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;

}

let user = getCookie('user');

if (user == undefined)
    window.location.replace('login.html');
else {

    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'api/get_projects.php?login=' + user, true);
    xhr.send();

    xhr.addEventListener('readystatechange', function(){

        if (xhr.readyState == 4 && xhr.status == 200) {

            let card = `<div class="cardLayout col-6 col-xl-4 col-lg-4 col-md-6 col-sm-6 align-self-center" style="height: 100%;">

                            <a href="project.html?id={{id}}" style="color: white;">

                                <div class="boardCard card bg-dark text-white" style="background-image: url('{{background}}');">
                                    
                                    <h1>{{title}}</h1>

                                </div>

                            </a>

                        </div>`;

            let json = JSON.parse(xhr.responseText);
            //console.log(json);
            let template = Handlebars.compile(card);

            for (let element of json)
                document.querySelector("#projlist").innerHTML += template(element);

        }

    });

}

$( document ).ready(function() {

    addCard.addEventListener('click', function(){
        
        $("#exampleModalCenter").modal('show');

        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'api/get_projects_list.php', true);
        xhr.send();

        xhr.addEventListener('readystatechange', function(){

            if (xhr.readyState == 4 && xhr.status == 200) {

                let json = JSON.parse(xhr.responseText);
                let card = `<div class="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12">

                                <div class="card">

                                    <img src="{{img}}" class="card-img-top">
                                    <div class="card-body">

                                        <h5 class="card-title">{{title}}</h5>
                                        <p class="card-text">{{desc}}</p>
                                        <input id="cardInp{{id}}" type="text" class="form-control" placeholder="Название" aria-label="Username" aria-describedby="basic-addon1" style="margin-bottom: 7%;">
                                        <button id="cardBut{{id}}" type="button" class="btn btn-primary" style="width: 100%;">Создать</button>

                                    </div>

                                </div>

                            </div>`;

                let template = Handlebars.compile(card);

                for (let element of json)
                    document.querySelector("#modalContainer").innerHTML += template(element);
                for (let element of json) {

                    document.querySelector("#cardBut" + element.id).addEventListener('click', function(){

                        let createXHR = new XMLHttpRequest();
                        let title = document.querySelector("#cardInp" + element.id).value;

                        createXHR.open('GET', 'api/create_project.php?login=' + user + '&id=' + element.id + '&title=' + title, true);
                        createXHR.send();

                        createXHR.addEventListener('readystatechange', function(){

                            if (createXHR.readyState == 4 && createXHR.status == 200) {

                                

                            }

                        });

                    });
                }

            }

        });

    });

}); 
